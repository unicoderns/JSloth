////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// JSloth Path
// Check the right path, search /core/ first and /app/ if is not found it.
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import * as JSFiles from "./files";

export class Path {

    private files: JSFiles.Files;
    private basepath: string;

    // ---------------------------------------------------------------------------------------------------------------
    // Run configuration methods.
    // ---------------------------------------------------------------------------------------------------------------
    constructor() {
        this.files = new JSFiles.Files();
    }

    /**
     * Set the new base path.
     *
     * @param path {string} The base path.
     * @return void
     */
    public setTemplateBase(basepath: string): void {
        this.basepath = basepath;
    }

    /**
     * Get the new full path.
     *
     * @param file {string} The file name.
     * @return void
     */
    public get(file: string, next: Function): void {
        let path: string = this.basepath + "views/" + file;
        let customPath: string = this.basepath + "custom_views/" + file;

        this.files.exists(customPath, function (exist: boolean) {
            if (exist) {
                next(customPath);
            } else {
                next(path);
            }
        });
    }

}