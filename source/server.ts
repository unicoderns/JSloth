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
import * as App from "./core/interfaces/App";

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

    /*** Apps object */
    private apps: App.App[] = [];

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

        console.log("******************************************************");
        console.log("*                                                    *");
        console.log("*      ██╗███████╗██╗      ██████╗ ████████╗██╗  ██╗ *");
        console.log("*      ██║██╔════╝██║     ██╔═══██╗╚══██╔══╝██║  ██║ *");
        console.log("*      ██║███████╗██║     ██║   ██║   ██║   ███████║ *");
        console.log("* ██   ██║╚════██║██║     ██║   ██║   ██║   ██╔══██║ *");
        console.log("* ╚█████╔╝███████║███████╗╚██████╔╝   ██║   ██║  ██║ *");
        console.log("*  ╚════╝ ╚══════╝╚══════╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝ *");
        console.log("*                                    by Chriss Mejía *");
        console.log("*                                                    *");
        console.log("******************************************************");
        console.log("*                                                    *");
        console.log("*                      Welcome                       *");
        console.log("*                                                    *");
        console.log("******************************************************");
        console.log("");

        // Loading Configuration
        console.log(" * Loading configuration \n");
        jslothFiles.ifExists(__dirname + this.configPath, () => {
            this.config = require(__dirname + this.configPath);
            this.express.set("token", this.config.token); // secret token

            // Loading JSloth Global Library
            console.log(" * Loading JSloth Library \n");
            this.jsloth = new JSloth.Load(this.config);

            // Installing Middlewares
            console.log(" * Installing middlewares \n");
            this.middleware();

            // Installing Middlewares
            console.log(" * Installing default apps");
            this.defaultApps();

            // Installing Endpoints
            console.log(" * Installing apps \n");
            this.config.installed_apps.forEach((item) => {
                let app: App.App = {
                    status: {
                        done: false,
                        routes: false,
                        api: false
                    },
                    config: item
                };
                this.apps.push(app);
                this.install_app(app);
            });
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
        console.log("   - Core routes installed \n");
    }

    /*** Run the server */
    private start(): void {
        let testCount = 0; // Number of checked apps so far
        let done = true; // All done

        this.apps.forEach((app) => {
            if (!app.status.done) {
                done = false;
            }
            testCount++;

            // Everything is installed?
            if ((this.apps.length === testCount) && (done)) {
                this.express.listen(this.port);
                console.log("The magic happens on port " + this.port);
            }
        });
    }

    /*** Install app */
    private install_app(app: App.App): void {
        // Compiling styles
        let done = () => {
            if ((app.status.routes) && (app.status.api)) {
                console.log("");
                console.log("___");
                console.log("\n");
                app.status.done = true;
                this.start();
            }
        };

        console.log("------------------------------------------------------");
        console.log("");
        console.log(app.config.name + " app...");
        console.log("");
        console.log("------------------------------------------------------");
        console.log("");
        console.log("Generating styles for " + app.config.name);
        let exec = require("child_process").execSync;
        try {
            exec("node-sass --output-style compressed -o " + __dirname + "/" + app.config.name + " " + __dirname + "/../source/" + app.config.name, { stdio: [0, 1, 2] });
            console.log("\n");
        } catch (e) {

        }
        console.log("Setting up");
        // Installing regular routes
        this.jsloth.files.exists(__dirname + "/" + app.config.name + "/routes.js", (exists: Boolean) => {
            if (exists) {
                let appRoute = require("./" + app.config.name + "/routes");
                let route = new appRoute.Routes(this.jsloth);
                this.express.use("" + (app.config.basepath || "/"), route.router);
            }
            app.status.routes = true;
            console.log("- " + app.config.name + " routes installed");
            done();
        });
        // Installing api routes
        this.jsloth.files.exists(__dirname + "/" + app.config.name + "/api.js", (exists: Boolean) => {
            if (exists) {
                let appRoute = require("./" + app.config.name + "/api");
                let route = new appRoute.Routes(this.jsloth);
                this.express.use("/api" + (app.config.basepath || "/"), route.router);
            }
            app.status.api = true;
            console.log("- " + app.config.name + " endpoints installed");
            done();
        });
    }

}

export default new Server().express;