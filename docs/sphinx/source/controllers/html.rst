##################
Html Controller
##################

Template optimized controller, help you render HTML-like pages or partials. 

******************
Render
******************
Give you a easy way to load html views using ``this.render(Response, Filename);``.

Custom path: ``/views/basepath/``

App path: ``/basepath/views/``


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
        this.render(res, "index.ejs");
    });

******************
Example
******************

.. code-block:: javascript
   :linenos:

    /**
     * Index Endpoint Routes
     * 
     * @basepath /index/
     */
    import HtmlController from "../../core/abstract/controllers/html";
    import { Request, Response } from "express";

    export default class IndexController extends HtmlController {

        /*** Configure endpoints */
        protected routes(): void {

            /**
             * Some description.
             *
             * @param req {Request} The request object.
             * @param res {Response} The response object.
             */
            this.router.get("/", (req: Request, res: Response) => {
                this.render(res, "index.ejs");
            });
        }
    
    }