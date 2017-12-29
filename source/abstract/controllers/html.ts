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

import Controller from "./core";
import Log from "../server/log";
import JSloth from "../../lib/core";

import * as express from "express";
import { Request, Response } from "express";

/**
 * Routes Abstract
 */
export default class HtmlController extends Controller {
    protected name: string;

    protected app: express.Application;

    /*** Init Controller */
    protected init(): void {
        super.init();

        var app = express();
        try {
            const path = require("path");
            const fs = require("fs");
            const compression = require("compression");
            const ngExpressEngine = require("@nguniversal/express-engine").ngExpressEngine;
    
            require("zone.js/dist/zone-node");
            require("rxjs/add/operator/filter");
            require("rxjs/add/operator/map");
            require("rxjs/add/operator/mergeMap");
    
            var hash;
            fs.readdirSync(__dirname + "/../../../dist/server" + this.config.basepath).forEach(function (file: any) {
                if (file.startsWith("main")) {
                    hash = file.split(".")[1];
                }
            });
    
            const AppServerModuleNgFactory = require(path.join(__dirname, "/../../../dist/server" + this.config.basepath + "main." + hash + ".bundle")).AppServerModuleNgFactory;
    
            const port = Number(process.env.PORT || 8080);
    
            app.engine('html', ngExpressEngine({
                baseUrl: 'http://localhost:' + port,
                bootstrap: AppServerModuleNgFactory
            }));

            app.set('view engine', 'html');
    
            app.use(compression());

            this.app = app;
        } catch (e) {
            Log.error(e);
        }
        
    }

    /**
     * Load Routes 
     * 
     * @param res Response
     * @param file string
     */
    protected render(req: Request, res: Response, file: string, params: any = {}): void {
        let path = this.jsloth.path.get(this.config.folder, this.config.basepath, file);
        params.req = req;
        console.log(path);
        res.render(path, params);
    }

}