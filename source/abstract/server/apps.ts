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
import * as express from "express";

import Batch from "./batch";
import Config from "../../interfaces/config";
import JSloth from "../../lib/core";
import Log from "./log";

/**
 * Configuration for JSloth apps.
 */
export default class Apps {

    /*** Apps object */
    private apps: app.App[] = [];

    /*** Configuration object */
    private config: Config;

    /*** Express instance */
    private express: express.Application;

    /*** JSloth library */
    private jsloth: JSloth;

    /**
     * Load configuration settings
     */
    constructor(config: Config, jsloth: JSloth, express: express.Application) {
        this.config = config;
        this.jsloth = jsloth;
        this.express = express;
    }

    // Installing Apps
    public install(next: express.NextFunction): void {
        Log.module("Installing system apps", "No system apps found", this.config.system_apps.length);
        this.config.system_apps.forEach((item) => {
            let app: app.App = {
                status: {
                    done: false,
                    routes: false,
                    api: false
                },
                installed: {
                    routes: false,
                    api: false
                },
                config: item
            };
            app.config.folder = "system";
            this.apps.push(app);
            this.install_app(app, "system", next);
        });

        Log.module("Installing custom apps", "No custom apps found", this.config.custom_apps.length);
        this.config.custom_apps.forEach((item) => {
            let app: app.App = {
                status: {
                    done: false,
                    routes: false,
                    api: false
                },
                installed: {
                    routes: false,
                    api: false
                },
                config: item
            };
            app.config.folder = "apps";
            this.apps.push(app);
            this.install_app(app, "custom", next);
        });
    }

    /*** Install app */
    private install_app(app: app.App, type: string, next: express.NextFunction): void {
        let folder: string = "system";
        // Compiling styles
        if (type == "custom") {
            folder = "apps"
        }

        // Installing regular routes
        this.jsloth.files.exists(__dirname + "/../../" + folder + "/" + app.config.name + "/routes.ts").then(() => {
            let url: string = "" + (app.config.basepath || "/");
            let appRoute = require("../../" + folder + "/" + app.config.name + "/routes");
            let route = new appRoute.Urls(this.jsloth, app.config, url, [app.config.name]);
            this.express.use(url, route.router);

            app.status.routes = true;
            app.installed.routes = true;
            this.installed(app, folder, next);
        }).catch(err => {
            if (err.code !== "ENOENT") {
                console.error(err);
            }
            app.status.routes = true;
            app.installed.routes = false;
            this.installed(app, folder, next);
        });

        // Installing api routes
        this.jsloth.files.exists(__dirname + "/../../" + folder + "/" + app.config.name + "/api.ts").then(() => {
            let url: string = "/api" + (app.config.basepath || "/");
            let appRoute = require("../../" + folder + "/" + app.config.name + "/api");
            let route = new appRoute.Urls(this.jsloth, app.config, url, [app.config.name]);
            this.express.use(url, route.router);

            app.status.api = true;
            app.installed.api = true;
            this.installed(app, folder, next);
        }).catch(err => {
            if (err.code !== "ENOENT") {
                console.error(err);
            }
            app.status.api = true;
            app.installed.api = false;
            this.installed(app, folder, next);
        });
    }
    /*** Check if everything is ok, and mark as installed */
    private installed(app: app.App, folder: string, next: express.NextFunction): void {
        if ((app.status.routes) && (app.status.api)) {
            Log.app(app.config.name);
            if (app.installed.routes) {
                console.log("- " + app.config.name + " routes installed");
            }
            if (app.installed.api) {
                console.log("- " + app.config.name + " endpoints installed");
            }
            
            console.log("Generating styles");
            Batch.compileSCSS(folder + "/" + app.config.name, app.config.name);
            
            console.log("");
            console.log("Publishing images");
            Batch.copy(folder + "/" + app.config.name + "/public/imgs/", "public/imgs/");
            console.log("");
            console.log("Publishing docs");
            Batch.copy(folder + "/" + app.config.name + "/public/docs/", app.config.name + "/public/docs/");
            console.log("");
            console.log("Publishing others");
            Batch.copy(folder + "/" + app.config.name + "/public/others/", app.config.name + "/public/others/");
            console.log("");
            console.log("___");
            console.log("\n");
            
            app.status.done = true;
            next(this.apps);
        }
    }
}