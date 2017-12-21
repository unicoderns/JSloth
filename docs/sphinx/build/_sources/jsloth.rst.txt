##################
JSloth
##################

Is the library on top of Express that gives JSloth his strenght a layer that automatize common use cases following patterns.

******************
Core
******************

A cointainer to access each part of the library.

:doc:`Controllers </controllers>` and :doc:`DB Models </models/db>` each one cointain a reference to this library reference and can be access any thime using ``this.jsloth``.

------------------
Example
------------------

.. code-block:: javascript
   :linenos:

    this.jsloth.path.get(this.appName, "index.ejs").then((path) => {
        res.render(path);
    });

******************
DB
******************

Easy management of MySQL DBs. 

:doc:`Read more </jsloth/db>`

******************
Files
******************

Everything related with Files IO. 

:doc:`Read more </jsloth/files>`

******************
Path
******************

Helper to reference views easily. 

:doc:`Read more </jsloth/path>`