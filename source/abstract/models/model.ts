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

import JSloth from "../../lib/core";
import { Promise } from "es6-promise";
import { getList } from "../models/decorators/db";

import * as mysql from "mysql";
import * as datatypes from "../../lib/db/datatypes";

// Private settings object
export interface Private {
    name: string;
    private: boolean;
}

/**
 * Model Abstract
 */
export default class Model {
    private jsloth: JSloth;
    public static fields: string[];
    protected name: string = ((<any>this).constructor.name).toLowerCase(); // Get the table name from the model name in lowercase.

    constructor(jsloth: JSloth) {
        this.jsloth = jsloth;
    }

    /////////////////////////////////////////////////////////////////////
    // Get field list.
    /////////////////////////////////////////////////////////////////////
    public getFields(): Map<string, Map<string, string>> {
        return getList(this.name);
    }

    /**
     * Filter one array if keys don't exists in other array.
     */
    private filterArrayInArray(target: string[], scope: Map<string, string>): string[] {
        let keys: string[] = [];

        target.forEach(item => {
            if (scope.has(item)) {
                keys.push(item);
            }
        });
        return keys;
    }

    /**
     * Log if keys don't exists in other array.
     */
    private logArrayInArray(target: string[], scope: Map<string, string>): void {
        target.forEach(item => {
            if (!scope.has(item)) {
                console.error(item + " field doesn't exists!");
            }
        });
    }

    /*
        /////////////////////////////////////////////////////////////////////
        // Generate a report and filter fields
        /////////////////////////////////////////////////////////////////////
        private selectFieldsReport(select: string[]): Fields {
            let report: Fields;
            let fields = this.getFields();
    
            report.all = this.filterArrayInArray(select, fields.all);
            report.public = this.filterArrayInArray(select, fields.public);
            report.protected = this.filterArrayInArray(select, fields.protected);
            report.private = this.filterArrayInArray(select, fields.private);
    
            return this.getFields();
        }
    */

    /**
     * Clean and validate a select if is need it
     * 
     * @var fields String array with field names.
     * @return Object cointaining the SQL and a field report
     */
    private getSelectFieldsSQL(fields: string[]): string {
        let fieldsSQL = "";
        let filteredFields: string[] = [];

        // Check if there's any data in @fields or fail with a default `all` SQL code
        if ((typeof fields !== "undefined") && (fields.length)) {
            // Check if is an array or just SQL code
            if (Array.isArray(fields)) {
                let selectableFields: string[] = [];
                let modelFields = this.getFields();
                // Check if the validations of fields is on and then filter (Always disallowed in dev mode)
                if ((this.jsloth.config.mysql.validations.fields) && (!this.jsloth.config.dev)) {
                    selectableFields = this.filterArrayInArray(fields, modelFields.get("public"));
                } else {
                    if (this.jsloth.config.dev) {
                        this.logArrayInArray(fields, modelFields.get("public"));
                    }
                    selectableFields = fields;
                }
                fieldsSQL = fieldsSQL + "`";
                fieldsSQL = fieldsSQL + selectableFields.join("`, `") + "`";
            } else {
                fieldsSQL = fields;
            }
        } else {
            fieldsSQL = "*";
        }


        return fieldsSQL;
    }

    /////////////////////////////////////////////////////////////////////
    // Generate where sql code
    // @return string
    /////////////////////////////////////////////////////////////////////
    private generateWhereData(where?: any): { sql: string, values: string[] } {
        let values: string[] = [];
        let keys: string[] = [];
        let filteredKeys: string[] = [];
        let modelFields = this.getFields();

        for (let key in where) {
            keys.push(key);
        }

        // Check if the validations of fields is on and then filter (Always disallowed in dev mode)
        if ((this.jsloth.config.mysql.validations.fields) && (!this.jsloth.config.dev)) {
            filteredKeys = this.filterArrayInArray(keys, modelFields.get("public"));
        } else {
            if (this.jsloth.config.dev) {
                this.logArrayInArray(keys, modelFields.get("public"));
            }
            filteredKeys = keys;
        }

        if (typeof where !== "undefined") {
            let sql: string = " WHERE `";
            sql = sql + filteredKeys.join("` = ? AND `");
            sql = sql + "` = ?";
            // getting values
            filteredKeys.forEach((item: string) => {
                values.push(where[item]);
            });
            return {
                sql: sql,
                values: values
            };
        } else {
            return {
                sql: "",
                values: []
            };
        }
    }

    /**
     * Plain query
     *
     * Any query over any table can be done here
     *
     * Warnings:
     * - Field privacity or data integrity will not apply to a direct query, you are responsable for the data security.
     * 
     * @var query MySQL query
     * @var params Parameters to replace in the query
     * @return Promise with query result
     */
    public query(query: string, params: string[]): Promise<any> {
        return this.jsloth.db.query(query, params);
    }

    /**
     * Select private query
     *
     * @var fields If is NOT set "*" will be used, if there's a string then it will be used as is, a plain query will be 
     * executed, if in the other hand an array is provided (Recommended), then it will filter the keys and run the query.
     * @var where Key/Value array used to filter the query
     * @return Promise with query result
     */
    private select(fields?: string[], where?: any, limit?: number): Promise<any> {
        let fieldsSQL = this.getSelectFieldsSQL(fields);
        let whereData = this.generateWhereData(where);
        let extra = "";
        if (limit) {
            extra = " LIMIT " + limit;
        }
        let query = "SELECT " + fieldsSQL + " FROM `" + this.name + "`" + whereData.sql + extra + ";";
        return this.jsloth.db.query(query, whereData.values);
    }

    /**
     * Get item - Select query
     *
     * @var fields If is NOT set "*" will be used, if there's a string then it will be used as is, a plain query will be 
     * executed, if in the other hand an array is provided (Recommended), then it will filter the keys and run the query.
     * @var where Key/Value array used to filter the query
     * @return Promise with query result
     */
    public get(fields?: string[], where?: any): Promise<any> {
        // Create promise
        const p: Promise<any> = new Promise(
            (resolve: (data: any) => void, reject: (err: mysql.IError) => void) => {
                let sqlPromise = this.select(fields, where, 1);
                sqlPromise.then((data) => {
                    resolve(data[0]);
                }).catch(err => {
                    reject(err);
                });
            }
        );
        return p;
    }

    /**
     * Get some item - Select query
     *
     * @var fields If is NOT set "*" will be used, if there's a string then it will be used as is, a plain query will be 
     * executed, if in the other hand an array is provided (Recommended), then it will filter the keys and run the query.
     * @var where Key/Value array used to filter the query
     * @return Promise with query result
     */
    public getSome(fields?: string[], where?: any, limit?: number): Promise<any> {
        return this.select(fields, where, limit);
    }

    /**
     * Get all items - Select query
     *
     * @var fields If is NOT set "*" will be used, if there's a string then it will be used as is, a plain query will be 
     * executed, if in the other hand an array is provided (Recommended), then it will filter the keys and run the query.
     * @var where Key/Value array used to filter the query
     * @var limit Number of rows to get
     * @return Promise with query result
     */
    public getAll(fields?: string[], where?: any): Promise<any> {
        return this.select(fields, where);
    }
    /**
     * Insert query
     * 
     * @var data object to be inserted in the table
     * @return Promise with query result
     */
    public insert(data: any): Promise<any> {
        let fields = [];
        let wildcards = [];
        let values = [];
        for (let key in data) {
            fields.push(key);
            wildcards.push("?");
            values.push(data[key]);
        }
        let query = "INSERT INTO `" + this.name + "` (`" + fields.join("`, `") + "`) VALUES (`" + wildcards.join("`, `") + "`);";
        return this.jsloth.db.query(query, values);
    }

    /**
     * Update query
     * 
     * @var data object data to be update in the table
     * @var where Key/Value array used to filter the query
     * @return Promise with query result
     */
    public update(data: any, where?: any): Promise<any> {
        let fields = [];
        let values = [];
        let unifiedValues = [];
        for (let key in data) {
            fields.push("`" + key + "` = ?");
            values.push(data[key]);
        }
        let whereData = this.generateWhereData(where);
        let query = "UPDATE `" + this.name + "` SET " + fields.join(", ") + whereData.sql + ";";
        unifiedValues = values.concat(whereData.values);
        return this.jsloth.db.query(query, unifiedValues);
    }

    /**
     * Delete query
     * 
     * @var where Key/Value array used to filter the query
     * @return Promise with query result
     */
    public delete(where?: any): Promise<any> {
        let whereData = this.generateWhereData(where);
        let query = "DELETE FROM `" + this.name + "`" + whereData.sql + ";";
        return this.jsloth.db.query(query, whereData.values);
    }

}