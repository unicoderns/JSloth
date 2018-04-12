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
import * as session from "../../models/db/sessionTrackModel";
import * as sessions from "../../middlewares/sessions";

import { Request, Response } from "express";

import JSloth from "../../../../lib/core";
import ApiController from "../../../../abstract/controllers/api";

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
    private sessionTable: session.Session_Track;
    private emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    constructor(jsloth: JSloth, config: any, url: string, namespaces: string[]) {
        super(jsloth, config, url, namespaces);
        this.usersTable = new users.Users(jsloth);
        this.sessionTable = new session.Session_Track(jsloth);
    }

    /*** Define routes */
    protected routes(): void {
        this.get("/", "allUsers", this.getAllUsers);

        this.post("/token/", "getToken", this.getToken);
        this.post("/token/renew/", "renewToken", sessions.auth.bind(this), this.renewToken);
        this.post("/token/revoke/", "revokeToken", sessions.auth.bind(this), this.revokeToken);

        this.get("/users/", "userList", this.getList);
        this.get("/users/1/password/", "user1PasswordChange", this.updatePassword);

        this.get("/fields/", "fields", sessions.auth.bind(this), this.getFieds);

        this.get("/context/", "context", this.getSysContext);

    }

    /**
     * Get selected fields from all users.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return array
     */
    private getAllUsers = (req: Request, res: Response): void => {
        console.log(this.config);
        this.usersTable.delete({ id: 3 }).then((done) => {
            this.usersTable.getAll(["id", "first_name", "last_name"]).then((data) => {
                res.json(data);
            }).catch(err => {
                return res.status(500).send({
                    success: false,
                    message: "Something went wrong.",
                    error: err
                });
            });
        }).catch(err => {
            return res.status(500).send({
                success: false,
                message: "Something went wrong.",
                error: err
            });
        });
    };

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
        let sessionTable = this.sessionTable;
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
                                let temp: session.Row = {
                                    ip: ip.address(),
                                    user: user.id
                                };
                                sessionTable.insert(temp).then((data: any) => {
                                    token = jwt.sign({ session: data.insertId, user: user.id }, req.app.get("token"), {
                                        expiresIn: 5 * 365 * 24 * 60 * 60 // 5 years
                                    });
                                    // return the information including token as JSON
                                    res.json({
                                        success: true,
                                        message: "Enjoy your token!",
                                        token: token
                                    });
                                }).catch(err => {
                                    return res.status(500).send({
                                        success: false,
                                        message: "Something went wrong.",
                                        error: err
                                    });
                                });
                            } else {
                                token = jwt.sign(JSON.parse(JSON.stringify(user)), req.app.get("token"), {
                                    expiresIn: 5 * 365 * 24 * 60 * 60 // 5 years
                                });
                                // return the information including token as JSON
                                res.json({
                                    success: true,
                                    message: "Enjoy your token!",
                                    token: token
                                });
                            }
                        } else {
                            res.json({ success: false, message: "Authentication failed. User and password don't match." });
                        };
                    });
                }
            }).catch(err => {
                return res.status(500).send({
                    success: false,
                    message: "Something went wrong.",
                    error: err
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
        let data = req.decoded;
        delete data.iat;
        delete data.exp;
        // create a new token
        let token = jwt.sign(req.decoded, req.app.get("token"), {
            expiresIn: 5 * 365 * 24 * 60 * 60 // 5 years
        });

        res.json({
            success: true,
            message: "Enjoy your token!",
            token: token
        });
    };

    /**
    * Revoke a token for a stateful session.
    *
    * @param req { Request } The request object.
    * @param res { Response } The response object.
    * @return json
    */
    private revokeToken = (req: Request, res: Response): void => {
        if (this.config.config.session == "stateful") {
            this.sessionTable.delete({ user: req.decoded.id }).then((done) => {
                res.json({
                    success: true,
                    message: "Session revoked!"
                });
            }).catch(err => {
                console.error(err);
                return res.status(500).send({
                    success: false,
                    message: "Something went wrong.",
                    error: err
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
    private getList = (req: Request, res: Response): void => {
        this.usersTable.getAll().then((data) => {
            res.json(data);
        }).catch(err => {
            return res.status(500).send({
                success: false,
                message: "Something went wrong.",
                error: err
            });
        });
    };

    /**
     * Update user 1 password.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return bool
     */
    private updatePassword = (req: Request, res: Response): void => {
        this.usersTable.update({ password: bcrypt.hashSync("q123queso", null, null) }, { id: 1 }).then((data) => {
            res.json(data);
        }).catch(err => {
            return res.status(500).send({
                success: false,
                message: "Something went wrong.",
                error: err
            });
        });
    };


    /**
     * Get DB table fields - test endpoint.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return array
     */
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

    /**
     * Get system context.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return array
     */
    private getSysContext = (req: Request, res: Response): void => {
        res.json(this.jsloth.context.export());
    };

}