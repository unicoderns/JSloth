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
A reference to `JSloth Library`_ is available under ``this.jsloth``

.. _JSloth Library: :doc:`jsloth`

******************
Loading view
******************
JSloth Library provides a default way to load html views that check a custom path before to check the app template path, in this way you can provide your app with a default web interface and the final user can customize it really easy:

Custom path: ``/views/basepath/``

App path: ``/basepath/views/``

.. code-block:: javascript
   :linenos:

    this.jsloth.path.get(this.appName, "index.ejs").then((path) => {
        res.render(path);
    });