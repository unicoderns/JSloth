##################
DB Models
##################

Placed at ``/basepath/models/db/``, DB models help you manage data in a DB table. 

******************
Field decorators
******************
@field() and @secret() defines fields and security

_______________________________________

******************
Example
******************

.. code-block:: typescript
   :linenos:

    import Model from "../../../../abstract/models/model";
    import { field, secret } from "../../../../abstract/models/decorators/db";
    import * as fields from "../../../../interfaces/db/fields";
    import * as defaults from "../../../../interfaces/db/defaults";
    import * as datatypes from "../../../../lib/db/datatypes";
    import * as timezones from "../static/timezoneModel";

    export interface Row {
        id?: number;
        created?: number;
        username: string;
        email: string;
        password: string;
        salt: string;
        first_name?: string;
        last_name?: string;
        timezone?: number;
        admin?: boolean;
        verified?: boolean;
        active?: boolean;
    }

    /**
     * User Model
     */
    export class Users extends model.Model {

        @field()
        public id: fields.DataType = new datatypes.Datatypes().ID();

        @field()
        public created: fields.DataTimestampType = new datatypes.Datatypes().TIMESTAMP({
            notNull: true,
            default: defaults.Timestamp.CURRENT_TIMESTAMP
        });

        @field()
        public username: fields.DataType = new datatypes.Datatypes().VARCHAR({
            size: 45,
            unique: true
        });

        @field()
        public email: fields.DataType = new datatypes.Datatypes().VARCHAR({
            notNull: true,
            size: 45,
            unique: true
        });

        @secret()
        public password: fields.DataType = new datatypes.Datatypes().CHAR({
            notNull: true,
            size: 60
        });

        @secret()
        public salt: fields.DataType = new datatypes.Datatypes().VARCHAR({
            notNull: true,
            size: 20
        });

        @field()
        public first_name: fields.DataType = new datatypes.Datatypes().VARCHAR({
            size: 45
        });

        @field()
        public last_name: fields.DataType = new datatypes.Datatypes().VARCHAR({
            size: 45
        });

        @field()
        public timezone: fields.DataType = new datatypes.Datatypes().STATICKEY(timezones);

        @field()
        public admin: fields.BoolType = new datatypes.Datatypes().BOOL();

        @field()
        public verified: fields.BoolType = new datatypes.Datatypes().BOOL();

        @field()
        public active: fields.BoolType = new datatypes.Datatypes().BOOL();

    }
