import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import app from '../../source/server';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Core Tests', () => {

    it('health should be json with a true response', () => {
        chai.request(app).get('/health')
            .then(res => {
                expect(res.type).to.eql('application/json');
                expect(res.body.response).to.eql(true);
            });
    });

});