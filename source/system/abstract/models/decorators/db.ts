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

/**
 * Centralized db field registry
 */
const REGISTRY = new Map<string, Map<string, Map<string, string>>>();

/**
 * Register field
 * 
 * @param target Db table name.
 * @param privacy Type of field (public/secret).
 * @param key Field name.
 * @param alias Optional alias for the field.
 */
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

/**
 * Get field map for a table
 * 
 * @param target Db table name.
 * @return Field map.
 */
export function getList(target: string): Map<string, Map<string, string>> {
    // Clone structure and return to prevent any changes in the original one.
    let clone: Map<string, Map<string, string>> = new Map<string, Map<string, string>>();
    let original = REGISTRY.get(target);
    let publicFields = original.get("public");
    let secretFields = original.get("secret");

    // Force string clone
    let strCopy = (text: string): string => {
        return (' ' + text).slice(1);
    }

    if ((publicFields) && (publicFields.size)) {
        let clonePublicfields: Map<string, string> = new Map<string, string>();
        publicFields.forEach((value, key, map) => {
            if (typeof value !== "undefined") {
                clonePublicfields.set(strCopy(key), strCopy(value));
            } else {
                clonePublicfields.set(strCopy(key), undefined);
            }
        });
        clone.set("public", clonePublicfields);
    }

    if ((secretFields) && (secretFields.size)) {
        let cloneSecretfields: Map<string, string> = new Map<string, string>();
        secretFields.forEach((value, key, map) => {
            if (typeof value !== "undefined") {
                cloneSecretfields.set(strCopy(key), strCopy(value));
            } else {
                cloneSecretfields.set(strCopy(key), undefined);
            }
        });
        clone.set("secret", cloneSecretfields);
    }
    return clone;
}

/**
 * Public field decorator
 * 
 * @param alias Optional alias for the field.
 * @param target Db table name.
 * @param key Field name.
 */
export function field(alias?: string) {
    return function (target: any, key: string) {
        register((target.constructor.name).charAt(0).toLowerCase() + (target.constructor.name).slice(1), "public", key, alias || key);
    }
}

/**
 * Secret field decorator
 * 
 * @param alias Optional alias for the field.
 * @param target Db table name.
 * @param key Field name.
 */
export function secret(alias?: string) {
    return function (target: any, key: string) {
        register((target.constructor.name).charAt(0).toLowerCase() + (target.constructor.name).slice(1), "secret", key, alias || key);
    }
}