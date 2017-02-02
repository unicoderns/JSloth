import * as mocha from "mocha";
import * as chai from "chai";

import * as JSPath from "../../source/core/lib/path";

const expect = chai.expect;

// ---------------------------------------------------------------------------------------------------------------
// JSloth Library.
// ---------------------------------------------------------------------------------------------------------------
let path = new JSPath.Path();
path.setTemplateBase(__dirname + "/../../source/core/");

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