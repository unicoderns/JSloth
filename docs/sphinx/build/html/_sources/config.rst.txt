##################
Config
##################

Centralized settings file.

==========
Example
==========

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
            "connectionLimit": 10
        },
        "installed_apps": [{
            "name": "app",
            "basepath": "/app/"
        }],
    }

==========
Dev Mode
==========

*[To-do]* Will give you better depuration conditions. | ``boolean``

==========
Token
==========

**Secret** token to encript several parts of the system. | ``string``

    .. DANGER::
        Keep it secret at any cost.

==========
Mysql
==========

Mysql configuration settings. | ``object``
        
----------
user
----------

Db user name. | ``string``

----------
password
----------

Db user password. | ``string``

----------
db
----------

Db name. | ``string``

----------
port
----------

Port where MySQL service is running, default: 3306. | ``string``

----------
host
----------

Host where MySQL is running. | ``string``

---------------
connectionLimit
---------------

Max concurrent connections in the pool. | ``number``

==============
Installed Apps
==============

Custom and third part apps. | ``array``

----------
name
----------

Unique name for each app. | ``string``

----------
basepath
----------

Installation point, ``/`` for root ``app.com/``, ``/app/`` for ``app.com/app/``. | ``string``