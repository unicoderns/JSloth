##################
Api Controller
##################

Right now is just a Controller extending the basic :doc:`CoreController <./core>`. 

******************
Example
******************

.. code-block:: typescript
   :linenos:

    /**
     * Index Endpoint Routes
     * 
     * @basepath /index/
     */
    import ApiController from "../../core/abstract/controllers/api";
    import { Request, Response } from "express";

    export default class IndexEndpoint extends ApiController {

        /*** Configure endpoints */
        protected routes(): void {

            /**
              * Some description.
              *
              * @param req {Request} The request object.
              * @param res {Response} The response object.
              */
            this.router.get("/", (req: Request, res: Response) => {
                res.json({
                    response: true
                });
            });
        }
    
    }