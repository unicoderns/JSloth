
import JSPath from "../../system/lib/path";

let path: JSPath;

/*** Default configuration filepath */
let appName: string = "sample";


function tests() {

    describe("Lib Tests - Path", () => {

        // Async test
        it("view.testfile exists in /sample/views", done => {
            path.get("apps", appName, "view.testfile").then((filepath) => {
                expect(filepath).toContain('/source/apps/sample/views/view.testfile');
                done();
            }).catch(err => {
                done();
                throw err;
            });
        });

        // Async test
        it("view2.testfile exists in /views/sample/", done => {
            path.get("apps", appName, "view2.testfile").then((filepath) => {
                expect(filepath).toContain('/source/views/sample/view2.testfile');
                done();
            }).catch(err => {
                done();
                throw err;
            });
        });

    });

}
