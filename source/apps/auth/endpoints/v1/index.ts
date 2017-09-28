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
import * as sessions from "../../middlewares/sessions";

import { Request, Response } from "express";

import JSloth from "../../../../lib/core";
import ApiController from "../../../../abstract/controllers/api";

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
    private emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    constructor(jsloth: JSloth, config: any, namespaces: string[]) {
        super(jsloth, config, namespaces);
        this.usersTable = new users.Users(jsloth);
    }

    /*** Define routes */
    protected routes(): void {
        this.router.get("/", this.getAllUsers);

        this.router.post("/token/", this.getToken);
        this.router.post("/token/renew/", sessions.auth, this.renewToken);

        this.router.get("/users/", this.getList);
        this.router.get("/users/1/password/", this.updatePassword);

        this.router.get("/fields/", sessions.auth, this.getFieds);
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

        if (!this.emailRegex.test(email)) {
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
                            let token = jwt.sign(user, req.app.get("token"), {
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
        data.iat = undefined;
        data.exp = undefined;
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
     * Get user list.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return array
     */
    private getList = (req: Request, res: Response): void => {
        this.usersTable.getAll().then((data) => {
            res.json(data);
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
        this.usersTable.update({ password: bcrypt.hashSync("123queso", null, null) }, { id: 1 }).then((data) => {
            res.json(data);
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

}