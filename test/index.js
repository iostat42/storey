'use strict';

// Load modules

const _ = require('lodash');
const Lab = require('lab');
const Code = require('code');
const Hapi = require('hapi');
const Plugin = require('..');


// Test shortcuts

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const it = lab.test;
const expect = Code.expect;
const before = lab.before;
// const beforeEach = lab.beforeEach;
// const after = lab.after;


// Declare internals

const internals = {};

internals.Pkg = Plugin.register.attributes.pkg;


internals.defaults = {};


internals.defaults.plugins = [
    {
        register: Plugin,
        options: {}
    }
];

internals.defaults.plugins.options = {};


internals.testTable = 'storey';


internals.server = function (options) {

    if (_.isUndefined(options) || _.isNull(options)) {
        options = {};
    }

    return new Hapi.Server(options);
};


// Merge test config with defaults

const Config = internals.defaults;


// Tests

describe('Plugin Registration', () => {

    it('registers successfully', (done) => {

        const server = new Hapi.Server();

        server.register(Config.plugins, {}, (err) => {

            expect(err).to.not.exist();
            done();
        });
    });


    it('handles undefined options', (done) => {

        const server = new Hapi.Server();

        const emptyConfig = _.cloneDeep(Config);

        // Prepare an empty adapter config

        emptyConfig.plugins[0].options = undefined;

        server.register(emptyConfig.plugins, {}, (err) => {

            expect(err).to.not.exist();
            done();
        });
    });


    it('handles errors', (done) => {

        const server = new Hapi.Server();

        const badConfig = _.cloneDeep(Config);

        // Prepare a bad adapter config

        badConfig.plugins[0].options.adapters[0].name = 'nosql';
        badConfig.plugins[0].options.adapters[0].type = 'DSBadAdapter';
        badConfig.plugins[0].options.adapters[0].registerOptions = {};
        badConfig.plugins[0].options.adapters[0].options = {};

        server.register(badConfig.plugins, {}, (err) => {

            expect(err).to.exist();
            done();
        });
    });


    it('can be used as a module', (done) => {

        const DS = new Plugin.DS();

        const query = DS.adapters.sql.query;

        query.select()
            .from(internals.testTable)
            .then((result) => {

                expect(DS).to.be.an.object();
                expect(result).to.be.instanceof(Array);

                done();
            })
            .catch((err) => {

                throw err;
            });
    });
});


describe('SQL adapter', () => {

    let server = null;
    let DS = null;

    before((done) => {

        server = internals.server();

        server.register(Config.plugins, Config.plugins.options, (err) => {

            if (err) {
                throw err;
            }

            DS = server.plugins[internals.Pkg.name].DS;

            const migrate = DS.adapters.sql.query.migrate;
            const seed = DS.adapters.sql.query.seed;

            migrate.rollback()
                .then(() => {

                    return migrate.latest();
                })
                .then(() => {

                    return seed.run();
                })
                .then(() => {

                    return done();
                })
                .catch((err) => {

                    throw err;
                });
        });
    });


    it('executes a query', (done) => {

        const query = DS.adapters.sql.query;

        query.select()
            .from(internals.testTable)
            .then((result) => {

                expect(result).to.be.instanceof(Array);

                done();
            })
            .catch((err) => {

                throw err;
            });

    });
});
