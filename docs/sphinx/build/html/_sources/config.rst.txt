##################
Config
##################

Centralized settings file.

*****************
Example
*****************

You will be provided with a sample_config.json file, rename it as config.json

Sample config file:

.. code-block:: json
   :linenos:

    {
        "dev": true,
        "token": "magicisallaroundus",
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
        "installed_apps": [{
            "name": "sample",
            "basepath": "/",
            "config": {}
        }, {
            "name": "auth",
            "basepath": "/auth/",
            "config": {
                "session": "stateless"
            }
        }, {
            "name": "health",
            "basepath": "/health/",
            "config": {}
        }]
    }

*****************
Dev Mode
*****************

Give you better depuration logs, disable safe options and make the system crash with any little problem. | ``boolean``

*****************
Token
*****************

**Secret** token to encript several parts of the system. | ``string``

    .. DANGER::
        Keep it secret at any cost.

*****************
Mysql
*****************

Mysql configuration settings. | ``object``
        
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

===============
Installed Apps
===============

Custom and third part apps. | ``array``

---------------
name
---------------

Unique name for each app. | ``string``

---------------
basepath
---------------

Installation point, ``/`` for root ``app.com/``, ``/app/`` for ``app.com/app/``. | ``string``

---------------
config
---------------

Object with custom configuration for each installed app.