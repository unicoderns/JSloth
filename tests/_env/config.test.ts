import * as mocha from 'mocha';
import * as chai from 'chai';
import * as fs from "fs";
import chaiHttp = require('chai-http');

import app from '../../source/server';
import IConfig from '../../source/interfaces/IConfig';

chai.use(chaiHttp);
const expect = chai.expect;

// ---------------------------------------------------------------------------------------------------------------
// Loading configuration.
// ---------------------------------------------------------------------------------------------------------------
const basePath: string = process.cwd();
const configPath: string = basePath + "/config.json";
let config: IConfig;

if (fs.existsSync(configPath)) {
    config = require(configPath);
}

// ---------------------------------------------------------------------------------------------------------------
// Tests.
// ---------------------------------------------------------------------------------------------------------------

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