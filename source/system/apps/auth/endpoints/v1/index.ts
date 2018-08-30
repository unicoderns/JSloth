////////////////////////////////////////////////////////////////////////////////////////////
// JSloth Health App                                                                      //
//                                                                                        //
// The MIT License (MIT)                                                                  //
//                                                                                        //
// Copyright (C) 2017  Chriss Mejía - me@chrissmejia.com - chrissmejia.com                //
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

/// <reference path="../../types/express.d.ts"/>

import * as jwt from "jsonwebtoken";
import * as users from "../../models/db/usersModel";
import * as sessions from "../../models/db/sessionTrackModel";

import { Request, Response } from "express";

import ApiController from "../../../../abstract/controllers/api";
import JSloth from "../../../../lib/core";
import Sessions from "../../middlewares/sessions";

let ip = require("ip");
let bcrypt = require("bcrypt-nodejs");
// import * as bcrypt from "bcrypt-nodejs"; <- Doesn't work

/**
 * Index Endpoint
 * 
 * @basepath /
 * @return express.Router
 */
export default class IndexEndPoint extends ApiController {
    private usersTable: users.Users;
    private sessionsTable: sessions.SessionTrack;
    private sessionsMiddleware: Sessions;
    private emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    constructor(jsloth: JSloth, config: any, url: string, namespaces: string[]) {
        super(jsloth, config, url, namespaces);
        this.usersTable = new users.Users(jsloth);
        this.sessionsTable = new sessions.SessionTrack(jsloth);
        this.sessionsMiddleware = new Sessions(jsloth)
    }

    /*** Define routes */
    protected routes(): void {
        this.get("/", "allUsers", this.getAllUsers);

        this.post("/token/", "getToken", this.getToken);
        this.post("/token/renew/", "renewToken", this.sessionsMiddleware.auth("json"), this.renewToken);
        this.post("/token/revoke/", "revokeToken", this.sessionsMiddleware.auth("json"), this.revokeToken);

        // Only for testing
        // this.get("/users/", "userList", this.getList);
        // this.get("/users/1/password/", "user1PasswordChange", this.updatePassword);

        // this.get("/fields/", "fields", this.sessionsMiddleware.auth, this.getFieds);

        // this.get("/context/", "context", this.getSysContext);

    }

    /**
     * Get selected fields from all users.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return array
     */
    private getAllUsers = (req: Request, res: Response): void => {
        this.usersTable.delete({ id: 3 }).then((done) => {
            this.usersTable.getAll(["id", "first_name", "last_name"]).then((data) => {
                res.json(data);
            }).catch(err => {
                console.error(err);
                return res.status(500).send({
                    success: false,
                    message: "Something went wrong."
                });
            });
        }).catch(err => {
            console.error(err);
            return res.status(500).send({
                success: false,
                message: "Something went wrong."
            });
        });
    };

    /**
     * Sign JWT token and reply.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @param config { Object } The config object.
     * @param data { Object } Data to sign and create token.
     * @return json
     */
    private signAndReply = (req: Request, res: Response, config: any, data: any): void => {
        let token = jwt.sign(data, req.app.get("token"), {
            expiresIn: config.config.expiration // 5 years
        });

        // Set cookie
        if (config.config.cookie) {
            res.cookie('token', token, { signed: true, httpOnly: true, maxAge: config.config.expiration * 1000 });
        }

        // return the information including token as JSON
        res.json({
            success: true,
            message: "Enjoy your token!",
            token: token
        });
    }

    /**
     * Get auth token.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return json
     */
    private getToken = (req: Request, res: Response): void => {
        let email: string = req.body.email;
        let token: string = "";
        let config: any = this.config;
        let sessionTable = this.sessionsTable;
        let signAndReply = this.signAndReply;
        let unsafeUsersTable = new users.Users(this.jsloth, "unsafe");

        if (!this.emailRegex.test(email)) {
            res.json({ success: false, message: "Invalid email address." });
        } else {
            // find the user
            unsafeUsersTable.get([], { email: email, active: 1 }).then((user) => {
                if (typeof user === "undefined") {
                    res.json({ success: false, message: "Authentication failed. User and password don't match." });
                } else {
                    bcrypt.compare(req.body.password, user.password, function (err: NodeJS.ErrnoException, match: boolean) {
                        if (match) {
                            // if user is found and password is right
                            // create a token
                            if (config.config.session == "stateful") {
                                let temp: sessions.Row = {
                                    ip: ip.address(),
                                    user: user.id
                                };
                                sessionTable.insert(temp).then((data: any) => {
                                    signAndReply(req, res, config, { session: data.insertId, user: user.id });
                                }).catch(err => {
                                    console.error(err);
                                    return res.status(500).send({
                                        success: false,
                                        message: "Something went wrong."
                                    });
                                });
                            } else {
                                signAndReply(req, res, config, JSON.parse(JSON.stringify(user)));
                            }
                        } else {
                            res.json({ success: false, message: "Authentication failed. User and password don't match." });
                        };
                    });
                }
            }).catch(err => {
                console.error(err);
                return res.status(500).send({
                    success: false,
                    message: "Something went wrong."
                });
            });
        }
    };

    /**
     * Get new auth token.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return json
     */
    private renewToken = (req: Request, res: Response): void => {
        // Clean data
        let data = req.user;
        delete data.iat;
        delete data.exp;

        this.signAndReply(req, res, this.config, data);
    };

    /**
    * Revoke a token for a stateful session.
    *
    * @param req { Request } The request object.
    * @param res { Response } The response object.
    * @return json
    */
    private revokeToken = (req: Request, res: Response): void => {
        let userCacheFactory = this.jsloth.context.userCacheFactory;
        let config = this.config.config;
        let user = req.user.id;
        if (config.session == "stateful") {
            this.sessionsTable.delete({ user: user }).then((done) => {
                // Remove cached user
                userCacheFactory(user, false).then((user: any) => {
                    // Expire cookie
                    if (config.cookie) {
                        res.cookie('token', { signed: true, httpOnly: true, maxAge: Date.now() });
                    }
                    res.json({
                        success: true,
                        message: "Session revoked!"
                    });
                }).catch((err: NodeJS.ErrnoException) => {
                    console.error(err);
                    return res.status(500).send({
                        success: false,
                        message: "Something went wrong."
                    });
                });
            }).catch(err => {
                console.error(err);
                return res.status(500).send({
                    success: false,
                    message: "Something went wrong."
                });
            });
        } else {
            res.json({
                success: false,
                message: "This kind of sessions can't be revoked!"
            });
        }
    };

    /**
     * Get user list.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return array
     */
    /*
    private getList = (req: Request, res: Response): void => {
        this.usersTable.getAll().then((data) => {
            res.json(data);
        }).catch(err => {
            console.error(err);
            return res.status(500).send({
                success: false,
                message: "Something went wrong."
            });
        });
    };
    */

    /**
     * Update user 1 password.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return bool
     */
    /*
    private updatePassword = (req: Request, res: Response): void => {
        this.usersTable.update({ password: bcrypt.hashSync("q123queso", null, null) }, { id: 1 }).then((data) => {
            res.json(data);
        }).catch(err => {
            console.error(err);
            return res.status(500).send({
                success: false,
                message: "Something went wrong."
            });
        });
    };
    */


    /**
     * Get DB table fields - test endpoint.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return array
     */
    /*
    private getFieds = (req: Request, res: Response): void => {
        let unsafeUsersTable = new users.Users(this.jsloth, "unsafe");
        let fields = this.usersTable.getFields();
        let unsafeFields = unsafeUsersTable.getFields();
        res.json({
            publicFields: Array.from(fields),
            allFields: Array.from(unsafeFields),
            passwordFieldSettings: this.usersTable.password
        });
    };
    */

    /**
     * Get system context.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return array
     */
    /*
    private getSysContext = (req: Request, res: Response): void => {
        res.json(this.jsloth.context.export());
    };
    */

}