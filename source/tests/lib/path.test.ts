import JSFiles from "../../system/lib/files";
import JSPath from "../../system/lib/path";

import * as mocha from "mocha";
import * as chai from "chai";

const expect = chai.expect;
let path: JSPath;

/*** Default configuration filepath */
let configPath: string = "/../../config.json";
let appName: string = "sample";

// ---------------------------------------------------------------------------------------------------------------
// JSloth Library.
// ---------------------------------------------------------------------------------------------------------------
// Loading JSloth Files directly to load the config file.
let jslothFiles = new JSFiles();

jslothFiles.exists(__dirname + configPath).then(() => {
    var config = require(__dirname + configPath);
    path = new JSPath(config);
    tests();
}).catch(err => {
    console.error("Configuration file not found");
    throw err;
});

function tests() {

    describe("Lib Tests - Path", () => {

        // Async test
        it("view.testfile exists in /sample/views", done => {
            path.get("apps", appName, "view.testfile").then((filepath) => {
                expect(filepath).to.contain('/source/apps/sample/views/view.testfile');
                done();
            }).catch(err => {
                done();
                throw err;
            });
        });

        // Async test
        it("view2.testfile exists in /views/sample/", done => {
            path.get("apps", appName, "view2.testfile").then((filepath) => {
                expect(filepath).to.contain('/source/views/sample/view2.testfile');
                done();
            }).catch(err => {
                done();
                throw err;
            });
        });

    });

}
