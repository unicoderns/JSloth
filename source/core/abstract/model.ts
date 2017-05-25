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

import * as JSloth from "../../core/lib/core";
import { Promise } from "es6-promise";

// Private settings fields object
export interface Fields {
    public: string[];
    protected: string[];
}

// Private settings object
export interface Private {
    name: string;
    fields: Fields;
    private: boolean;
}

/**
 * Model Abstract
 */

export class Model {
    protected jsloth: JSloth.Load;

    private privateSettings: Private = {
        name: ((<any>this).constructor.name).toLowerCase(), // Get the table name from the model name in lowercase.
        fields: {
            public: [],
            protected: []
        }, // Fields cache
        private: true // It will be hide
    };

    constructor(jsloth: JSloth.Load) {
        this.jsloth = jsloth;
    }

    /////////////////////////////////////////////////////////////////////
    // Get field list.
    /////////////////////////////////////////////////////////////////////
    public getFields() {
        // Use cache if is available
        if (!this.privateSettings.fields.public.length) {
            // Get all keys then remove the private ones
            let keys = Object.keys(this);
            let publicKeys: string[] = [];
            let protectedKeys: string[] = [];

            // Checking keys
            keys.forEach((name, index, array) => {
                // Removing privates
                let privateField: boolean = (<any>this)[name].private;
                if (!privateField) {
                    let protectedField: boolean = (<any>this)[name].protected;
                    if (protectedField) {
                        // Listing protected
                        protectedKeys.push(name);
                    } else {
                        // Listing public
                        publicKeys.push(name);
                    }
                }
            });
            this.privateSettings.fields.protected = protectedKeys;
            this.privateSettings.fields.public = publicKeys;
        }
        return this.privateSettings.fields;
    }

    /////////////////////////////////////////////////////////////////////
    // Select
    /////////////////////////////////////////////////////////////////////
    public select(): Promise<any> {
        let query = "SELECT * from " + this.privateSettings.name;
        return this.jsloth.db.query(query, []);
    }
}