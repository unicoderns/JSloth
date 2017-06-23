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