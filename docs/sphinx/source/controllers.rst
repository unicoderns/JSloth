##################
Controllers
##################

The place for the business logic.

******************
Example
******************

.. code-block:: javascript
   :linenos:

    import Controller from "../../core/abstract/controller";
    import { Request, Response } from "express";

    /**
    * Core Controller Routes
    * 
    * @basepath /something/
    */
    export default class CoreController extends Controller {

        /*** Configure endpoints */
        protected routes(): void {

            /**
            * Some description.
            *
            * @param req {Request} The request object.
            * @param res {Response} The response object.
            */
            this.router.get("/", (req: Request, res: Response) => {
                res.send("Hello World!!!");
            });
        }

    }

******************
JSloth Library
******************
A reference to :doc:`JSloth Library <jsloth/>` is available under ``this.jsloth``

******************
Loading HTML view
******************
JSloth Library provides a default way to load html views.

Custom path: ``/views/basepath/``

App path: ``/basepath/views/``

`Read more <jsloth/path.html#`get>`_

=================
Example
=================

.. code-block:: javascript
   :linenos:

    /**
    * Some description.
    *
    * @param req {Request} The request object.
    * @param res {Response} The response object.
    */
    this.router.get("/", (req: Request, res: Response) => {
        this.jsloth.path.get(this.appName, "index.ejs").then((path) => {
            res.render(path);
        });
    });
