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

import Controller from "./core";
import { RequestHandler } from "express";

/**
 * Routes Abstract
 */
export default class ApiController extends Controller {

    /**
     * Add url to context
     * 
     * @param url Concatenated url across the imports
     * @param namespace Complete array of namespaces from imports.
     * @return void
     */
    private context(path: string | RegExp | (string | RegExp)[], namespace: string,): void {
        var url: string | RegExp | (string | RegExp)[] = this.url + path;
        var token: string = "";

        url = url.replace(/\/\/+/g, '/'); // Remove double slashes
        token = this.namespaces.join(":") + ":" + namespace;

        this.jsloth.context.setUrl(token, url);
    }

    /**
     * Get Route
     * 
     * @param url Concatenated url across the imports
     * @param namespace Complete array of namespaces from imports.
     * @param handlers Express request handlers.
     * @return void
     */
    protected get(path: string | RegExp | (string | RegExp)[], namespace: string, ...handlers: RequestHandler[]): void {
        this.context(path, namespace);
        this.router.get(path, handlers);
    }

    /**
     * Post Route
     * 
     * @param url Concatenated url across the imports
     * @param namespace Complete array of namespaces from imports.
     * @param handlers Express request handlers.
     * @return void
     */
    protected post(path: string | RegExp | (string | RegExp)[], namespace: string, ...handlers: RequestHandler[]): void {
        this.context(path, namespace);
        this.router.post(path, handlers);
    }
    /**
     * Put Route
     * 
     * @param url Concatenated url across the imports
     * @param namespace Complete array of namespaces from imports.
     * @param handlers Express request handlers.
     * @return void
     */
    protected put(path: string | RegExp | (string | RegExp)[], namespace: string, ...handlers: RequestHandler[]): void {
        this.context(path, namespace);
        this.router.put(path, handlers);
    }
    /**
     * Delete Route
     * 
     * @param url Concatenated url across the imports
     * @param namespace Complete array of namespaces from imports.
     * @param handlers Express request handlers.
     * @return void
     */
    protected delete(path: string | RegExp | (string | RegExp)[], namespace: string, ...handlers: RequestHandler[]): void {
        this.context(path, namespace);
        this.router.delete(path, handlers);
    }

    
}