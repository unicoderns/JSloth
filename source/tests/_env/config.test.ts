import JSFiles from "../../system/lib/files";
import IConfig from '../../system/interfaces/config';

import chalk from "chalk";

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

describe('Dev Tests', () => {
    it('Config file exists', () => {
        expect(config).not.toBeUndefined();
    });

    describe('MySQL', () => {
        it('Config exists', () => {
            expect(config.dbconnection).not.toBeNull();
        });
        it('User is set', () => {
            expect(config.dbconnection.user).not.toBeUndefined();
        });
        it('User is a string', () => {
            expect(typeof(config.dbconnection.user)).toEqual('string');
        });
        it('Password is set', () => {
            expect(config.dbconnection.password).not.toBeUndefined();
        });
        it('Password is a string', () => {
            expect(typeof(config.dbconnection.password)).toEqual('string');
        });
        it('DB name is set', () => {
            expect(config.dbconnection.database).not.toBeUndefined();
        });
        it('DB name is a string', () => {
            expect(typeof(config.dbconnection.database)).toEqual('string');
        });
    });
});

