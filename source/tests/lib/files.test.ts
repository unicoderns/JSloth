import JSFiles from "../../system/lib/files";

// ---------------------------------------------------------------------------------------------------------------
// JSloth Library.
// ---------------------------------------------------------------------------------------------------------------
let files = new JSFiles();

describe('Lib Tests - Files', () => {

    // Async test
    it('File exists', done => {
        files.exists(__dirname + "/files.test.ts").then((exist) => {
            expect(exist).toBeTruthy;
            done();
        });
    });

    // Async test
    it('Fake file not exists', done => {
        files.exists(__dirname + "/files.test0.ts").catch((err) => {
            expect(err).not.toBeUndefined;
            done();
        });
    });

});