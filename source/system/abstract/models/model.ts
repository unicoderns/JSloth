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

import * as models from "../../interfaces/db/models";
import * as mysql from "mysql";

/**
 * Model Abstract
 */
export default class Model {
    protected jsloth: JSloth;
    protected tableName: string = ((<any>this).constructor.name).charAt(0).toLowerCase() + ((<any>this).constructor.name).slice(1); // Get the table name from the model name in camelcase.
    public unsafe: boolean = false;
    public fields: Map<string, string>;
    public joins: models.Join[] = [];

    /**
     * Create a table object.
     * 
     * @param jsloth Core library
     * @param privacy To get all fields (secrets included), you need to set privacy as "unsafe" explicitly, in that way we ensure that this will not be a security breach in any wrong future upgrade.
     */
    constructor(jsloth: JSloth, privacy?: string) {
        this.jsloth = jsloth;
        if (privacy == "unsafe") {
            this.unsafe = true;
        }
    }

    /**
     * Create cache and return the model field list.
     * 
     * If this.unsafe is set then merge public with secret fields.
     * 
     * @return Fields Mapped
     */
    public getFields(): Map<string, string> {
        let fields = this.fields;
        if (typeof fields == "undefined") {
            let tmp: Map<string, Map<string, string>> = getList(this.tableName);
            fields = tmp.get("public");
            if (this.unsafe) {
                var secret: Map<string, string> = tmp.get("secret");
                if ((secret) && (secret.size)) {
                    secret.forEach(function (value, key) {
                        fields.set(key, value);
                    });
                }
            }
            this.fields = fields;
        }
        return fields;
    }

    /**
     * Convert a map in a array.
     */
    private mapInArray(target: Map<string, string>): string[] {
        let keys: string[] = [];

        target.forEach(item => {
            keys.push(item);
        });
        return keys;
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
    private getSelectFieldsSQL(fields: string[], prefix?: boolean): string {
        let fieldsSQL = "";
        let selectableFields: string[] = [];
        let modelFields = this.getFields();

        // Check if is an array or just SQL code
        if ((Array.isArray(fields)) && (fields.length)) {

            // Log missing fields in dev mode
            if (this.jsloth.config.dev) {
                this.logArrayInArray(fields, modelFields);
            }

            // Check if the validations of fields is on and then filter (Always disallowed in dev mode)
            if (this.jsloth.config.mysql.validations.fields) {
                selectableFields = this.filterArrayInArray(fields, modelFields);
            } else {
                selectableFields = this.mapInArray(modelFields);
            }

        } else {
            selectableFields = this.mapInArray(modelFields);
        }

        if (typeof prefix == "undefined") {
            fieldsSQL = "`" + this.tableName + "`.`";
            fieldsSQL = fieldsSQL + selectableFields.join("`, `" + this.tableName + "`.`") + "`";
        } else {
            let formatedFields: string[] = [];
            selectableFields.forEach(function (field: string) {
                formatedFields.push("`" + this.tableName + "`.`" + field + "` AS `" + this.tableName + "__" + field + "`");
            }.bind(this));
            fieldsSQL = formatedFields.join(", ")
        }

        return fieldsSQL;
    }

    /**
     * Generates a select string from the Join configuration
     * 
     * @var fields String array with field names.
     * @return Object cointaining the SQL and a field report
     */
    private getJoinSelectFieldsSQL(): string {
        let joins = this.joins;
        let joinsStringArray: string[] = [];
        let joinsSQL = "";
        if (joins.length) {
            joins.forEach(function (join: models.Join) {
                joinsStringArray.push(join.keyField.model.getSelectFieldsSQL(join.fields, true));
            });
            joinsSQL = joinsStringArray.join(", ")
            joinsSQL = ", " + joinsSQL;
        }
        return joinsSQL;
    }

    /**
     * Generate join sql code
     * 
     * @return String with the where sql code 
     */
    private generateJoinCode(): string {
        let joins = this.joins;
        let joinsStringArray: string[] = [];
        let joinsSQL = "";
        if (joins.length) {
            joins.forEach(function (join: models.Join) {
                let linkedTableName = join.keyField.model.tableName;
                joinsStringArray.push(
                    " " + join.kind.toUpperCase() + " JOIN " +
                    "`" + linkedTableName + "`" +
                    " ON `" + this.tableName + "`.`" + join.keyField.localField + "` = " +
                    "`" + linkedTableName + "`.`" + join.keyField.linkedField + "`"
                );
            }.bind(this));
            joinsSQL = joinsStringArray.join(" ");
        }
        return joinsSQL;

        //RIGHT JOIN `movies` AS B ON B.`id` = A.`movie_id`
    }

    /////////////////////////////////////////////////////////////////////
    // Generate "AND" chained where sql code
    // @return string
    /////////////////////////////////////////////////////////////////////
    private generateWhereCodeChain(where?: any): { sql: string, values: string[] } {
        let values: string[] = [];
        let keys: string[] = [];
        let filteredKeys: string[] = [];
        let modelFields = this.getFields();
        let config = this.jsloth.config;

        for (let key in where) {
            keys.push(key);
        }

        // Check if the validations of fields is on and then filter (Always disallowed in dev mode)
        if ((config.mysql.validations.fields) && (!config.dev)) {
            filteredKeys = this.filterArrayInArray(keys, modelFields);
        } else {
            if (config.dev) {
                this.logArrayInArray(keys, modelFields);
            }
            filteredKeys = keys;
        }

        if (typeof where !== "undefined") {
            let sql: string = "`" + this.tableName + "`.`";
            sql = sql + filteredKeys.join("` = ? AND `" + this.tableName + "`.`");
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
     * Generate where sql code
     * 
     * @var where Array of key/value objects with the conditions
     * @return String with the where sql code 
     */
    private generateWhereCode(where?: any): { sql: string, values: string[] } {
        let generated: { sql: string, values: string[] } = {
            sql: "",
            values: []
        };
        if (Array.isArray(where)) {
            let values: string[] = [];
            let SQLChains: string[] = [];
            where.forEach(function (chain: any) {
                let localChain = this.generateWhereCodeChain(chain);
                values = values.concat(localChain.values);
                SQLChains.push(localChain.sql);
            }.bind(this));
            generated.sql = "(" + SQLChains.join(") OR (") + ")";
            generated.values = values;
        } else {
            generated = this.generateWhereCodeChain(where);
        }

        if (generated.sql) {
            generated.sql = " WHERE " + generated.sql;
            return generated;
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
     * @var sql MySQL query
     * @var values Values to replace in the query
     * @return Promise with query result
     */
    public query(query: models.Query): Promise<any> {
        return this.jsloth.db.query(query);
    }

    /**
     * Select private query
     *
     * @var fields If is NOT set "*" will be used, if there's a string then it will be used as is, a plain query will be 
     * executed, if in the other hand an array is provided (Recommended), then it will filter the keys and run the query.
     * @var where Key/Value object used to filter the query, an array of Key/Value objects will generate a multiple filter separated by an "OR".
     * @var orderBy String with column_name and direction E.g.: "id, name ASC"
     * @var groupBy String with column_name E.g.: "id, name"
     * @var limit Number of rows to retrieve
     * @return Promise with query result
     * 
     * TODO: 
     * @var orderBy should be an array of fields, then they can be tested
     * @var groupBy should be an array of fields, then they can be tested
     * Join at least 2 tables is important
     * Group this using functions like select("").orderBy() is just easier to understand
     */
    private select(select: models.SelectLimit): Promise<any> {
        let fieldsSQL = this.getSelectFieldsSQL(select.fields);
        let joinFieldsSQL = this.getJoinSelectFieldsSQL();
        let joinCode = this.generateJoinCode();
        let whereCode = this.generateWhereCode(select.where);
        let groupBy = select.groupBy;
        let orderBy = select.orderBy;
        let limit = select.limit;
        let extra = "";
        if ((typeof groupBy !== "undefined") && (groupBy !== null)) {
            extra += " GROUP BY " + groupBy;
        }
        if ((typeof orderBy !== "undefined") && (orderBy !== null)) {
            extra += " ORDER BY " + orderBy;
        }
        if ((typeof limit !== "undefined") && (limit !== null)) {
            extra += " LIMIT " + limit;
        }
        let sql = "SELECT " + fieldsSQL + joinFieldsSQL + " FROM `" + this.tableName + "`" + joinCode + whereCode.sql + extra + ";";
        this.joins = [];
        return this.query({ sql: sql, values: whereCode.values });
    }

    /**
     * Get item - Select query
     *
     * @var fields If is NOT set "*" will be used, if there's a string then it will be used as is, a plain query will be 
     * executed, if in the other hand an array is provided (Recommended), then it will filter the keys and run the query.
     * @var where Key/Value object used to filter the query, an array of Key/Value objects will generate a multiple filter separated by an "OR".
     * @var orderBy String with column_name and direction E.g.: "id, name ASC"
     * @var groupBy String with column_name E.g.: "id, name"
     * @return Promise with query result
     */
    public get(select: models.Select): Promise<any> {
        // Create promise
        const p: Promise<any> = new Promise(
            (resolve: (data: any) => void, reject: (err: mysql.MysqlError) => void) => {
                let sqlPromise = this.select({
                    fields: select.fields,
                    where: select.where,
                    groupBy: select.groupBy,
                    orderBy: select.orderBy,
                    limit: 1
                });
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
     * @var where Key/Value object used to filter the query, an array of Key/Value objects will generate a multiple filter separated by an "OR".
     * @var orderBy String with column_name and direction E.g.: "id, name ASC"
     * @var groupBy String with column_name E.g.: "id, name"
     * @var limit Number of rows to retrieve
     * @return Promise with query result
     */
    public getSome(select: models.SelectLimit): Promise<any> {
        return this.select(select);
    }

    /**
     * Get all items - Select query
     *
     * @var fields If is NOT set "*" will be used, if there's a string then it will be used as is, a plain query will be 
     * executed, if in the other hand an array is provided (Recommended), then it will filter the keys and run the query.
     * @var where Key/Value object used to filter the query, an array of Key/Value objects will generate a multiple filter separated by an "OR".
     * @var orderBy String with column_name and direction E.g.: "id, name ASC"
     * @var groupBy String with column_name E.g.: "id, name"
     * @return Promise with query result
     */
    public getAll(select: models.Select): Promise<any> {
        return this.select(select);
    }

    /**
     * Join a table
     *
     * Specify a field that needs to be joined
     * 
     * Warning: It works only with select requests
     * 
     * @var keyField Model foreign key
     * @var fields String array with names of fields to join
     * @var kind Type of Join to apply E.g.: INNER, LEFT
     * @return Model
     */
    public join(join: models.Join): Model {
        this.joins.push({
            keyField: join.keyField,
            fields: join.fields,
            kind: join.kind
        })
        return this;
    }

    /**
     * Insert query
     * 
     * @var data object to be inserted in the table
     * @return Promise with query result
     */
    public insert(data: models.Row): Promise<any> {
        let fields = [];
        let wildcards = [];
        let values: string[] = [];
        for (let key in data) {
            fields.push(key);
            wildcards.push("?");
            values.push(data[key]);
        }
        let query = "INSERT INTO `" + this.tableName + "` (`" + fields.join("`, `") + "`) VALUES (" + wildcards.join(", ") + ");";
        return this.query({ sql: query, values: values });
    }

    /**
     * Update query
     * 
     * @var data object data to be update in the table
     * @var where Key/Value object used to filter the query, an array of Key/Value objects will generate a multiple filter separated by an "OR".
     * @return Promise with query result
     */
    public update(update: models.Update): Promise<any> {
        let fields = [];
        let values = [];
        let unifiedValues = [];
        let data = update.data;
        let where = update.where;
        for (let key in data) {
            if (data[key] == "now()") {
                fields.push("`" + key + "` = now()");
            } else {
                fields.push("`" + key + "` = ?");
                values.push(data[key]);
            }
        }
        let whereCode = this.generateWhereCode(where);
        let query = "UPDATE `" + this.tableName + "` SET " + fields.join(", ") + whereCode.sql + ";";
        unifiedValues = values.concat(whereCode.values);
        return this.query({ sql: query, values: unifiedValues });
    }

    /**
     * Delete query
     * 
     * @var where Key/Value object used to filter the query, an array of Key/Value objects will generate a multiple filter separated by an "OR".
     * @return Promise with query result
     */
    public delete(where?: models.KeyValue): Promise<any> {
        let whereCode = this.generateWhereCode(where);
        let query = "DELETE FROM `" + this.tableName + "`" + whereCode.sql + ";";
        return this.query({ sql: query, values: whereCode.values });
    }

}