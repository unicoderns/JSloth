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
import JSloth from "../../core/lib/core";
import coreController from "../../core/abstract/controllers/core";
import { Router, Request, Response, NextFunction } from "express";

import * as jwt from "jsonwebtoken";

/**
 * Controller Abstract
 */
export default class Controller extends coreController {
    /*** Load library */
    constructor(jsloth: JSloth, config: any) {
        super(jsloth, config);
    }

    /**
     * Session token verification
     * 
     * @param req {Request} The request object.
     * @param res {Response} The response object.
     * @param next Callback.
     */
    protected auth(req: Request, res: Response, next: NextFunction) {
        // Check header or url parameters or post parameters for token
        let token = req.body.token || req.query.token || req.headers["x-access-token"];

        // Decode token
        if (token) {
            // Verifies secret and checks exp
            jwt.verify(token, this.jsloth.config.token, function (err: NodeJS.ErrnoException, decoded: any) {
                if (err) {
                    return res.json({ success: false, message: "Failed to authenticate token." });
                } else {
                    // If everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    return next();
                }
            });
        } else {
            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: "No token provided."
            });

        }
    }
}