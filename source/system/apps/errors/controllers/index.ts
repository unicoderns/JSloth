////////////////////////////////////////////////////////////////////////////////////////////
// JSloth Sample App                                                                      //
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

import HtmlController from "../../../abstract/controllers/html";
import JSloth from "../../../lib/core";
import Sessions from "../../auth/middlewares/sessions";

import { Request, Response } from "express";

interface Error {
    status?: number;
    message?: string;
}
/**
 * Index Controller
 * 
 * @basepath /admin/
 */
export default class IndexController extends HtmlController {
    private sessionsMiddleware: Sessions;

    constructor(jsloth: JSloth, config: any, url: string, namespaces: string[]) {
        super(jsloth, config, url, namespaces);
        this.sessionsMiddleware = new Sessions(jsloth)
    }

    /*** Define routes */
    protected routes(): void {
        this.app.get("/404/", this.e404);
        this.router.use("/", this.app);
    }

    /**
     * 404 view.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return html
     */
    private e404 = (req: Request, res: Response): void => {
        this.render(req, res, "404");
    };
}