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
import * as logger from "morgan";  // Log requests
import * as bodyParser from "body-parser"; // Parse incoming request bodies

import JSloth from "./lib/core";
import JSFiles from "./lib/files";

import Config from "./interfaces/config";
import * as App from "./interfaces/app";

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
     * Please note: the unary + converts to number
     */
    private port: number = +process.env.PORT || 3000;

    /*** Default configuration filepath */
    private configPath: string = "/../config.json";

    /*** Configuration object */
    private config: Config;

    /*** Apps object */
    private apps: App.App[] = [];

    /*** JSloth library */
    private jsloth: JSloth;

    /*** Batch process */
    private exec = require("child_process").execSync;

    /**
     * Load configuration settings
     * Set up JSloth Global Library
     * Install endpoints
     * Configure and run the Express App instance. 
     */
    constructor() {
        // Loading JSloth Files directly to load the config file.
        let jslothFiles = new JSFiles();

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
        jslothFiles.exists(__dirname + this.configPath).then(() => {
            this.config = require(__dirname + this.configPath);
            this.express.set("token", this.config.token); // secret token

            // Loading JSloth Global Library
            console.log(" * Loading JSloth Library \n");
            this.jsloth = new JSloth(this.config);
            this.express.set("jsloth", this.jsloth);

            // Installing Middlewares
            console.log(" * Installing middlewares \n");
            this.middleware();

            // Installing Middlewares
            // console.log(" * Installing default apps");
            // this.defaultApps();

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
        }).catch(err => {
            console.error("Configuration file not found");
        });
    }

    /*** Configure Express middlewares */
    private middleware(): void {
        // Log hits using morgan
        if (this.jsloth.config.dev) {
            this.express.use(logger("dev"));
        } else {
            this.express.use(logger("combined"));
        }
        // Use body parser so we can get info from POST and/or URL parameters
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }

    /*** Compile SCSS sources */
    private compileSCSS(from: string, to: string): void {
        try {
            // this.exec("node-sass --include-path " + __dirname + "/../node_modules/foundation-sites/scss --output-style compressed -o " + to + " " + from, { stdio: [0, 1, 2] });
            this.exec("node-sass --include-path " + __dirname + "/../node_modules/bootstrap/scss --output-style compressed -o " + to + " " + from, { stdio: [0, 1, 2] });
            console.log("\n");
        } catch (err) {
        }
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
        console.log("Generating styles");
        this.compileSCSS(__dirname + "/apps/" + app.config.name, "./dist/" + app.config.name);
        console.log("");
        // Installing regular routes
        this.jsloth.files.exists(__dirname + "/apps/" + app.config.name + "/routes.ts").then(() => {
            let appRoute = require("./apps/" + app.config.name + "/routes");
            let route = new appRoute.Urls(this.jsloth, app.config, [app.config.name]);
            this.express.use("" + (app.config.basepath || "/"), route.router);

            app.status.routes = true;
            console.log("- " + app.config.name + " routes installed");
            done();
        }).catch(err => {
            if (err.code === "ENOENT") {
                console.log("- " + app.config.name + " routes not found");
            } else {
                console.error(err);
            }
            app.status.routes = true;
            done();
        });

        // Installing api routes
        this.jsloth.files.exists(__dirname + "/apps/" + app.config.name + "/api.ts").then(() => {
            try {
                let appRoute = require("./apps/" + app.config.name + "/api");
                let route = new appRoute.Urls(this.jsloth, app.config, [app.config.name]);
                this.express.use("/api" + (app.config.basepath || "/"), route.router);

                app.status.api = true;
                console.log("- " + app.config.name + " endpoints installed");
                done();
            } catch (err) {
                console.error(err);
            }
        }).catch(err => {
            if (err.code === "ENOENT") {
                console.log("- " + app.config.name + " endpoints not found");
            } else {
                console.error(err);
            }
            app.status.api = true;
            done();
        });
    }

}

export default new Server().express;