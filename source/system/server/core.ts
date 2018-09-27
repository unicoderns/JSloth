////////////////////////////////////////////////////////////////////////////////////////////
// The MIT License (MIT)                                                                  //
//                                                                                        //
// Copyright (C) 2016  Unicoderns SA - info@unicoderns.com - unicoderns.com               //
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

import * as app from "../interfaces/app";
import * as bodyParser from "body-parser"; // Parse incoming request bodies
import * as cookieParser from "cookie-parser";
import * as logger from "morgan";  // Log requests
import * as express from "express";
import * as fse from "fs-extra"

import Apps from "./apps";
import chalk from "chalk";
import Sessions from "../apps/auth/middlewares/sessions";
import SysConfig from "../interfaces/config";
import JSloth from "../lib/core";
import Log from "./log";

import { Application, Request, Response, NextFunction } from "express"

/**
 * Creates and configure an ExpressJS web server.
 *
 * @return express.Application
 */
export default class Core {
    /*** Express instance */
    public express: Application;

    /**
     * Stores the app port
     * @default port System environment port or 8080
     * Please note: the unary + cast to number
     */
    protected port: number = +process.env.PORT || 8080;

    /*** Default configuration filepath */
    protected configPath: string = "/../../../config.json";
    protected defaultConfigPath: string = "/../../../sample_config.json";

    /*** Apps object */
    protected apps: app.App[] = [];

    /*** JSloth library */
    protected jsloth: JSloth;

    /**
     * Load configuration settings, set up JSloth Global Library and start installation.
     */
    constructor() {
        // Creating App
        this.express = express();

        Log.hello();

        // Mount static files
        Log.module("Static files published");
        this.express.use('/', express.static(__dirname + '/../../../dist/static/'));

        let start = ((config: SysConfig) => {
            // Loading JSloth Global Library
            try {
                this.jsloth = new JSloth(config, __dirname);
            }
            catch (err) {
                console.error(err);
            }
            this.express.set("jsloth", this.jsloth);
            Log.module("Core library loaded");

            this.express.set("token", this.jsloth.config.token); // secret token
            Log.module("Configuration loaded");
            this.install();
        });

        // Loading Configuration
        fse.pathExists(__dirname + this.configPath).then((exists) => {
            if (exists) {
                let config = require(__dirname + this.configPath);
                start(config);
            } else {
                Log.error("Configuration file not found");
                let config = require(__dirname + this.defaultConfigPath);
                console.log(chalk.yellow("Sample config is used instead"));
                start(config);
            }
        }).catch(err => {
            Log.error("Something went wrong");
            Log.error(err);
        });

    }

    /**
     * Install endpoints, configure and run the Express App instance and load middlewares
     */
    protected install(): void {
        let appsModule: Apps;

        // Installing Middlewares
        this.middleware();

        // Installing Apps
        appsModule = new Apps(this.jsloth.config, this.jsloth, this.express);
        appsModule.install((apps: app.App[]) => {
            this.apps = apps;
            this.start();
        });
    }

    /*** Configure Express middlewares */
    protected middleware(): void {
        let sessions = new Sessions(this.jsloth);
        // Log hits using morgan
        if (this.jsloth.config.dev) {
            this.express.use(logger("dev"));
        } else {
            this.express.use(logger("combined"));
        }
        // Use body parser so we can get info from POST and/or URL parameters
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(cookieParser(this.jsloth.config.token));
        this.express.use(sessions.context);
        Log.module("Middlewares loaded");
    }

    /*** Run the server */
    protected start(): void {
        let appCount = 0; // Number of checked apps so far
        let done = true; // All done

        let now = () => {
            // Everything is installed?
            if (done) {
                try {

                    // Errors and 404  
                    this.express.get("/*", function (req: Request, res: Response, next: NextFunction): any {
                        return res.redirect("/errors/404/");
                    });
                    this.express.use(function (err: any, req: Request, res: Response, next: NextFunction): any {
                        console.error(err);
                        if (!err.status) {
                            return res.redirect("/errors/500/");
                        } else {
                            return res.redirect("/errors/" + err.status + "/");
                        }
                    });
                    // run
                    this.express.listen(this.port);
                    Log.run(this.port);
                } catch (e) {
                    Log.error(e);
                }
            }
        };

        this.apps.forEach((app) => {
            if (!app.done) {
                done = false;
            }
            appCount++;
            if (this.apps.length === appCount) {
                now();
            }
        });

    }

}