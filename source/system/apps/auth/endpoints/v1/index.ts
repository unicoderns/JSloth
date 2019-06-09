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

import * as users from "@unicoderns/cerberus/db/usersModel";
import * as verifications from "@unicoderns/cerberus/db/verificationsModel";

import { Request, Response } from "express";
import { Controllers, Lib, Middlewares } from "@unicoderns/stardust";

let ip = require("ip");

/**
 * Index Endpoint
 * 
 * @basepath /
 * @return express.Router
 */
export default class IndexEndPoint extends Controllers.Api {
    private usersTable: users.Users;
    private verificationsTable: verifications.Verifications;
    private sessionsMiddleware: Middlewares.sessions;
    private emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    constructor(lib: Lib, config: any, url: string, namespaces: string[]) {
        super(lib, config, url, namespaces);

        this.usersTable = new users.Users(lib.db);
        this.verificationsTable = new verifications.Verifications(lib.db);

        this.sessionsMiddleware = new Middlewares.sessions(lib);
    }

    /*** Define routes */
    protected routes(): void {
        let config: any = this.config;
        // this.get("/", "allUsers", this.getAllUsers);

        this.post("/token/", "getToken", this.getToken);
        this.post("/token/renew/", "renewToken", this.sessionsMiddleware.auth("json"), this.renewToken);
        this.post("/token/revoke/", "revokeToken", this.sessionsMiddleware.auth("json"), this.revokeToken);

        this.put("/verification/active/:id/", "verify", this.verify);
        this.post("/verification/generate/", "verificationGeneration", this.sessionsMiddleware.auth("json"), this.verificationGenerator);

        if (config.config.signup) {
            this.post("/signup/", "signup", this.signup);
        }
        // Only for testing
        // this.get("/users/", "userList", this.getList);
        // this.get("/users/1/password/", "user1PasswordChange", this.updatePassword);

        // this.get("/fields/", "fields", this.sessionsMiddleware.auth, this.getFieds);

        // this.get("/context/", "context", this.getSysContext);

    }

    /**
     * Create a user.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return bool
     */
    private signup = (req: Request, res: Response): void => {
        this.lib.cerberus.users.signup(req.params).then((data) => {
            this.verificationsTable.getToken(data.user.id).then((token: string) => {
                // send some mail
                this.lib.mail.sendMail({
                    from: this.config.aws.ses.noreply,
                    to: req.user.email,
                    subject: 'Your verification token',
                    text: 'This is your verification token: ' + token
                }, (err, info) => {
                    res.json({
                        // token: token,
                        success: true,
                        message: "Enjoy your token!",
                        envelope: info.envelope,
                        messageId: info.messageId
                    });
                });
            }).catch(err => {
                console.error(err);
                return res.status(500).send({
                    success: false,
                    message: "Something went wrong."
                });
            });

            res.json(data);
        }).catch(err => {
            console.error(err.error);
            return res.status(500).send(err);
        });
    };

    /**
     * Create a verification token.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return bool
     */
    private verificationGenerator = (req: Request, res: Response): void => {
        if (req.user.verified) {
            res.json({
                success: false,
                message: "Your account is already autenticated"
            });
        } else {
            this.verificationsTable.getToken(req.user.id).then((token: string) => {
                // send some mail
                this.lib.mail.sendMail({
                    from: this.config.aws.ses.noreply,
                    to: req.user.email,
                    subject: 'Your verification token',
                    text: 'This is your verification token: ' + token
                }, (err, info) => {
                    res.json({
                        // token: token,
                        success: true,
                        message: "Enjoy your token!",
                        envelope: info.envelope,
                        messageId: info.messageId
                    });
                });
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
     * Verify token.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return bool
     */
    private verify = (req: Request, res: Response): void => {
        this.verificationsTable.get({
            where: {
                user: req.params.id,
                token: req.body.token
            }
        }).then((token: any) => {
            if (typeof token === "undefined") {
                return res.status(404).send({
                    success: false,
                    message: "Invalid token."
                });
            } else {
                this.verificationsTable.delete({ id: token.id }).then((done) => {
                    this.usersTable.update({
                        data: {
                            verified: 1
                        },
                        where: {
                            id: req.params.id
                        }
                    }).then((done) => {
                        res.json({
                            success: true,
                            message: "User verified!"
                        });
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
            }
        }).catch(err => {
            console.error(err);
            return res.status(500).send({
                success: false,
                message: "Something went wrong."
            });
        });
    };

    /**
     * Get selected fields from all users.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return array
     */
    private getAllUsers = (req: Request, res: Response): void => {
        this.usersTable.delete({ id: 3 }).then((done) => {
            this.usersTable.getAll({
                fields: ["id", "first_name", "last_name"]
            }).then((data) => {
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
     * Get auth token.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return json
     */
    private getToken = (req: Request, res: Response): void => {
        let config: any = this.config;

        this.lib.cerberus.sessions.create({
            email: req.body.email,
            password: req.body.password
        }).then((reply) => {
            // Set cookie
            if (config.config.cookie) {
                res.cookie('token', reply.token, { signed: true, httpOnly: true, maxAge: config.config.expiration * 1000 });
            }
            res.json({
                success: reply.success,
                message: reply.message,
                token: reply.token
            });
        }).catch((reply) => {
            if (typeof reply.err !== "undefined") {
                console.error(reply.err);
            }
            return res.status(500).send({
                success: reply.success,
                message: reply.message
            });
        });
    };

    /**
     * Get new auth token.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return json
     */
    private renewToken = (req: Request, res: Response): void => {
        res.json(this.lib.cerberus.sessions.renew(req.user.id));
    };

    /**
    * Revoke a token for a stateful session.
    *
    * @param req { Request } The request object.
    * @param res { Response } The response object.
    * @return json
    */
    private revokeToken = (req: Request, res: Response): void => {
        let config: any = this.config;

        this.lib.cerberus.sessions.revoke(req.user.id).then((reply) => {
            // Expire cookie
            if (config.cookie) {
                res.cookie('token', { signed: true, httpOnly: true, maxAge: Date.now() });
            }
            res.json({
                success: reply.success,
                message: reply.message,
                token: reply.token
            });
        }).catch(reply => {
            if (typeof reply.err !== "undefined") {
                console.error(reply.err);
            }
            return res.status(500).send({
                success: reply.success,
                message: reply.message
            });
        });
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
        let unsafeUsersTable = new users.Users(this.lib, "unsafe");
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
        res.json(this.lib.context.export());
    };
    */

}