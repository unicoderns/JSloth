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

import * as express from "express";
import * as controller from "../abstract/controller";
import * as JSloth from "../lib/core";

/**
 * Core Controller Routes
 * 
 * @basepath /
 * @return express.Router
 */
export class CoreController extends controller.Controller {

    /*** Configure endpoints */
    protected routes(): void {

        /**
         * Render a page with instructions.
         *
         * @param req {express.Request} The request object.
         * @param res {express.Response} The response object.
         * @return void
         */
        this.router.get("/", (req: express.Request, res: express.Response) => {
            res.send("API: /api/users/:id");
        });

        /**
         * Render a json object with fake data.
         *
         * @param req {express.Request} The request object.
         * @param res {express.Response} The response object.
         * @return void
         */
        this.router.get("/api/users/:id", (req: express.Request, res: express.Response) => {
            let user = {
                username: req.params.id,
                firstName: "Chriss",
                lastName: "Mejía"
            };
            res.json(user);
        });

    }
}