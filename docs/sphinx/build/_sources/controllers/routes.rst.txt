##################
Routes Controller
##################

Controller Hub, help you import other controllers as childs.

******************
Include
******************

Load an imported controller, and initializes it with the right data, takes 3 parameters (controller | ``any``, url? | ``string``, namespace? | ``string``)

******************
Example
******************

.. code-block:: javascript
   :linenos:

    import Routes from "../../abstract/controllers/routes";
    import IndexController from "./controllers/index";

    /**
    * Centralized Controller Routes Loader 
    * 
    * @return RoutesController
    */
    export class Urls extends Routes {

        /*** Configure routes */
        protected init(): void {
            this.include(IndexController);
        }

    }