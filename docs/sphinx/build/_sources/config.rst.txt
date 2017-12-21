##################
Configuration
##################

Centralized settings file.

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
        
:doc:`Read more </jsloth/db>`

**********************
System and Custom apps
**********************

System and third part apps configuration. | ``array``

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

Object with custom configuration for each installed app, read the specific app documentation for more.

_______________________________________

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
        "system_apps": [{
            "name": "auth",
            "basepath": "/auth/",
            "config": {
                "session": "stateful"
            }
        }, {
            "name": "health",
            "basepath": "/health/",
            "config": {}
        }],
        "custom_apps": [{
            "name": "sample",
            "basepath": "/",
            "config": {}
        }]
    }
