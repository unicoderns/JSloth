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

import * as sessions from "../../../auth/models/db/sessionsModel";
import * as users from "../../../auth/models/db/usersModel";

import ApiController from "../../../../abstract/controllers/api";
import JSloth from "../../../../lib/core";
import Sessions from "../../../auth/middlewares/sessions";

import { Request, Response } from "express";

let bcrypt = require("bcrypt-nodejs");

/**
 * Index Endpoint 
 * 
 * @basepath /
 * @return express.Router
 */
export default class IndexEndPoint extends ApiController {
    private usersTable: users.Users;
    private sessionsTable: sessions.Sessions;
    private sessionsMiddleware: Sessions;
    private emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    constructor(jsloth: JSloth, config: any, url: string, namespaces: string[]) {
        super(jsloth, config, url, namespaces);
        this.usersTable = new users.Users(jsloth);
        this.sessionsTable = new sessions.Sessions(jsloth);
        this.sessionsMiddleware = new Sessions(jsloth)
    }

    /*** Define routes */
    protected routes(): void {
        this.router.get("/sessions/", this.sessionsMiddleware.isAdmin("json"), this.getAllSessions);
        this.router.delete("/sessions/revoke/:id/", this.sessionsMiddleware.isAdmin("json"), this.revokeSession);
        this.router.get("/users/", this.sessionsMiddleware.isAdmin("json"), this.getAllUsers);
        this.router.post("/users/create/", this.sessionsMiddleware.isAdmin("json"), this.createUser);
        this.router.put("/users/activate/:id/", this.sessionsMiddleware.isAdmin("json"), this.activateUser);
        this.router.put("/users/deactivate/:id/", this.sessionsMiddleware.isAdmin("json"), this.deactivateUser);
        this.router.put("/users/admin/grant/:id/", this.sessionsMiddleware.isAdmin("json"), this.grantAdmin);
        this.router.put("/users/admin/revoke/:id/", this.sessionsMiddleware.isAdmin("json"), this.revokeAdmin);
        this.router.put("/users/verify/:id/", this.sessionsMiddleware.isAdmin("json"), this.verifyUser);
        this.router.put("/users/unverify/:id/", this.sessionsMiddleware.isAdmin("json"), this.unverifyUser);
    }

    /**
     * Get all sessions.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return array
     */
    private getAllSessions = (req: Request, res: Response): void => {
        this.sessionsTable.join({
            keyField: this.sessionsTable.user,
            fields: ["username"],
            kind: "LEFT"
        }).getAll().then((data) => {
            res.json(data);
        }).catch(err => {
            console.error(err);
            return res.status(500).send({
                success: false,
                message: "Something went wrong."
            });
        });
    };

    /**
     * Revoke session.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return array
     */
    private revokeSession = (req: Request, res: Response): void => {
        this.sessionsTable.delete({ id: req.params.id }).then((done) => {
            return res.json({
                success: true,
                message: "Session revoked."
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
     * Get all sessions.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return array
     */
    private getAllUsers = (req: Request, res: Response): void => {
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

    /**
     * Create a user.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return bool
     */
    private createUser = (req: Request, res: Response): void => {
        let username = req.body.username;
        let email = req.body.email;

        this.usersTable.get([], [{ username: username }, { email: email }]).then((user) => {
            if (typeof user === "undefined") {
                if (!this.emailRegex.test(email)) {
                    res.json({ success: false, message: "Invalid email address." });
                } else {
                    let temp: users.Row = {
                        username: req.body.username,
                        email: email,
                        password: bcrypt.hashSync(req.body.password, null, null),
                        salt: "",
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        active: req.body.active,
                        admin: req.body.admin,
                        verified: req.body.verified
                    };
                    this.usersTable.insert(temp).then((data: any) => {
                        res.json({
                            success: true,
                            message: "User created!"
                        });
                    }).catch(err => {
                        console.error(err);
                        return res.status(500).send({
                            success: false,
                            message: "Something went wrong."
                        });
                    });
                }
            } else {
                res.json({ success: false, message: "Username or email already exists." });
            }
        });

    };

    /**
     * Activate a user.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return bool
     */
    private activateUser = (req: Request, res: Response): void => {
        this.usersTable.update({ active: 1 }, { id: req.params.id }).then((data) => {
            return res.json({
                success: true,
                message: "User activated."
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
     * Deactivate a user.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return bool
     */
    private deactivateUser = (req: Request, res: Response): void => {
        this.usersTable.update({ active: 0 }, { id: req.params.id }).then((data) => {
            return res.json({
                success: true,
                message: "User deactivated."
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
     * Grant admin permission to a user.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return bool
     */
    private grantAdmin = (req: Request, res: Response): void => {
        this.usersTable.update({ admin: 1 }, { id: req.params.id }).then((data) => {
            return res.json({
                success: true,
                message: "User admin permission granted."
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
     * Verify a user.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return bool
     */
    private revokeAdmin = (req: Request, res: Response): void => {
        this.usersTable.update({ admin: 0 }, { id: req.params.id }).then((data) => {
            return res.json({
                success: true,
                message: "User admin permission revoked."
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
     * Unverify a user.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return bool
     */
    private verifyUser = (req: Request, res: Response): void => {
        this.usersTable.update({ verified: 1 }, { id: req.params.id }).then((data) => {
            return res.json({
                success: true,
                message: "User verified."
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
     * Revoke admin permission to a user.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return bool
     */
    private unverifyUser = (req: Request, res: Response): void => {
        this.usersTable.update({ verified: 0 }, { id: req.params.id }).then((data) => {
            return res.json({
                success: true,
                message: "User unverified."
            });
        }).catch(err => {
            console.error(err);
            return res.status(500).send({
                success: false,
                message: "Something went wrong."
            });
        });
    };

}