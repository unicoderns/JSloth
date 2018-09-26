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

import Controller from "./core";
import Log from "../../server/log";

import * as express from "express";
import { Response, Request, Application } from "express";

/**
 * Routes Abstract
 */
export default class HtmlController extends Controller {
    protected app: Application;
    protected name: string;

    /*** Init Controller */
    protected init(): void {
        super.init();
        this.app = this.getApp();
    }

    /*** Get configured app for engine */
    private getApp(): Application {
        let app = express();
        const compression = require("compression");

        app.set('view engine', 'ejs');
        app.use(compression());
        return app;
    }

    /**
     * Load Routes 
     * 
     * @param req Request
     * @param res Response
     * @param file string
     * @param params object
     */
    protected render(req: Request, res: Response, file: string, params: any = {}): void {
        this.jsloth.path.get(this.config.folder, this.config.name, file).then((path: string) => {
            res.render(path, params);
        });
    }

}