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

import * as fields from "../../interfaces/db/fields";
import * as settings from "../../interfaces/db/settings";

/**
 * JSloth DB Datatypes
 */
export class Datatypes {

    /**
     * Merge 2 objects
     * 
     * @var commonType Object 1
     * @var customType Object 2 (will overwrite Object 1 keys)
     * @return Merged object
     */
    private mergeTypes(commonType: any, customType: any) {
        let type = (<any>Object).assign({}, commonType, customType);
        return type;
    }

    /**
     * Fill SQl defaults for fields
     * 
     * @var settings Object with custom settings
     * @return Object with defaults
     */
    private fillDefault(settings: settings.General = {}): settings.General {
        let type: settings.General = {
            primaryKey: settings.primaryKey || false,
            notNull: settings.notNull || false,
            unique: settings.unique || false,
            // binary: settings.binary || false,
            unsigned: settings.unsigned || false,
            zeroFill: settings.zeroFill || false,
            autoincrement: settings.autoincrement || false,
            generated: settings.generated || false,
            protected: settings.protected || false,
            private: settings.private || false
        };
        return type;
    }

    /////////////////////////////////////////////////////////////////////
    // Numbers
    /////////////////////////////////////////////////////////////////////

    public INT(settings: settings.General = {}): fields.Datatype {
        let commonType = this.fillDefault(settings);
        let customType: fields.Datatype = {
            type: "INT",
            size: settings.size
        };
        return this.mergeTypes(commonType, customType);
    }

    // ------------------------------------------------------------------
    // Special Numbers
    // ------------------------------------------------------------------
    public ID(settings: settings.General = {}): fields.Datatype {
        let commonType = this.fillDefault(settings);
        let customType: fields.Datatype = {
            type: "INT",
            size: settings.size || 0,
            primaryKey: true,
            notNull: true,
            unique: true,
            unsigned: true,
            autoincrement: true
        };
        return this.mergeTypes(commonType, customType);
    }

    public STATICKEY(keys: any, settings: settings.General = {}): fields.StaticKey {
        let commonType = this.fillDefault(settings);
        let customType: fields.StaticKey = {
            type: "INT",
            size: settings.size || 0,
            keys: keys
        };
        return this.mergeTypes(commonType, customType);
    }

    /////////////////////////////////////////////////////////////////////
    // Strings
    /////////////////////////////////////////////////////////////////////

    public CHAR(settings: settings.General = <settings.General>{}): fields.Datatype {
        let commonType = this.fillDefault(settings);
        let customType: fields.Datatype = {
            type: "CHAR",
            size: settings.size
        };
        let type = (<any>Object).assign({}, commonType, customType); // Merge
        return type;
    }

    public VARCHAR(settings: settings.General = <settings.General>{}): fields.Datatype {
        let commonType = this.fillDefault(settings);
        let customType: fields.Datatype = {
            type: "VARCHAR",
            size: settings.size
        };
        return this.mergeTypes(commonType, customType);
    }

    /////////////////////////////////////////////////////////////////////
    // Binary
    /////////////////////////////////////////////////////////////////////

    public BOOL(settings: settings.Bool = <settings.Bool>{}): fields.BoolType {
        let commonType = this.fillDefault(settings);
        let customType: fields.BoolType = {
            type: "BOOL",
            default: settings.default
        };
        return this.mergeTypes(commonType, customType);
    }

    /////////////////////////////////////////////////////////////////////
    // Dates
    /////////////////////////////////////////////////////////////////////

    public TIMESTAMP(settings: settings.Timestamp = <settings.Timestamp>{}): fields.DataTimestampType {
        let commonType = this.fillDefault(settings);
        let customType: fields.DataTimestampType = {
            type: "TIMESTAMP",
            default: settings.default
        };
        return this.mergeTypes(commonType, customType);
    }

}