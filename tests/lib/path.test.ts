import * as mocha from "mocha";
import * as chai from "chai";

import * as JSFiles from "../../source/core/lib/files";
import * as JSPath from "../../source/core/lib/path";

const expect = chai.expect;
let path: JSPath.Path;

/*** Default configuration filepath */
let configPath: string = "/../../config.json";
let appName: string = "sample";

// ---------------------------------------------------------------------------------------------------------------
// JSloth Library.
// ---------------------------------------------------------------------------------------------------------------
// Loading JSloth Files directly to load the config file.
let jslothFiles = new JSFiles.Files();

jslothFiles.ifExists(__dirname + configPath).then(() => {
    var config = require(__dirname + configPath);
    path = new JSPath.Path(config);
    tests();
});

function tests() {

    describe("Lib Tests - Path", () => {

        // Async test
        it("view.testfile exists in /sample/views", done => {
            path.get(appName, "view.testfile").then((filepath) => {
                expect(filepath).to.contain('/source/sample/views/view.testfile');
                done();
            });
        });

        // Async test
        it("view2.testfile exists in /views/sample/", done => {
            path.get(appName, "view2.testfile").then((filepath) => {
                expect(filepath).to.contain('/source/views/sample/view2.testfile');
                done();
            });
        });

    });

}
