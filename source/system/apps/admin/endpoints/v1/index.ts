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
    }

    /**
     * Get all sessions.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return array
     */
    private getAllSessions = (req: Request, res: Response): void => {
        this.sessionsTable.getAll().then((data) => {
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


}