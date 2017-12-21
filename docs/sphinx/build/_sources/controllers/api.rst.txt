##################
Api Controller
##################

Restful Controller. 

******************
Methods
******************
Get, Post, Put, Delete, all take 3 params, (path | ``string``, namespace | ``string``, handlers | ``RequestHandler[]``

==================
Example
==================

.. code-block:: javascript
   :linenos:

        this.get("/", "index", this.index);

        /**
        * Dummy function.
        * Render a json object with a true response.
        *
        * @param req { Request } The request object.
        * @param res { Response } The response object.
        * @return json
        */
        private index = (req: Request, res: Response): void => {
            res.json({
                response: true
            });
        };
    
******************
Namespaces
******************
Future feature to alias API urls, then you can change the path and avoid break the link.

******************
Versioning
******************
Sometimes you need to have 2 versions of an API running, for that occasions you can add version support to JSloth Apps

Only add a endpoints/versions.ts file with something like this:

.. code-block:: javascript
   :linenos:

    import Routes from "../../../abstract/controllers/routes";
    import IndexEndpoint from "./v1/index";

    /**
    * Centralized Controller Endpoint Loader
    * 
    * @return express.Router
    */
    export class Urls extends Routes {

        /*** Configure endpoints */
        protected init(): void {
            this.include(IndexEndpoint, "/v1/", "1");
        }
    }
    
_______________________________________

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
    import ApiController from "../../core/abstract/controllers/api";
    import { Request, Response } from "express";

    export default class IndexEndpoint extends ApiController {

        /*** Define routes */
        protected routes(): void {
            this.get("/", "index", this.index);
        }

        /**
        * Dummy function.
        * Render a json object with a true response.
        *
        * @param req { Request } The request object.
        * @param res { Response } The response object.
        * @return json
        */
        private index = (req: Request, res: Response): void => {
            res.json({
                response: true
            });
        };
    
    }
