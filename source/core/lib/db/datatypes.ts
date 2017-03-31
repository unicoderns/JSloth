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

import * as dbtable from "../../interfaces/db/table";

/**
 * JSloth DB Datatypes
 */
export class Datatypes {

    private fillCommonTypes(settings?: dbtable.FieldSettings) {
        let type: dbtable.FieldCommonTypes = {
            primaryKey: settings.primaryKey || false,
            notNull: settings.notNull || false,
            unique: settings.unique || false,
            // binary: settings.binary || false,
            unsigned: settings.unsigned || false,
            zeroFill: settings.zeroFill || false,
            autoincrement: settings.autoincrement || false,
            generated: settings.generated || false
        };
        return type;
    }

    /////////////////////////////////////////////////////////////////////
    // Numbers
    /////////////////////////////////////////////////////////////////////

    public INT(settings?: dbtable.FieldSettings): dbtable.Datatype {
        let commonType = this.fillCommonTypes(settings);
        let customType: dbtable.Datatype = {
            type: "INT",
            size: settings.size,
        };
        let type = (<any>Object).assign({}, commonType, customType); // Merge
        return type;
    }

    // ------------------------------------------------------------------
    // Special Numbers
    // ------------------------------------------------------------------

    public ID(settings?: dbtable.FieldSettings): dbtable.Datatype {
        let commonType = this.fillCommonTypes(settings);
        let customType: dbtable.Datatype = {
            type: "INT",
            size: settings.size || 0,
            primaryKey: true,
            notNull: true,
            unique: true,
            unsigned: true,
            autoincrement: true
        };
        let type = (<any>Object).assign({}, commonType, customType); // Merge
        return type;
    }

    /////////////////////////////////////////////////////////////////////
    // Strings
    /////////////////////////////////////////////////////////////////////

    public CHAR(settings?: dbtable.FieldSettings): dbtable.Datatype {
        let commonType = this.fillCommonTypes(settings);
        let customType: dbtable.Datatype = {
            type: "CHAR",
            size: settings.size,
        };
        let type = (<any>Object).assign({}, commonType, customType); // Merge
        return type;
    }


}