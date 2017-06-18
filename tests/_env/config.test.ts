import app from '../../source/server';
import JSFiles from "../../source/core/lib/files";
import IConfig from '../../source/core/interfaces/config';

import * as chai from 'chai';
import * as mocha from 'mocha';

const expect = chai.expect;

// ---------------------------------------------------------------------------------------------------------------
// JSloth Library.
// ---------------------------------------------------------------------------------------------------------------
let files = new JSFiles();

// ---------------------------------------------------------------------------------------------------------------
// Loading configuration.
// ---------------------------------------------------------------------------------------------------------------
const configPath: string = "/../../config.json";
var config: IConfig;

files.exists(__dirname + configPath).then(() => {
    config = require(__dirname + configPath);
    tests();
}).catch(err => {
    console.error("Configuration file not found");
});

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
                expect(config.mysql).to.exist;
            });
            it('User is set', () => {
                expect(config.mysql.user).to.exist;
            });
            it('User is a string', () => {
                expect(config.mysql.user).to.be.string;
            });
            it('Password is set', () => {
                expect(config.mysql.password).to.exist;
            });
            it('Password is a string', () => {
                expect(config.mysql.password).to.be.string;
            });
            it('DB name is set', () => {
                expect(config.mysql.db).to.exist;
            });
            it('DB name is a string', () => {
                expect(config.mysql.db).to.be.string;
            });
        });
    });
}
