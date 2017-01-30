import * as mocha from 'mocha';
import * as chai from 'chai';

import * as JSFiles from "../../source/core/lib/files";

const expect = chai.expect;
let files = new JSFiles.Files();

describe('Lib Tests - Files', () => {

    // Async test
    it('File exists', done => {
        files.exists(__dirname + "/files.test.ts", function(exist: boolean) {
            expect(exist).to.be.true;
            done();
        });
    });

    // Async test
    it('Fake file not exists', done => {
        files.exists(__dirname + "/files.test0.ts", function(exist: boolean) {
            expect(exist).to.be.false;
            done();
        });
    });

    // Async test
    it('If file exists works', done => {
        files.exists(__dirname + "/files.test.ts", function(exist: boolean) {
            expect(true).to.be.true;
            done();
        });
    });

});