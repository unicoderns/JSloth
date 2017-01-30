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

import * as path from "path";
import * as express from "express";
import * as logger from "morgan";
import * as bodyParser from "body-parser";

import * as JSFiles from "./core/lib/files";
import IConfig from "./core/interfaces/IConfig";

import * as routes from "./core/routes";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Creates and configures an ExpressJS web server.
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class App {

    // Express instance
    public express: express.Application;
    // Get sys port or assign 3000
    private port: number = process.env.PORT || 3000;


    // ===============================================================================================================
    // Loading configuration.
    // ===============================================================================================================
    private configPath: string = "../config.json";
    private config: IConfig;

    // ===============================================================================================================
    // Run configuration methods on the Express instance.
    // ===============================================================================================================
    constructor() {
        let files = new JSFiles.Files();
        files.ifExists(__dirname + this.configPath, function () {
            this.config = require(this.configPath);
        });

        this.express = express();
        this.middleware();
        this.routes();

        // Run server
        this.express.listen(this.port);
        console.log("The magic happens on port " + this.port);
    }

    // ---------------------------------------------------------------------------------------------------------------
    // Configure Express middleware.
    // ---------------------------------------------------------------------------------------------------------------
    private middleware(): void {
        this.express.use(logger("dev"));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }

    // ---------------------------------------------------------------------------------------------------------------
    // Configure API endpoints.
    // ---------------------------------------------------------------------------------------------------------------
    private routes(): void {
        this.express.use("/", routes.default);
    }

}

export default new App().express;