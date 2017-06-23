##################
DB Models
##################

Placed at ``/basepath/models/db/``, DB models help you manage data in a DB table. 

******************
Example
******************

.. code-block:: javascript
   :linenos:

    import * as model from "../../../core/abstract/model";
    import * as fields from "../../../core/interfaces/db/fields";
    import * as defaults from "../../../core/interfaces/db/defaults";
    import * as datatypes from "../../../core/lib/db/datatypes";
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

        public timezone: fields.Datatype = new datatypes.Datatypes().STATICKEY(timezones);

        public admin: fields.BoolType = new datatypes.Datatypes().BOOL();

        public verified: fields.BoolType = new datatypes.Datatypes().BOOL();

        public active: fields.BoolType = new datatypes.Datatypes().BOOL();

    }
