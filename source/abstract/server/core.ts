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

import * as app from "../../interfaces/app";
import * as bodyParser from "body-parser"; // Parse incoming request bodies
import * as express from "express";
import * as logger from "morgan";  // Log requests

import Batch from "./batch";
import Config from "../../interfaces/config";
import JSFiles from "../../lib/files";
import JSloth from "../../lib/core";
import Log from "./log";

/**
 * Creates and configure an ExpressJS web server.
 *
 * @return express.Application
 */
export default class Core {
    /*** Express instance */
    public express: express.Application;

    /**
     * Stores the app port
     * @default System environment port or 3000
     * Please note: the unary + converts to number
     */
    protected port: number = +process.env.PORT || 3000;

    /*** Default configuration filepath */
    protected configPath: string = "/../../../config.json";

    /*** Configuration object */
    protected config: Config;

    /*** Apps object */
    protected apps: app.App[] = [];

    /*** JSloth library */
    protected jsloth: JSloth;

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

        Log.hello();

        // Loading Configuration
        Log.title("Loading configuration");
        jslothFiles.exists(__dirname + this.configPath).then(() => {
            this.config = require(__dirname + this.configPath);
            this.express.set("token", this.config.token); // secret token

            this.install();
        }).catch(err => {
            if (err.code === "ENOENT") {
                console.error("Configuration file not found");
            } else {
                console.error("Something went wrong");
            }
            console.error(err);
        });
    }

    protected install(): void {
        // Loading JSloth Global Library
        Log.title("Loading core library");
        this.jsloth = new JSloth(this.config);
        this.express.set("jsloth", this.jsloth);

        // Installing Middlewares
        Log.title("Installing middlewares");
        this.middleware();

        // Installing Middlewares
        // console.log(" * Installing default apps");
        // this.defaultApps();

        // Installing Apps
        Log.title("Installing system apps", "No system apps found", this.config.system_apps.length);
        this.config.system_apps.forEach((item) => {
            let app: app.App = {
                status: {
                    done: false,
                    routes: false,
                    api: false
                },
                config: item
            };
            app.config.folder = "system";
            this.apps.push(app);
            this.install_app(app, "system");
        });

        Log.title("Installing custom apps");
        Log.title("Installing custom apps", "No custom apps found", this.config.custom_apps.length);
        this.config.custom_apps.forEach((item) => {
            let app: app.App = {
                status: {
                    done: false,
                    routes: false,
                    api: false
                },
                config: item
            };
            app.config.folder = "apps";
            this.apps.push(app);
            this.install_app(app, "custom");
        });
    }

    /*** Configure Express middlewares */
    protected middleware(): void {
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

    /*** Run the server */
    protected start(): void {
        let appCount = 0; // Number of checked apps so far
        let done = true; // All done

        let now = () => {
            // Everything is installed?
            if (done) {
                try {
                    this.express.listen(this.port);
                    console.log("The magic happens on port " + this.port);
                } catch (e) {
                    console.error(e);
                }
            }
        };
        
        this.apps.forEach((app) => {
            if (!app.status.done) {
                done = false;
            }
            appCount++;
            if (this.apps.length === appCount) {
                now();
            }
        });

    }

    /*** Install app */
    protected install_app(app: app.App, type: string): void {
        let folder: string = "system";
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

        if (type == "custom") {
            folder = "apps"
        }

        console.log("------------------------------------------------------");
        console.log("");
        console.log(app.config.name + " app...");
        console.log("");
        console.log("------------------------------------------------------");
        console.log("");
        console.log("Generating styles");
        Batch.compileSCSS(__dirname + "/../../" + folder + "/" + app.config.name, __dirname + "/../../../dist/" + app.config.name);
        console.log("");
        console.log("Publishing images");
        Batch.copy(__dirname + "/" + folder + "/" + app.config.name + "/public/imgs/", "./dist/" + app.config.name + "/public/imgs/");
        console.log("");
        console.log("Publishing docs");
        Batch.copy(__dirname + "/" + folder + "/" + app.config.name + "/public/docs/", "./dist/" + app.config.name + "/public/docs/");
        console.log("");
        console.log("Publishing others");
        Batch.copy(__dirname + "/" + folder + "/" + app.config.name + "/public/others/", "./dist/" + app.config.name + "/public/others/");
        console.log("");
        // Installing regular routes
        this.jsloth.files.exists(__dirname + "/" + folder + "/" + app.config.name + "/routes.ts").then(() => {
            let url: string = "" + (app.config.basepath || "/");
            let appRoute = require("./" + folder + "/" + app.config.name + "/routes");
            let route = new appRoute.Urls(this.jsloth, app.config, url, [app.config.name]);
            this.express.use(url, route.router);

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
        this.jsloth.files.exists(__dirname + "/" + folder + "/" + app.config.name + "/api.ts").then(() => {
            let url: string = "/api" + (app.config.basepath || "/");
            let appRoute = require("./" + folder + "/" + app.config.name + "/api");
            let route = new appRoute.Urls(this.jsloth, app.config, url, [app.config.name]);
            this.express.use(url, route.router);

            app.status.api = true;
            console.log("- " + app.config.name + " endpoints installed");
            done();
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