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

import JSloth from "../lib/core";

import { Promise } from "es6-promise";

import * as users from "@unicoderns/cerberus/db/usersModel";

/**
* JSloth Context
* System context storage.
*/
export default class JSContext {
    /*** Basic */
    protected jsloth: JSloth;

    /*** System Urls */
    public baseURL: string = "";
    public sourceURL: string = "";

    /*** Users Cache */
    protected userCache: any;

    /*** System Urls */
    private urls: any = {};

    /*** Configuration methods */
    constructor(jsloth: JSloth, baseURL: string) {
        this.jsloth = jsloth;
        this.sourceURL = baseURL + "/../../";
        this.baseURL = this.sourceURL + "../";
        this.userCache = {};
    }

    /**
     * Set new url.
     *
     * @param token url token
     * @param url url path
     * @return void
     */
    public setUrl(token: string, url: string): void {
        this.urls[token] = url;
    }

    /**
     * Export full context.
     *
     * @return Object
     */
    public export(): any {
        return {
            urls: this.urls
        }
    }
    /**
     * User cache factory
     * 
     * @param id {number} The user id.
     * @return Promise.
     */
/*
    public userCacheFactory = (id: number, cached: boolean = true): Promise<any> => {
        let userTable = new users.Users(this.jsloth.db);
        let that = this;
        function fromSQL() {
            // Create promise
            const p: Promise<any> = new Promise(
                (resolve: (data: any) => void, reject: (err: NodeJS.ErrnoException) => void) => {
                    userTable.get({
                        where: { id: id }
                    }).then((user: any) => {
                        let userTemp = JSON.parse(JSON.stringify(user));
                        that.userCache[id] = userTemp;
                        resolve(userTemp);
                    }).catch(err => {
                        reject(err);
                        throw err;
                    });
                }
            );
            return p;
        }

        if (cached) {
            let userTemp = that.userCache[id];
            if (typeof userTemp == "undefined") {
                return fromSQL();
            } else {
                const p: Promise<any> = new Promise(
                    (resolve: (data: any) => void, reject: (err: NodeJS.ErrnoException) => void) => {
                        resolve(userTemp);
                    }
                );
                return p;
            }
        } else {
            return fromSQL();
        }
    }
*/
}