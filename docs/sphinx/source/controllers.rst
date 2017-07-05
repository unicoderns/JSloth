##################
Controllers
##################

The place for the business logic, there's 4 categories of controllers:

******************
JSloth Library
******************
A reference to :doc:`JSloth Library <jsloth/>` is available under ``this.jsloth``

******************
Local config
******************
Each app can use a custom configuration, a reference of the object holding that data is available under ``this.config``

=================
Example
=================

.. code-block:: json
   :linenos:

    {
        "installed_apps": [{
            "config": {
                "session": "stateless"
            }
        }]
    }


******************
Categories
******************

- :doc:`CoreController </controllers/core>`: Basic Controller.
- :doc:`RoutesController </controllers/routes>`: Controller Hub, help you install other controllers as childs.
- :doc:`APIController </controllers/api>`: Parent Endpoint Controller
- :doc:`HtmlController </controllers/html>`: Parent Html-like Render Controller