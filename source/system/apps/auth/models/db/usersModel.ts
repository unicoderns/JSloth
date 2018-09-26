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

import { field, secret, Fields, Defaults, Datatypes, Models, Model } from "@unicoderns/orm"

import * as timezones from "../static/timezoneModel";

export interface Row {
    id?: number;
    created?: number;
    username: string;
    email: string;
    password: string;
    salt: string;
    firstName?: string;
    lastName?: string;
    timezone?: number;
    admin?: boolean;
    verified?: boolean;
    active?: boolean;
}

/**
 * User Model
 */
export class Users extends Model {

    @field()
    public id: Fields.DataType = new Datatypes().ID();

    @field()
    public created: Fields.DataTimestampType = new Datatypes().TIMESTAMP({
        notNull: true,
        default: Defaults.Timestamp.CURRENT_TIMESTAMP
    });

    @field()
    public username: Fields.DataType = new Datatypes().VARCHAR({
        size: 45,
        unique: true
    });

    @field()
    public email: Fields.DataType = new Datatypes().VARCHAR({
        notNull: true,
        size: 45,
        unique: true
    });

    @secret()
    public password: Fields.DataType = new Datatypes().CHAR({
        notNull: true,
        size: 60
    });

    @secret()
    public salt: Fields.DataType = new Datatypes().VARCHAR({
        notNull: true,
        size: 20
    });

    @field()
    public firstName: Fields.DataType = new Datatypes().VARCHAR({
        size: 45
    });

    @field()
    public lastName: Fields.DataType = new Datatypes().VARCHAR({
        size: 45
    });

    @field()
    public timezone: Fields.DataType = new Datatypes().STATICKEY(timezones);

    @field()
    public admin: Fields.BoolType = new Datatypes().BOOL();

    @field()
    public verified: Fields.BoolType = new Datatypes().BOOL();

    @field()
    public active: Fields.BoolType = new Datatypes().BOOL();

}