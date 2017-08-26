##################
DB Models
##################

Placed at ``/basepath/models/db/``, DB models help you manage data in a DB table. 

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

    export interface Row {
        id?: number;
        created?: number;
        username: string;
    }

    /**
    * User Model
    */
    export class Users extends Model {

        @field()
        public id: fields.Datatype = new datatypes.Datatypes().ID();

        @field()
        public created: fields.DataTimestampType = new datatypes.Datatypes().TIMESTAMP({
            notNull: true,
            default: defaults.Timestamp.CURRENT_TIMESTAMP
        });

        @field()
        public username: fields.Datatype = new datatypes.Datatypes().VARCHAR({
            size: 45,
            unique: true
        });
    }

******************
Structure
******************
A DB Model mixes a interface and a class.

=================
Interface
=================
Contain all fields and is made to help Typescript compilator to use the right kind of datatype and required status.

=================
Class
=================
This is basically the table, it also cointain all the fields but extend the details focusing in MySQL details.

---------------
Decorators
---------------
Set privacy of fields (``@field``/``@secret``), once a field is mark as ``@secret`` you will be not able to get that field at least that you have a explicit ``unsafe`` instance of the table.

---------------
Datatype
---------------
Kind of MySQL field