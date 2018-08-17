import * as chai from 'chai';
import chaiHttp = require('chai-http');

import app from '../../server';
import JSFiles from "../../system/lib/files";
import IConfig from '../../system/interfaces/config';

chai.use(chaiHttp);
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
});

// ---------------------------------------------------------------------------------------------------------------
// Tests.
// ---------------------------------------------------------------------------------------------------------------

function tests() {

    describe('Core Tests', () => {

        it('health should be json with a true response', () => {
            chai.request(app).get('/api/health')
                .then(res => {
                    expect(res.type).to.eql('application/json');
                    expect(res.body.response).to.eql(true);
                });
        });

    });

}