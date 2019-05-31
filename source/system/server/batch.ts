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

import * as fse from "fs-extra"

import { Lib } from "@unicoderns/stardust";

/**
 * Batch commands.
 */
export default class Batch {

    /*** library */
    protected lib: Lib;
    /*** Batch process */
    private exec = require("child_process").exec;

    constructor(lib: Lib) {
        this.lib = lib;
    }

    /**
     * Compile SCSS
     * 
     * @param from Source style path
     * @param to Path for compiled styles
     * @param next
     */
    public compileSCSS = (from: string, to: string): Promise<any> => {
        // Create promise
        const p: Promise<boolean> = new Promise(
            (resolve: (exists: boolean) => void, reject: (err: NodeJS.ErrnoException) => void) => {
                // "node-sass --include-path " + this.lib.context.baseURL + "node_modules/foundation-sites/scss --output-style compressed -o " + to + " " + from
                this.exec("node-sass --include-path " + this.lib.context.baseURL + "node_modules/bootstrap/scss --output-style compressed -o " + to + " " + from, function (err: any, stdout: any, stderr: any) {
                    if ((stdout.substr(0, 39)) == "Rendering Complete, saving .css file...") {
                        resolve(true);
                    } else {
                        console.error(stderr);
                        reject(stderr);
                    }
                });
            }
        );
        return p;
    }

    /**
     * Clean and copy public folder
     * 
     * @param from Source path
     * @param to Path to place the copy
     * @param next
     */
    public copyPublic = (from: string, to: string): Promise<any> => {
        const p: Promise<boolean> = new Promise(
            (resolve: (success: boolean) => void, reject: (err: NodeJS.ErrnoException) => void) => {
                fse.remove(to).then(() => {
                    fse.ensureDir(to + "/public/").then(() => {
                        fse.copy(from, to + "/public/").then(() => {
                            resolve(true);
                        }).catch(err => {
                            reject(err);
                        })
                    }).catch(err => {
                        reject(err);
                    });
                }).catch(err => {
                    console.error(err);
                });
            }
        );
        return p;
    }

}