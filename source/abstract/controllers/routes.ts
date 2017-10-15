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
import Controller from "./core";
import { Router } from "express";

/**
 * Routes Abstract
 */
export default class Routes extends Controller {

    /**
     * Constructor
     * 
     * @param jsloth Library reference
     * @param config Configuration object
     * @param url Concatenated url across the imports
     * @param namespace Complete array of namespaces from imports
     * @return void
     */
    constructor(jsloth: JSloth, config: any, url: string = "/", namespaces: string[]) {
        super(jsloth, config, url, namespaces);
    }

    /**
     * Load and install routes 
     * 
     * @param controller
     * @param url Concatenated url across the imports
     * @param namespace Current namespace name
     * @return express.Router
     */
    protected include(controller: any, url: string = "/", namespace: string = "index"): void {
        // Load
        this.namespaces.push(namespace);
        let instance: Controller = new controller(this.jsloth, this.config, this.url + url, this.namespaces);
        instance.setup();
        // Install
        this.router.use(url, instance.router);
    }

}