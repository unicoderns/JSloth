import * as mocha from 'mocha';
import * as chai from 'chai';
import fs = require('fs');
import chaiHttp = require('chai-http');

import app from '../source/server';

chai.use(chaiHttp);
const expect = chai.expect;

// ---------------------------------------------------------------------------------------------------------------
// Loading configuration.
// ---------------------------------------------------------------------------------------------------------------
const basePath = process.cwd();
const configPath = basePath + "/config.json";
let config:JSON;

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

});