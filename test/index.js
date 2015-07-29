// Load modules

var _ = require('lodash');
var Lab = require('lab');
var Code = require('code');
var Hapi = require('hapi');
var Plugin = require('..');


// Test shortcuts

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var it = lab.test;
var expect = Code.expect;
var before = lab.before;
var beforeEach = lab.beforeEach;
var after = lab.after;


// Declare internals

var internals = {};

internals.Pkg = Plugin.register.attributes.pkg;


internals.defaults = {};


internals.defaults.plugins = [
    {
        register: Plugin,
        options: {}
    }
];

internals.defaults.plugins.options = {};


internals.server = function (options) {

    if (_.isUndefined(options) || _.isNull(options)) {
        options = {};
    }

    return new Hapi.Server(options);
};


// Merge test config with defaults

var Config = internals.defaults;


// Tests

describe('Plugin Registration', function () {

    it('registers successfully', function (done) {

        var server = new Hapi.Server();

        server.register(Config.plugins, {}, function (err) {

            expect(err).to.not.exist();
            done();
        });
    });


    it('handles empty', function (done) {

        var server = new Hapi.Server();

        var emptyConfig = _.cloneDeep(Config);

        // Prepare an empty adapter config

        emptyConfig.plugins[0].options = {};

        server.register(emptyConfig.plugins, {}, function (err) {

            expect(err).to.not.exist();
            done();
        });
    });


    it('handles errors', function (done) {

        var server = new Hapi.Server();

        var badConfig = _.cloneDeep(Config);

        // Prepare a bad adapter config

        badConfig.plugins[0].options.adapters[0].name = 'nosql';
        badConfig.plugins[0].options.adapters[0].type = 'DSBadAdapter';
        badConfig.plugins[0].options.adapters[0].registerOptions = {};
        badConfig.plugins[0].options.adapters[0].options = {};

        server.register(badConfig.plugins, {}, function (err) {



            expect(err).to.exist();
            done();
        });
    });


    it('can be used as a module', function (done) {

        var DS = new Plugin.DS();

        var query = DS.adapters.sql.query;

        query.select()
            .from('storey_test')
            .then(function (result) {

                expect(DS).to.be.an.object();
                expect(result).to.be.instanceof(Array);

                done();
            })
            .catch(function (err) {

                throw err;
            });
    });
});


describe('SQL adapter', function () {

    var server = null;
    var DS = null;

    before(function (done) {

        server = internals.server();

        server.register(Config.plugins, Config.plugins.options, function (err) {

            DS = server.plugins[internals.Pkg.name].DS;

            var migrate = DS.adapters.sql.query.migrate;
            var seed = DS.adapters.sql.query.seed;

            migrate.rollback()
                .then(function () {

                    return migrate.latest();
                })
                .then(function () {

                    return seed.run();
                })
                .then(function () {

                    return done();
                })
                .catch(function (err) {

                    throw err;
                });
        });
    });


    it('executes a query', function (done) {

        var query = DS.adapters.sql.query;

        query.select()
            .from('storey')
            .then(function (result) {

                expect(result).to.be.instanceof(Array);

                done();
            })
            .catch(function (err) {

                throw err;
            });

    });
});
