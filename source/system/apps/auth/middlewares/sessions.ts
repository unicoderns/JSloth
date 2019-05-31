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

/// <reference path="../types/express.d.ts"/>

import { Request, Response, NextFunction, RequestHandler } from "express";
import { Lib } from "@unicoderns/stardust";

import * as jwt from "jsonwebtoken";
import * as sessions from "@unicoderns/cerberus/db/sessionsModel";

/**
 * Stardust Session Middlewares
 */
export default class Sessions {
    protected config: any;
    protected lib: Lib;

    /**
     * Load library, app configuration and install routes 
     */
    constructor(lib: Lib) {
        this.lib = lib;
        this.config = lib.config;
    }


    /**
     * Force an update context user
     * 
     * @param req {Request} The request object.
     * @param res {Response} The response object.
     * @param next Callback.
     */
    public updateContext = (req: Request, res: Response, next: NextFunction) => {
        let token = req.body.token || req.query.token || req.headers["x-access-token"] || req.signedCookies.token;

        this.lib.cerberus.sessions.getUpdated(token).then((reply) => {
            req.user = reply.user;
            return next();
        }).catch(err => {
            console.error(err.error);
            req.user = undefined;
            return next();
        });
    }

    /**
     * Get context user
     * 
     * @param req {Request} The request object.
     * @param res {Response} The response object.
     * @param next Callback.
     */
    public context = (req: Request, res: Response, next: NextFunction) => {
        let token = req.body.token || req.query.token || req.headers["x-access-token"] || req.signedCookies.token;

        this.lib.cerberus.sessions.get(token).then((reply) => {
            req.user = reply.user;
            return next();
        }).catch(err => {
            console.log(err);
            req.user = undefined;
            return next();
        });
    }

    /**
     * Session token verification
     * 
     * @param res {Response} The response object.
     * @param format {string} Kind of reply.
     * @param json Custom json to reply.
     */
    private reply = (res: Response, format: string = "html", json: any) => {
        if (format == "html") {
            res.send("404 error");
        } else if (format == "redirect") {
            return res.redirect("/auth/");
        } else {
            return res.status(401).send(json);
        }
    }

    /**
     * Session token verification
     * 
     * @param req {Request} The request object.
     * @param res {Response} The response object.
     * @param next Callback.
     */
    public auth = (format: string = "html"): RequestHandler => {
        return (req: Request, res: Response, next: NextFunction) => {
            if (req.user) {
                return next();
            } else {
                this.reply(res, format, {
                    success: false,
                    message: "User is not logged."
                });
            }
        }
    }

    public isVerified = (format: string = "html"): RequestHandler => {
        return (req: Request, res: Response, next: NextFunction) => {
            if (req.user.verified) {
                return next();
            } else {
                this.reply(res, format, {
                    success: false,
                    message: "User is not verified."
                });
            }
        }
    }

    public isAdmin = (format: string = "html"): RequestHandler => {
        return (req: Request, res: Response, next: NextFunction) => {
            if (req.user.admin) {
                return next();
            } else {
                if (format == "html") {
                    res.send("404 error");
                } else if (format == "redirect") {
                    if (req.user) {
                        return res.redirect("/dashboard/");
                    } else {
                        return res.redirect("/auth/");
                    }
                } else {
                    return res.status(401).send({
                        success: false,
                        message: "User is not admin."
                    });
                }
            }
        }
    }

}
