import * as chai from 'chai';

import app from '../../server';
import chaiHttp = require('chai-http');

chai.use(chaiHttp);

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