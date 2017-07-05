##################
Core Controller
##################

The basic controller, it declares the common variables, setup the JSloth Library, the app configuration and routes. 

******************
Example
******************

.. code-block:: javascript
   :linenos:

    /**
     * Index Controller Routes
     * 
     * @basepath /index/
     */
    import CoreController from "../../core/abstract/controllers/core";
    import { Request, Response } from "express";

    export default class IndexController extends CoreController {

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