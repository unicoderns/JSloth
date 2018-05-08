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

/// <reference path="../types/express.d.ts"/>

import JSloth from "../../../lib/core";
import { Router, Request, Response, NextFunction, RequestHandler } from "express";

import * as jwt from "jsonwebtoken";
import * as session from "../models/db/sessionTrackModel";
import * as user from "../models/db/usersModel";

/**
 * Get Context user
 * 
 * @param req {Request} The request object.
 * @param res {Response} The response object.
 * @param next Callback.
 */
export function context(req: Request, res: Response, next: NextFunction) {
    // Check header or url parameters or post parameters for token
    let token = req.body.token || req.query.token || req.headers["x-access-token"] || req.signedCookies.token;
    let config: any = this.config;
    let sessionTable = new session.Session_Track(this.jsloth);
    let userTable = new user.Users(this.jsloth);
    // Clean user
    req.user = undefined;
    // Decode token
    if (token) {
        req.token = token;
        // Verifies secret and checks exp
        jwt.verify(token, req.app.get("token"), function (err: NodeJS.ErrnoException, decoded: any) {
            if (err) {
                return next();
            } else {
                if (config.config.session == "stateful") {
                    sessionTable.get([], { id: decoded.session, user: decoded.user }).then((session: any) => {
                        if (typeof session == "undefined") {
                            return next();
                        } else {
                            userTable.get([], { id: decoded.user }).then((user: any) => {
                                req.user = JSON.parse(JSON.stringify(user));
                                return next();
                            });
                        }
                    }).catch(err => {
                        console.error(err);
                        return next();
                    });
                } else {
                    // If everything is good, save to request for use in other routes
                    req.user = decoded;
                    return next();
                }
            }
        });
    } else {
        return next();
    }
}

/**
 * Session token verification
 * 
 * @param req {Request} The request object.
 * @param res {Response} The response object.
 * @param next Callback.
 */
export function auth(req: Request, res: Response, next: NextFunction) {
    // Check header or url parameters or post parameters for token
    let token = req.body.token || req.query.token || req.headers["x-access-token"] || req.signedCookies.token;
    let config: any = this.config;
    let sessionTable = new session.Session_Track(this.jsloth);
    let userTable = new user.Users(this.jsloth);
    // Decode token
    if (token) {
        req.token = token;
        // Verifies secret and checks exp
        jwt.verify(token, req.app.get("token"), function (err: NodeJS.ErrnoException, decoded: any) {
            if (err) {
                return res.json({ success: false, message: "Failed to authenticate token." });
            } else {
                if (config.config.session == "stateful") {
                    sessionTable.get([], { id: decoded.session, user: decoded.user }).then((session: any) => {
                        if (typeof session == "undefined") {
                            return res.status(401).send({
                                success: false,
                                message: "Session is not longer available."
                            });
                        } else {
                            userTable.get([], { id: decoded.user }).then((user: any) => {
                                req.user = JSON.parse(JSON.stringify(user));
                                return next();
                            });
                        }
                    }).catch(err => {
                        console.error(err);
                        return res.status(401).send({
                            success: false,
                            message: "Something went wrong."
                        });
                    });
                } else {
                    // If everything is good, save to request for use in other routes
                    req.user = decoded;
                    return next();
                }
            }
        });
    } else {
        // if there is no token
        // return an error
        return res.status(400).send({
            success: false,
            message: "No token provided."
        });

    }
}

export function isVerified(req: Request, res: Response, next: NextFunction) {
    if (req.user.verified) {
        return next();
    }else {
        return res.status(401).send({
            success: false,
            message: "User is not verified."
        });
    }
}