////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// JSloth Files
// File related functions.
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import * as fs from "fs";

export class Files {

    // ---------------------------------------------------------------------------------------------------------------
    // Run configuration methods.
    // ---------------------------------------------------------------------------------------------------------------
    constructor() {
    }

    /**
     * Check if file exists.
     *
     * @param path {string} The specific path.
     * @param next {Function} Callback.
     * @return void
     */
    public exists(path: string, next: Function): void {
        fs.access(path, fs.constants.F_OK, (err) => {
             if (!err) {
                 next(true);
             } else {
                 next(false);
             }
        });
    };

    /**
     * Call the Callback if file exists.
     *
     * @param path {string} The specific path.
     * @param next {Function} Callback.
     * @return void
     */
    public ifExists(path: string, next: Function): void {
        fs.access(path, fs.constants.F_OK, (err) => {
             if (!err) {
                 next();
             }
        });
    };

}