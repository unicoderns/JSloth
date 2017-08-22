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

const REGISTRY = new Map<string, Map<string, Map<string, string>>>();

function register(target: string, privacy: string, key: string, alias?: string) {
    let map: Map<string, Map<string, string>>;

    if (REGISTRY.has(target)) {
        map = REGISTRY.get(target);
    } else {
        map = new Map<string, Map<string, string>>();
        REGISTRY.set(target, map);
    }

    let list: Map<string, string>;
    if (map.has(privacy)) {
        list = map.get(privacy);
    } else {
        list = new Map<string, string>();
        map.set(privacy, list);
    }

    if (!list.has(key)) {
        list.set(key, alias);
    }
}

export function getList(target: string) {
    return REGISTRY.get(target);
}

/**
 * Core decorators
 * 
 * @param req {Request} The request object.
 * @param res {Response} The response object.
 * @param next Callback.
 */
export function field(alias?: string) {
    return function (target: any, key: string) {
        register((target.constructor.name).toLowerCase(), "public", key, alias);
    }
}

/**
 * Core decorators
 * 
 * @param req {Request} The request object.
 * @param res {Response} The response object.
 * @param next Callback.
 */
export function privateField(alias?: string) {
    return function (target: any, key: string) {
        register((target.constructor.name).toLowerCase(), "private", key, alias);
    }
}