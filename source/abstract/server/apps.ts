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

import { Application, NextFunction } from "express";

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
    private express: Application;

    /*** JSloth library */
    private jsloth: JSloth;

    /**
     * Load configuration settings
     */
    constructor(config: Config, jsloth: JSloth, express: Application) {
        this.config = config;
        this.jsloth = jsloth;
        this.express = express;
    }

    /*** Trigger app installation */
    public install(next: NextFunction): void {
        Log.module("System apps scanned", "No system apps found", this.config.system_apps.length);
        this.installApps(this.config.system_apps, "system", next);

        Log.module("Custom apps scanned", "No custom apps found", this.config.custom_apps.length);
        this.installApps(this.config.custom_apps, "apps", next);

        Log.appTitle();
    }

    /*** Return a empty app object */
    private emptyApp(): app.App {
        let app: app.App = {
            config: null,
            done: false,
            complete: {
                api: false,
                routes: false,
                public: false,
                scss: false
            },
            success: {
                api: false,
                routes: false,
                public: false,
                scss: false
            }
        };

        return app;
    }

    /*** Install apps */
    private installApps(apps: app.Config[], type: string, next: NextFunction): void {
        apps.forEach((item) => {
            let app = this.emptyApp();
            app.config = item;
            app.config.folder = type;
            this.apps.push(app);
            this.installApp(app, type, next);
        });
    }

    /*** Install app */
    private installApp(app: app.App, type: string, next: NextFunction): void {
        let compileSCSS = () => {
            Batch.compileSCSS(type + "/" + app.config.name, app.config.name, (success: boolean) => {
                app.complete.scss = true;
                app.success.scss = success;
                this.installed(app, next);
            });
        };

        Batch.copyPublic(type + "/" + app.config.name + "/public/", app.config.name, (success: boolean) => {
            app.complete.public = true;
            app.success.public = success;
            compileSCSS(); // Wait the structure to compile
        });

        // Installing regular routes
        this.loadRoutes(app, type, "routes", "", next);
        // Installing api routes
        this.loadRoutes(app, type, "api", "/api", next);
    }

    /*** Load routes */
    private loadRoutes(app: app.App, appType: string, routeType: string, basepath: string, next: NextFunction): void {
        this.jsloth.files.exists(__dirname + "/../../" + appType + "/" + app.config.name + "/" + routeType + ".ts").then(() => {
            let url: string = basepath + (app.config.basepath || "/");
            let appRoute = require("../../" + appType + "/" + app.config.name + "/" + routeType);
            let route = new appRoute.Urls(this.jsloth, app.config, url, [app.config.name]);
            this.express.use(url, route.router);

            if (routeType == "routes") {
                app.complete.routes = true;
                app.success.routes = true;
            } else {
                app.complete.api = true;
                app.success.api = true;
            }
            this.installed(app, next);
        }).catch(err => {
            if (err.code !== "ENOENT") {
                Log.error(err);
            }
            if (routeType == "routes") {
                app.complete.routes = true;
                app.success.routes = false;
            } else {
                app.complete.api = true;
                app.success.api = false;
            }
            this.installed(app, next);
        });
    }

    /*** Check if everything is ok, and mark as installed */
    private installed(app: app.App, next: NextFunction): void {
        if ((app.complete.routes) && (app.complete.api) && (app.complete.public) && (app.complete.scss)) {
            Log.app(app.config.name);
            Log.appModule("Routes installed", "Routes not found", app.success.routes);
            Log.appModule("Endpoints installed", "Endpoints not found", app.success.api);
            Log.appModule("Public folder published", "Public folder publication failed", app.success.public);
            Log.appModule("Styles generated", "No styles to compile", app.success.scss);
            app.done = true;
            next(this.apps);
        }
    }
}