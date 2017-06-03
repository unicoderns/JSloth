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
import * as datatypes from "../../core/lib/db/datatypes";
import { Promise } from "es6-promise";

// Private settings fields object
export interface Fields {
    public: string[];
    protected: string[];
    private: string[];
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
            public: <string[]>[],
            protected: <string[]>[],
            private: <string[]>[]
        }, // Fields cache
        private: true // It will be hide
    };

    constructor(jsloth: JSloth.Load) {
        this.jsloth = jsloth;
    }

    /////////////////////////////////////////////////////////////////////
    // Get field list.
    /////////////////////////////////////////////////////////////////////
    public getFields(): { public: string[], protected: string[] } {
        // Use cache if is available
        if (!this.privateSettings.fields.public.length) {
            // Get all keys then remove the private ones
            let keys = Object.keys(this);
            let publicKeys: string[] = [];
            let protectedKeys: string[] = [];
            let privateKeys: string[] = [];

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
                } else {
                    // Listing private
                    privateKeys.push(name);
                }
            });
            this.privateSettings.fields.protected = protectedKeys;
            this.privateSettings.fields.public = publicKeys;
            this.privateSettings.fields.private = privateKeys; // This will be hidden in consume time
        }
        return {
            public: this.privateSettings.fields.public,
            protected: this.privateSettings.fields.protected
        };
    }

    /////////////////////////////////////////////////////////////////////
    // Helper - Exists in array
    // Check if a key exists in a array
    /////////////////////////////////////////////////////////////////////
    private filterArrayInArray(target: string[], scope: string[]): string[] {
        let keys: string[] = [];
        target.forEach(item => {
            if (scope.indexOf(item) !== -1) {
                keys.push(item);
            }
        });
        return keys;
    }

    /////////////////////////////////////////////////////////////////////
    // Generate a report and filter fields
    /////////////////////////////////////////////////////////////////////
    private selectFieldsReport(select: string[]): Fields {
        let report: Fields = {
            public: <string[]>[],
            protected: <string[]>[],
            private: <string[]>[]
        };
        let fields = this.getFields();

        report.public = this.filterArrayInArray(select, fields.public);
        report.protected = this.filterArrayInArray(select, fields.protected);
        report.private = this.filterArrayInArray(select, this.privateSettings.fields.private);

        return report;
    }

    /////////////////////////////////////////////////////////////////////
    // Validate fields
    // @return string
    /////////////////////////////////////////////////////////////////////
    private validateSelectFields(fields: string[]) {
        // Filtering the select array
        let fieldsSQL = "";
        let filteredFields: string[] = [];
        let fieldsReport: Fields;

        if (typeof fields !== "undefined") {
            if (Array.isArray(fields)) {
                let selectableFields: string[] = [];
                fieldsReport = this.selectFieldsReport(fields);
                // Concat array of selectable fields (filtered fields).
                selectableFields = fieldsReport.public.concat(fieldsReport.protected.concat(fieldsReport.private));
                fieldsSQL = selectableFields.join(", ");
            } else {
                fieldsSQL = fields;
            }
        } else {
            fieldsSQL = "*";
        }


        return {
            sql: fieldsSQL,
            report: fieldsReport
        };
    }

    /////////////////////////////////////////////////////////////////////
    // Generate where sql code
    // @return string
    /////////////////////////////////////////////////////////////////////
    private generteWhereSQL(where?: any): string {
        if (typeof where !== null) {
            let sql: string = " WHERE";
            for (let key in where) {
                sql = sql + " " + key + " = " + where[key];
            }
            return sql + ";";
        } else {
            return ";";
        }
    }

    /////////////////////////////////////////////////////////////////////
    // Plain query
    /////////////////////////////////////////////////////////////////////
    public query(query: string): Promise<any> {
        return this.jsloth.db.query(query, []);
    }

    /////////////////////////////////////////////////////////////////////
    // Select
    /////////////////////////////////////////////////////////////////////
    public select(fields?: string[], where?: any): Promise<any> {
        let selectFields = this.validateSelectFields(fields);
        let whereSQl = "";
        if (typeof where !== "undefined") {
            whereSQl = this.generteWhereSQL(where);
        }
        let query = "SELECT " + selectFields.sql + " from " + this.privateSettings.name + whereSQl;
        console.log(query);
        return this.jsloth.db.query(query, []);
    }

    /////////////////////////////////////////////////////////////////////
    // Insert
    /////////////////////////////////////////////////////////////////////
    public insert(data: any): Promise<any> {
        let fields = [];
        let wildcards = [];
        let values = [];
        for (let key in data) {
            fields.push(key);
            wildcards.push("?");
            values.push(data[key]);
        }
        let query = "INSERT INTO " + this.privateSettings.name + " (" + fields.join(", ") + ") VALUES (" + wildcards.join(", ") + ")";
        console.log(query);
        return this.jsloth.db.query(query, values);
    }
}