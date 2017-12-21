##################
Html Controller
##################

Aungular Universal optimized controller, help you render SSR Frontend. 

******************
Render
******************
Give you a easy way to load html views using ``this.render(Request, Response, Filename);``.

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
        this.render(req, res, "index");
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
        /*** Define routes */
        protected routes(): void {
            this.app.get("/", this.index);
            this.router.use("/", this.app);
        }

        /**
        * Index view.
        *
        * @param req { Request } The request object.
        * @param res { Response } The response object.
        * @return html
        */
        private index = (req: Request, res: Response): void => {
            this.render(req, res, "index");
        };
    }