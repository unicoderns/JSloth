////////////////////////////////////////////////////////////////////////////////////////////
// The MIT License (MIT)                                                                  //
//                                                                                        //
// Copyright (C) 2016  Chriss Mejía - me@chrissmejia.com - chrissmejia.com                //
//                                                                                        //
// Permission is hereby granted, free of charge, to any person obtaining a copy           //
// of this software and associated documentation files (the "Software"), to deal          //
// in the Software without restriction, including without limitation the rights           //
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell              //
// copies of the Software, and to permit persons to whom the Software is                  //
// furnished to do so, subject to the following conditions:                               //
//                                                                                        //
// The above copyright notice and this permission notice shall be included in all         //
// copies or substantial portions of the Software.                                        //
//                                                                                        //
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR             //
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,               //
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE            //
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER                 //
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,          //
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE          //
// SOFTWARE.                                                                              //
////////////////////////////////////////////////////////////////////////////////////////////

import * as express from "express";
import * as logger from "morgan";
import * as bodyParser from "body-parser";

import * as JSloth from "./core/lib/core";
import * as JSFiles from "./core/lib/files";

import Config from "./core/interfaces/Config";
import App from "./core/interfaces/App";

import * as routes from "./core/routes";

/**
 * Creates and configure an ExpressJS web server.
 *
 * @return express.Application
 */
class Server {

    /*** Express instance */
    public express: express.Application;

    /**
     * Stores the app port
     * @default System environment port or 3000
     */
    private port: number = process.env.PORT || 3000;

    /*** Default configuration filepath */
    private configPath: string = "/../config.json";

    /*** Configuration object */
    private config: Config;

    /*** JSloth library */
    private jsloth: JSloth.Load;

    /**
     * Load configuration settings
     * Set up JSloth Global Library
     * Install endpoints
     * Configure and run the Express App instance. 
     */
    constructor() {
        // Loading JSloth Files directly to load the config file.
        let jslothFiles = new JSFiles.Files();

        // Creating App
        this.express = express();

        // Loading Configuration
        console.log("Loading configuration");
        jslothFiles.ifExists(__dirname + this.configPath, () => {
            this.config = require(__dirname + this.configPath);

            // Loading JSloth Global Library
            console.log("Loading JSloth Library");
            this.jsloth = new JSloth.Load(this.config);

            // Installing Middlewares
            console.log("Installing middlewares");
            this.middleware();

            // Installing Middlewares
            console.log("Installing default apps");
            this.defaultApps();

            // Installing Endpoints
            console.log("Installing apps");
            this.config.installed_apps.forEach((item) => {
                this.install_app(item);
            });

            // Running server
            this.express.listen(this.port);
            console.log("The magic happens on port " + this.port);
        });
    }

    /*** Configure Express middlewares */
    private middleware(): void {
        this.express.use(logger("dev"));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }

    /*** Configure default endpoints */
    private defaultApps(): void {
        let route = new routes.Routes(this.jsloth);
        this.express.use("/", route.router);
        console.log("- Core routes installed");
    }

    /*** Install app */
    private install_app(config: App): void {
        // Compiling styles
        console.log("Generating styles for " + config.name);
        let exec = require("child_process").execSync;
        try {
            exec("node-sass --output-style compressed -o " + __dirname + "/" + config.name + " " + __dirname + "/../source/" + config.name, { stdio: [0, 1, 2] });
        } catch (e) {

        }
        // Installing regular routes
        this.jsloth.files.ifExists(__dirname + "/" + config.name + "/routes.js", () => {
            let appRoute = require("./" + config.name + "/routes");
            let route = new appRoute.Routes(this.jsloth);
            this.express.use("" + (config.basepath || "/"), route.router);
            console.log("- " + config.name + " routes installed");
        });
        // Installing api routes
        this.jsloth.files.ifExists(__dirname + "/" + config.name + "/api.js", () => {
            let appRoute = require("./" + config.name + "/api");
            let route = new appRoute.Routes(this.jsloth);
            this.express.use("/api" + (config.basepath || "/"), route.router);
            console.log("- " + config.name + " endpoint installed");
        });

        console.log(config.name + " finished");
    }

}

export default new Server().express;