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

import * as JSFiles from "./files";
import Config from "../interfaces/Config";

/**
* JSloth Path
* Check the right path, search /core/ first and /app/ if is not found it.
*/
export class Path {

    /*** JSloth Files instance */
    private files: JSFiles.Files;

    /*** Configuration methods */
    constructor(config: Config) {
        this.files = new JSFiles.Files(config);
    }

    /**
     * Get the new full path.
     *
     * @param file {string} The file name.
     * @return void
     */
    public get(app: string, file: string, next: Function): void {
        let path: string = "../dist/" + app + "/views/" + file;
        let customPath: string = app + "/" + file;

        this.files.exists(customPath, (exist: boolean) => {
            if (exist) {
                next(customPath);
            } else {
                next(path);
            }
        });
    }

}