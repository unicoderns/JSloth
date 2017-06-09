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

import * as model from "../../core/abstract/model";
import * as fields from "../../core/interfaces/db/fields";
import * as defaults from "../../core/interfaces/db/defaults";
import * as datatypes from "../../core/lib/db/datatypes";

export interface Row {
    id?: number;
    created?: number;
    username: string;
    email: string;
    password: string;
    salt: string;
    first_name?: string;
    last_name?: string;
    // timezone?: string;
    admin?: boolean;
    root?: boolean;
}

/**
 * User Model
 */
export class Users extends model.Model {

    public id: fields.Datatype = new datatypes.Datatypes().ID();

    public created: fields.DataTimestampType = new datatypes.Datatypes().TIMESTAMP({
        notNull: true,
        default: defaults.Timestamp.CURRENT_TIMESTAMP
    });

    public username: fields.Datatype = new datatypes.Datatypes().VARCHAR({
        size: 45,
        unique: true
    });

    public email: fields.Datatype = new datatypes.Datatypes().VARCHAR({
        notNull: true,
        size: 45,
        unique: true
    });

    public password: fields.Datatype = new datatypes.Datatypes().CHAR({
        notNull: true,
        size: 60,
        protected: true
    });

    public salt: fields.Datatype = new datatypes.Datatypes().VARCHAR({
        notNull: true,
        size: 20,
        protected: true
    });

    public first_name: fields.Datatype = new datatypes.Datatypes().VARCHAR({
        size: 45
    });

    public last_name: fields.Datatype = new datatypes.Datatypes().VARCHAR({
        size: 45
    });

    public admin: fields.BoolType = new datatypes.Datatypes().BOOL();

}