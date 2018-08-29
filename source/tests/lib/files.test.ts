import * as chai from 'chai';

import JSFiles from "../../system/lib/files";

const expect = chai.expect;

// ---------------------------------------------------------------------------------------------------------------
// JSloth Library.
// ---------------------------------------------------------------------------------------------------------------
let files = new JSFiles();

describe('Lib Tests - Files', () => {

    // Async test
    it('File exists', done => {
        files.exists(__dirname + "/files.test.ts").then((exist) => {
            expect(exist).to.be.true;
            done();
        });
    });

    // Async test
    it('Fake file not exists', done => {
        files.exists(__dirname + "/files.test0.ts").catch((err) => {
            expect(err).to.exist;
            done();
        });
    });

});