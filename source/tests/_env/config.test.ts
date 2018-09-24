import app from '../../server';
import JSFiles from "../../system/lib/files";
import IConfig from '../../system/interfaces/config';

import * as chai from 'chai';

const expect = chai.expect;

// ---------------------------------------------------------------------------------------------------------------
// JSloth Library.
// ---------------------------------------------------------------------------------------------------------------
let files = new JSFiles();

// ---------------------------------------------------------------------------------------------------------------
// Loading configuration.
// ---------------------------------------------------------------------------------------------------------------
const configPath: string = "/../../../config.json";
var config: IConfig;

files.exists(__dirname + configPath).then(() => {
    config = require(__dirname + configPath);
    tests();
})

// ---------------------------------------------------------------------------------------------------------------
// Tests.
// ---------------------------------------------------------------------------------------------------------------

function tests() {
    describe('Dev Tests', () => {
        it('Config file exists', () => {
            expect(config).to.exist;
        });

        describe('MySQL', () => {
            it('Config exists', () => {
                expect(config.dbconnection).to.exist;
            });
            it('User is set', () => {
                expect(config.dbconnection.user).to.exist;
            });
            it('User is a string', () => {
                expect(config.dbconnection.user).to.be.string;
            });
            it('Password is set', () => {
                expect(config.dbconnection.password).to.exist;
            });
            it('Password is a string', () => {
                expect(config.dbconnection.password).to.be.string;
            });
            it('DB name is set', () => {
                expect(config.dbconnection.database).to.exist;
            });
            it('DB name is a string', () => {
                expect(config.dbconnection.database).to.be.string;
            });
        });
    });
}
