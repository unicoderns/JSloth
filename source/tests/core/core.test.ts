import * as chai from 'chai';

import app from '../../server';
import chalk from "chalk";
import chaiHttp = require('chai-http');
import JSFiles from "../../system/lib/files";
import IConfig from '../../system/interfaces/config';

chai.use(chaiHttp);

// ---------------------------------------------------------------------------------------------------------------
// JSloth Library.
// ---------------------------------------------------------------------------------------------------------------
let files = new JSFiles();

// ---------------------------------------------------------------------------------------------------------------
// Loading configuration.
// ---------------------------------------------------------------------------------------------------------------
const configPath: string = "/../../../config.json";
const defaultConfigPath: string = "/../../../sample_config.json";
var config: IConfig;

beforeAll(done => {
    files.exists(__dirname + configPath).then(() => {
        config = require(__dirname + configPath);
    });
    if (typeof config == "undefined") {
        config = require(__dirname + defaultConfigPath);
        chalk.yellow("Sample config is used");
    }
    done();
});

describe('Core Tests', () => {

    it('health should be json with a true response', (done) => {
        chai.request(app).get('/api/health/v1/')
            .then(res => {
                expect(res.type).toBe('application/json');
                expect(res.body.response).toBe(true);
                done();
            });
    });

});