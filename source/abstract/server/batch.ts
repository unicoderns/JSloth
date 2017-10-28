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
import * as clc from "cli-color";

import { NextFunction } from "express"

/**
 * Batch commands.
 */
class Batch {

    /*** Batch process */
    private exec = require("child_process").exec;

    private toPrefix: string = __dirname + "/../../../dist/";
    private fromPrefix: string = __dirname + "/../../";

    /*** Compile SCSS sources */
    public compileSCSS = (from: string, to: string, next: NextFunction): void => {
        try {
            // "node-sass --include-path " + __dirname + "/../../../node_modules/foundation-sites/scss --output-style compressed -o " + this.toPrefix + to + " " + this.fromPrefix + from
            this.exec("node-sass --include-path " + __dirname + "/../../../node_modules/bootstrap/scss --output-style compressed -o " + this.toPrefix + to + " " + this.fromPrefix + from, function (error: any, stdout: any, stderr: any) {
                try {
                    let parse = JSON.parse(stderr);
                    if (error !== null) {
                        console.log(clc.yellow(error));
                        next(false);
                    } else {
                        next(true);
                    }
                } catch (err) {
                    next(true);
                }
            });
        } catch (err) { }
    }

    /*** Remove recursive folders */
    private rm = (to: string, next: NextFunction): void => {
        this.exec("rm -r " + this.toPrefix + to, function (error: any, stdout: any, stderr: any) {
            if ((error !== null) && (stderr.substr(stderr.length - 26)) != "No such file or directory\n") {
                console.log(clc.yellow(error));
            }
            next();
        });
    }

    /*** Make directory and basepath */
    private mkdir = (to: string, next: NextFunction): void => {
        this.exec("mkdir -p " + this.toPrefix + to, function (error: any, stdout: any, stderr: any) {
            console.log(clc.yellow(error));
            next();
        }); // Unix only
    }

    /*** Copy recursive folders */
    private cp = (from: string, to: string, next: NextFunction): void => {
        this.exec("cp -r " + this.fromPrefix + from + " " + this.toPrefix + to, function (error: any, stdout: any, stderr: any) {
            if ((error !== null) && (stderr.substr(stderr.length - 26)) != "No such file or directory\n") {
                console.log(clc.yellow(error));
                next(false);
            } else {
                next(true);
            }
        });
    }

    /*** Copy public folder */
    public copyPublic = (from: string, to: string, next: NextFunction): void => {
        try {
            this.rm(to, () => {
                this.mkdir(to, () => {
                    this.cp(from, to, (success: boolean) => {
                        next(success);
                    });
                });
            });
        } catch (err) { }
    }

}

export default new Batch();