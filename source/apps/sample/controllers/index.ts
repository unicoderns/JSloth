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

import JSloth from "../../../lib/core";
import HtmlController from "../../../abstract/controllers/html";
import { Request, Response } from "express";

function log(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    const originalMethod = descriptor.value; // save a reference to the original method

    // NOTE: Do not use arrow syntax here. Use a function expression in 
    // order to use the correct value of `this` in this method (see notes below)
    descriptor.value = function (...args: any[]) {
        this.list.push("Hola");
        // pre
        console.log("The method args are: " + JSON.stringify(args));
        // run and store result
        const result = originalMethod.apply(this, args);
        // post
        console.log("The return value is: " + result);
        // return the result of the original method (or modify it before returning)
        return result;
    };

    return descriptor;
}

/**
 * Index Controller
 * 
 * @basepath /health/
 */
export default class IndexController extends HtmlController {
    // private appName: string = "sample";
    protected list: string[] = [];

    /*** Load library */
    constructor(jsloth: JSloth, config: any) {
        super(jsloth, config);
        this.test("Hello");
        console.log(this.list);
    }

    @log
    protected test(hi: string): string {
        return hi + "!";
    }

    /*** Configure endpoints */
    protected routes(): void {

        /**
         * Page to check the health of the system.
         *
         * @param req {Request} The request object.
         * @param res {Response} The response object.
         */
        this.router.get("/", (req: Request, res: Response) => {
            this.render(res, "index.ejs");
        });

    }
}