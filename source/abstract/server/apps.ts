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

import * as clc from "cli-color";

import { App, Config } from "../../interfaces/app";
import { Application, NextFunction } from "express";

import Batch from "./batch";
import JSloth from "../../lib/core";
import Log from "./log";
import SysConfig from "../../interfaces/config";

/**
 * JSloth apps related tools.
 */
export default class Apps {

    /*** List of apps (System + Custom) */
    private apps: App[] = [];

    /*** System configuration */
    private config: SysConfig;

    /*** Express app */
    private express: Application;

    /*** JSloth library */
    private jsloth: JSloth;

    /**
     * Load configuration, JSloth library and Express application.
     * 
     * @param config System configuration
     * @param jsloth JSloth Library
     * @param express Express app
     */
    constructor(config: SysConfig, jsloth: JSloth, express: Application) {
        this.config = config;
        this.jsloth = jsloth;
        this.express = express;
    }

    /**
     * Start installation process
     * 
     * @param next
     */
    public install(next: NextFunction): void {
        Log.module("System apps scanned", "No system apps found", this.config.system_apps.length);
        this.installApps(this.config.system_apps, "system", next);

        Log.module("Custom apps scanned", "No custom apps found", this.config.custom_apps.length);
        this.installApps(this.config.custom_apps, "apps", next);

        Log.appTitle();
    }

    /**
     * Return a empty app object
     * 
     * @return app.App
     */
    private emptyApp(): App {
        let app: App = {
            config: null,
            done: false,
            complete: {
                api: false,
                routes: false,
            },
            success: {
                api: false,
                routes: false,
            },
            errors: {
                api: "",
                routes: "",
            }
        };

        return app;
    }

    /**
     * Install a group of apps
     * 
     * @param apps List of apps and configuration to install
     * @param type Apps family (system|apps)
     * @param next
     */
    private installApps(apps: Config[], type: string, next: NextFunction): void {
        apps.forEach((item) => {
            let app = this.emptyApp();
            app.config = item;
            app.config.folder = type;
            this.apps.push(app);
            this.installApp(app, type, next);
        });
    }

    /**
     * Copy public folder, compile SCSS, load routes and apis.
     * 
     * @param app App configuration.
     * @param type App family (system|apps)
     * @param next
     */
    private installApp(app: App, type: string, next: NextFunction): void {
        // Installing regular routes
        this.loadRoutes(app, type, "routes", "", next);
        // Installing api routes
        this.loadRoutes(app, type, "api", "/api", next);
    }

    /**
     * Load and install routes
     * 
     * @param app App configuration.
     * @param appType App family (system|apps)
     * @param routeType Route family (routes|api)
     * @param basepath Url prefix
     * @param next
     */
    private loadRoutes(app: App, appType: string, routeType: string, basepath: string, next: NextFunction): void {
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

    /**
     * Check if everything is done, and set done flag as true
     * 
     * @param app App configuration.
     * @param next
     */
    private installed(app: App, next: NextFunction): void {
        let err: string;
        if ((app.complete.routes) && (app.complete.api)) {
            Log.app(app.config.name);
            Log.appModule("Routes installed", "Routes not found", app.success.routes);
            err = app.errors.routes;
            if ((err) && (err.length)) {
                Log.moduleWarning(err);
            }
            Log.appModule("Endpoints installed", "Endpoints not found", app.success.api);
            err = app.errors.api;
            if ((err) && (err.length)) {
                Log.moduleWarning(err);
            }
            app.done = true;
            next(this.apps);
        }
    }
}