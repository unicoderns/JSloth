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
            this.install_app(app, "system", next);
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
            this.install_app(app, "custom", next);
        });
    }

    /*** Install app */
    private install_app(app: app.App, type: string, next: express.NextFunction): void {
        let folder: string = "system";
        // Compiling styles
        let done = () => {
            if ((app.status.routes) && (app.status.api)) {
                console.log("");
                console.log("___");
                console.log("\n");
                app.status.done = true;
                next(this.apps);
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