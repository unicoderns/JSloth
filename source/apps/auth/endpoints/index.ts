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

import JSloth from "../../../lib/core";
import Controller from "../abstract/controller";

import * as express from "express";
import * as jwt from "jsonwebtoken";
import * as users from "../models/db/usersModel";

let bcrypt = require("bcrypt-nodejs");
// import * as bcrypt from "bcrypt-nodejs"; <- Doesn't work

/**
 * Index Endpoint
 * 
 * @basepath /
 * @return express.Router
 */
export default class IndexEndPoint extends Controller {
    private usersTable: users.Users;
    private email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    constructor(jsloth: JSloth, config: any) {
        super(jsloth, config);
        this.usersTable = new users.Users(jsloth);
    }

    /*** Configure endpoints */
    protected routes(): void {
        /**
         * Dummy.
         * Render a json object with a true response.
         *
         * @param req {express.Request} The request object.
         * @param res {express.Response} The response object.
         * @return array
         */
        this.router.get("/", (req: express.Request, res: express.Response) => {
            this.usersTable.delete({ id: 3 }).then((done) => {
                this.usersTable.getAll(["id", "first_name", "last_name"]).then((data) => {
                    res.json(data);
                });
            });
        });

        /**
         * Get a token.
         * Render a json object with a true response.
         *
         * @param req {express.Request} The request object.
         * @param res {express.Response} The response object.
         * @return string
         */
        this.router.post("/token/", (req: express.Request, res: express.Response) => {
            let jsloth = this.jsloth;
            let email = req.body.email;

            if (!this.email_regex.test(email)) {
                res.json({ success: false, message: "Invalid email address." });
            } else {
                // find the user
                this.usersTable.get([], { email: email, active: 1 }).then((user) => {
                    if (typeof user === "undefined") {
                        res.json({ success: false, message: "Authentication failed. User and password don't match." });
                    } else {
                        bcrypt.compare(req.body.password, user.password, function (err: NodeJS.ErrnoException, match: boolean) {
                            if (match) {
                                // if user is found and password is right
                                // create a token
                                let token = jwt.sign(user, jsloth.config.token, {
                                    expiresIn: 5 * 365 * 24 * 60 * 60 // 5 years
                                });

                                // return the information including token as JSON
                                res.json({
                                    success: true,
                                    message: "Enjoy your token!",
                                    token: token
                                });
                            } else {
                                res.json({ success: false, message: "Authentication failed. User and password don't match." });
                            }
                        });
                    }
                });
            }
        });

        /**
         * Get user list.
         * Render a json object with a true response.
         *
         * @param req {express.Request} The request object.
         * @param res {express.Response} The response object.
         * @return array
         */
        this.router.get("/users/", (req: express.Request, res: express.Response) => {
            this.usersTable.getAll().then((data) => {
                res.json(data);
            });
        });


        /**
         * Update user password.
         * Render a json object with a true response.
         *
         * @param req {express.Request} The request object.
         * @param res {express.Response} The response object.
         * @return array
         */
        this.router.get("/users/1/password/", (req: express.Request, res: express.Response) => {
            this.usersTable.update({ password: bcrypt.hashSync("123queso", null, null) }, { id: 1 }).then((data) => {
                res.json(data);
            });
        });
        /**
         * Dummy.
         * Render a json object with a true response.
         *
         * @param req {express.Request} The request object.
         * @param res {express.Response} The response object.
         * @return array
         */
        this.router.get("/fields/", this.auth.bind(this), (req: express.Request, res: express.Response) => {
            let fields = this.usersTable.getFields();
            res.json({
                publicFields: fields.public,
                protectedFields: fields.protected,
                passwordFieldSettings: this.usersTable.password
            });
        });
    }
}