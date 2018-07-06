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

import JSloth from "../../lib/core";
import { Router } from "express";
import SysConfig from "../../interfaces/config";

/**
 * Controller Abstract
 */
export default class Controller {
    protected jsloth: JSloth;
    protected config: any;
    protected namespaces: string[] = [];
    protected url: string;

    /**
     * Express Router instance
     *
     * @return Router
     */
    public router: Router = Router();

    /**
     * Load library, app configuration and install routes 
     */
    constructor(jsloth: JSloth, config: SysConfig, url: string, namespaces: string[]) {
        this.jsloth = jsloth;
        this.config = config;
        this.namespaces = namespaces;
        this.url = url;
        this.init();
    }

    /*** Init Controller */
    protected init(): void {
    }

    /*** Setup Controller */
    public setup(): void {
        this.routes();
    }

    /*** Define routes */
    protected routes(): void {
    }

}