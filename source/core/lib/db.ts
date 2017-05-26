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

import * as mysql from "mysql";
import Config from "../interfaces/Config";
import { Promise } from "es6-promise";

/**
 * JSloth DB
 * Database components.
 */
export class DB {
    private connections: mysql.IPool;

    /*** Configuration methods */
    constructor(config: Config) {
        this.connections = mysql.createPool({
            host: config.mysql.host,
            user: config.mysql.user,
            password: config.mysql.password,
            database: config.mysql.db,
            port: config.mysql.port,
            connectionLimit: config.mysql.connectionLimit
        });
    }

    public query(query: string, params: any[]): Promise<any> {
        // Create promise
        const p: Promise<any> = new Promise(
            (resolve: (data: any) => void, reject: (err: mysql.IError) => void) => {
                // Get connection
                this.connections.getConnection((err, connection) => {
                    if (err) { // Improve error log
                        reject(err);
                    }
                    // Query Mysql
                    connection.query(query, params, (err, rows: any) => {
                        connection.release();
                        if (err) { // Improve error log
                            reject(err);
                        }
                        // Resolve promise
                        resolve(rows);
                    });
                });
            }
        );
        return p;
    }
}