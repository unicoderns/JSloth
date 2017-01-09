import * as express from "express";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Core Controller Routes
// Basepath: /
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class CoreController {

    // ---------------------------------------------------------------------------------------------------------------
    // Create router.
    // ---------------------------------------------------------------------------------------------------------------
    public router: express.Router = express.Router();

    // ---------------------------------------------------------------------------------------------------------------
    // Run configuration methods on the Loader.
    // ---------------------------------------------------------------------------------------------------------------
    constructor() {
        this.routes();
    }

    // ---------------------------------------------------------------------------------------------------------------
    // Configure API endpoints.
    // ---------------------------------------------------------------------------------------------------------------
    private routes(): void {

        /**
         * Render a page with instructions.
         *
         * @param req {express.Request} The request object.
         * @param res {express.Response} The response object.
         * @return void
         */
        this.router.get("/", (req: express.Request, res: express.Response) => {
            res.send("API: /api/users/:id");
        });

        /**
         * Render a json object with fake data.
         *
         * @param req {express.Request} The request object.
         * @param res {express.Response} The response object.
         * @return void
         */
        this.router.get("/api/users/:id", (req: express.Request, res: express.Response) => {
            let user = {
                username: req.params.id,
                firstName: "Chriss",
                lastName: "Mejía"
            };
            res.json(user);
        });

        /**
         * Check the health of the system.
         * Render a json object with a true response.
         *
         * @param req {express.Request} The request object.
         * @param res {express.Response} The response object.
         * @return true
         */
        this.router.get("/health/", (req: express.Request, res: express.Response) => {
            res.json({
                response: true
            });
        });

    }
}

export default new CoreController().router;