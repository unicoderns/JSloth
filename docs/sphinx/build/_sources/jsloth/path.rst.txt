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

Get the path for the Angular compiled file:

.. js:function:: get(app: string, file: string)

     :param string folder: App folder requesting the view
     :param string name: App requesting the view
     :param string file: Name of the file to load
     :returns: string

-----------------
Example:
-----------------

.. code-block:: javascript
   :linenos:

    let path = this.jsloth.path.get(this.config.folder, this.config.name, file);
