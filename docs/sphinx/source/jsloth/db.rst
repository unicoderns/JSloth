##################
JSloth DB
##################

MySQL made easier.

JSDB creates a DB Connection Pool automatically for you.

******************
Configuration
******************

Edit at the centralized :doc:`configuration </config>` file the MySQL lines with the right credentials and settings

.. code-block:: json
   :linenos:

    {
        "mysql": {
            "user": "apiUser",
            "password": "password",
            "db": "apiDB",
            "port": 3306,
            "host": "localhost",
            "connectionLimit": 10,
            "validations": {
                "fields": true
            }
        },
    }

=================
user
=================

Db user name. | ``string``

=================
password
=================

Db user password. | ``string``

=================
db
=================

Db name. | ``string``

=================
port
=================

Port where MySQL service is running, default: 3306. | ``string``

=================
host
=================

Host where MySQL is running. | ``string``

=================
connectionLimit
=================

Max concurrent connections in the pool. | ``number``

=================
validations
=================

-----------------
fields
-----------------

Validate fields to exists in the model (Only working with SELECT [fields] for now). | ``boolean``

.. note::

   Disallowed by default in dev mode.


******************
Public Functions
******************

=================
Query
=================

Execute a plain query

.. js:function:: query(query: string, params: any[])

     :param string query: MySQL query
     :param any[] params: Object (key/value) with parameters to replace in the query
     :returns: Promise with query result

-----------------
Example:
-----------------

.. code-block:: javascript
   :linenos:

    this.jsloth.db.query(query, params);

.. note::

   The query will be log at the terminal in dev mode.
