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

/**
 * Batch commands.
 */
class Batch {

    /*** Batch process */
    private exec = require("child_process").exec;

    private toPrefix: string = __dirname + "/../../../dist/";
    private fromPrefix: string = __dirname + "/../../";

    /*** Compile SCSS sources */
    /*    public compileSCSS = (from: string, to: string): void => {
            try {
                // this.exec("node-sass --include-path " + __dirname + "/../../../node_modules/foundation-sites/scss --output-style compressed -o " + to + " " + from, { stdio: [0, 1, 2] });
                this.exec("node-sass --include-path " + __dirname + "/../../../node_modules/bootstrap/scss --output-style compressed -o " + this.toPrefix + to + " " + this.fromPrefix + from, { stdio: [0, 1, 2] });
                console.log("\n");
            } catch (err) {
            }
        }
    */
    /*** Compile SCSS sources */
    public compileSCSS = (from: string, to: string): void => {
        try {
            // "node-sass --include-path " + __dirname + "/../../../node_modules/foundation-sites/scss --output-style compressed -o " + this.toPrefix + to + " " + this.fromPrefix + from
            this.exec("node-sass --include-path " + __dirname + "/../../../node_modules/bootstrap/scss --output-style compressed -o " + this.toPrefix + to + " " + this.fromPrefix + from, function (error: any, stdout: any, stderr: any) {
                try {
                    let parse = JSON.parse(stderr);
                    if (error !== null) {
                        console.log(clc.red(error));
                    }
                } catch (err) { }
            });
        } catch (err) { }
    }

    /*** Copy folders */
    public copy = (from: string, to: string): void => {
        try {
            this.exec("rm -r " + this.toPrefix + to, function (error: any, stdout: any, stderr: any) {
                if ((error !== null) && (stderr.substr(stderr.length - 26)) != "No such file or directory\n") {
                    console.log(clc.red(error));
                }
            });

            this.exec("mkdir -p " + this.toPrefix + to, function (error: any, stdout: any, stderr: any) {
                console.log(clc.red(error));
            }); // Unix only

            this.exec("cp -r " + this.fromPrefix + from + "* " + this.toPrefix + to, function (error: any, stdout: any, stderr: any) {
                if ((error !== null) && (stderr.substr(stderr.length - 26)) != "No such file or directory\n") {
                    console.log(clc.red(error));
                }
            });
        } catch (err) { }
    }

}

export default new Batch();