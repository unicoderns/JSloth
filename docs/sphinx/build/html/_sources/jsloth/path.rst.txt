##################
JSloth Path
##################

Helper that loads the right view for each app.

******************
Public Functions
******************

=================
Get
=================

Check if there's a custom view available, if don't then return the default path, in this way you can provide your app with a default web interface and the final user can customize it really easy:

Custom path: ``/views/basepath/``

App path: ``/basepath/views/``

.. js:function:: get(app: string, file: string)

     :param string app: App requesting the view
     :param string file: Name of the file to load
     :returns: Promise with string

-----------------
Example:
-----------------

.. code-block:: javascript
   :linenos:

    this.jsloth.path.get(this.appName, "index.ejs").then((path) => {
        res.render(path);
    });