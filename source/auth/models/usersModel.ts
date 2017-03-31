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


// from django.db import models

// class Musician(models.Model):
//     first_name = models.CharField(max_length=50)
//     last_name = models.CharField(max_length=50)
//     instrument = models.CharField(max_length=100)

/////////////////////////////////////////////////

import * as model from "../../core/abstract/model";
import * as dbtable from "../../core/interfaces/db/table";
import * as datatypes from "../../core/lib/db/datatypes";

export interface User {
    id?: number;
    created?: number;
    username: string;
    email: string;
    password: string;
    salt: string;
    first_name?: string;
    last_name?: string;
}

/**
 * User Model
 */
export class UsersTable extends model.Model {
    public id: dbtable.Datatype = new datatypes.Datatypes().ID();
    public first_name: dbtable.Datatype = new datatypes.Datatypes().CHAR();
    // models.CharField(max_length = 50)
    // public last_name = models.CharField(max_length = 50)

}