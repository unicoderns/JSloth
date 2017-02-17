import * as mocha from "mocha";
import * as chai from "chai";

import * as JSFiles from "../../source/core/lib/files";
import * as JSPath from "../../source/core/lib/path";

const expect = chai.expect;
let path: JSPath.Path;

/*** Default configuration filepath */
let configPath: string = "/../../config.json";

// ---------------------------------------------------------------------------------------------------------------
// JSloth Library.
// ---------------------------------------------------------------------------------------------------------------
// Loading JSloth Files directly to load the config file.
let jslothFiles = new JSFiles.Files();

jslothFiles.ifExists(__dirname + configPath, () => {
    var config = require(__dirname + configPath);
    path = new JSPath.Path(config);
    path.setTemplateBase(__dirname + "/../../source/core/");
    tests();
});

function tests() {

    describe("Lib Tests - Path", () => {

        // Async test
        it("view.testfile exists in core/views", done => {
            path.get("view.testfile", function (filepath: string) {
                expect(filepath).to.contain('/source/core/views/view.testfile');
                done();
            });
        });

        // Async test
        it("view2.testfile exists in core/custom_views", done => {
            path.get("view2.testfile", function (filepath: string) {
                expect(filepath).to.contain('/source/core/custom_views/view2.testfile');
                done();
            });
        });

    });

}
