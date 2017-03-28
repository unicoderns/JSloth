##################
Controllers
##################

The place for the bussiness logic.

==========
Example
==========

.. code-block:: javascript
   :linenos:

    import * as express from "express";
    import * as controller from "../abstract/controller";

    /**
    * Core Controller Routes
    * 
    * @basepath /
    * @return express.Router
    */
    export class CoreController extends controller.Controller {

        /*** Configure endpoints */
        protected routes(): void {

            /**
            * Render a page with instructions.
            *
            * @param req {express.Request} The request object.
            * @param res {express.Response} The response object.
            * @return void
            */
            this.router.get("/", (req: express.Request, res: express.Response) => {
                res.send("Hello World!!!");
            });

        }
    }