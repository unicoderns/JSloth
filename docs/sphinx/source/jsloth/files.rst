##################
JSloth Files
##################

Management of files.

******************
Public Functions
******************

=================
Exists
=================

Check if a file exists

.. js:function:: exists(path: string)

     :param string path: Filepath
     :returns: Promise with boolean

-----------------
Example:
-----------------

.. code-block:: typescript
   :linenos:

    this.jsloth.files.exists(path).then((exists) => {
        // File exists, do something
    }).catch(err => {
        // File not found
    });