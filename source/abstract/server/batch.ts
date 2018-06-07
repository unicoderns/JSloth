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

import * as app from "../../interfaces/app";

import { NextFunction } from "express"

/**
 * Batch commands.
 */
class Batch {

    /*** Batch process */
    private exec = require("child_process").exec;
    /*** To path prefix */
    private toPrefix: string = __dirname + "/../../../dist/";
    /*** From path prefix */
    private fromPrefix: string = __dirname + "/../../";

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
                // "node-sass --include-path " + __dirname + "/../../../node_modules/foundation-sites/scss --output-style compressed -o " + this.toPrefix + to + "/ " + this.fromPrefix + from
                this.exec("node-sass --include-path " + __dirname + "/../../../node_modules/bootstrap/scss --output-style compressed -o " + this.toPrefix + to + "/ " + this.fromPrefix + from + "/", function (err: any, stdout: any, stderr: any) {
                    if ((stdout.substr(0, 39)) == "Rendering Complete, saving .css file...") {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            }
        );
        return p;
    }

    /**
     * Compile Typescript
     * 
     * @param from Source style path
     * @param to Path for compiled styles
     * @param next
     */
    public compileTS = (from: string, to: string): Promise<any> => {
        const p: Promise<boolean> = new Promise(
            (resolve: (exists: boolean) => void, reject: (err: NodeJS.ErrnoException) => void) => {
                try {
                    this.exec("tsc --outDir " + this.toPrefix + to + "/app/ " + this.fromPrefix + from + "/client/app.ts", function (err: any, stdout: any, stderr: any) {
                        if ((stdout.substr(stdout.length - 11)) != "not found.\n") {
                            reject(stdout);
                        } else {
                            reject(null);
                        }
                    });
                } catch (err) {
                    reject(err);
                }
            }
        );
        return p;
    }

    /**
     * Remove recursive folders
     * 
     * @param to Path to remove
     * @param next
     */
    private rm = (to: string): Promise<any> => {
        const p: Promise<boolean> = new Promise(
            (resolve: () => void, reject: (err: NodeJS.ErrnoException) => void) => {
                this.exec("rm -r " + this.toPrefix + to, function (err: any, stdout: any, stderr: any) {
                    if ((err !== null) && (stderr.substr(stderr.length - 26)) != "No such file or directory\n") {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            }
        );
        return p;
    }

    /**
     * Make directory and basepath
     * 
     * @param to Path to create
     * @param next
     */
    private mkdir = (to: string): Promise<any> => {
        const p: Promise<boolean> = new Promise(
            (resolve: () => void, reject: (err: NodeJS.ErrnoException) => void) => {
                this.exec("mkdir -p " + this.toPrefix + to, function (err: any, stdout: any, stderr: any) {
                    if (err !== null) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }); // Unix only
            }
        );
        return p;
    }

    /**
     * Copy recursive folders
     * 
     * @param from Source path
     * @param to Path to place the copy
     * @param next
     */
    private cp = (from: string, to: string): Promise<any> => {
        const p: Promise<boolean> = new Promise(
            (resolve: () => void, reject: (err: NodeJS.ErrnoException) => void) => {
                this.exec("cp -r " + this.fromPrefix + from + " " + this.toPrefix + to, function (err: any, stdout: any, stderr: any) {
                    if ((err !== null) && (stderr.substr(stderr.length - 26)) != "No such file or directory\n") {
                        reject(err);
                    } else {
                        resolve();
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
                try {
                    this.rm(to).then(() => {
                        this.mkdir(to).then(() => {
                            this.cp(from, to).then(() => {
                                resolve(true);
                            }).catch(err => {
                                reject(err);
                            });
                        }).catch(err => {
                            reject(err);
                        });
                    }).catch(err => {
                        reject(err);
                    });
                } catch (err) {
                    reject(err);
                }
            }
        );
        return p;
    }

}

export default new Batch();