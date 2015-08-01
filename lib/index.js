'use strict';

// Load modules

var _ = require('lodash');
var Path = require('path');
var Pkg = require('../package.json');
var Async = require('async');
var JSData = require('js-data');
var DSSqlAdapter = require('js-data-sql');
JSData.DSUtils.Promise = require('bluebird');

// Declare internals

var internals = {};


// Defaults

internals.defaults = {
    store: {
        keepChangeHistory: false,
        resetHistoryOnInject: false,
        cacheResponse: false,
        ignoreMissing: true,
        upsert: false,
        bypassCache: true,
        findInverseLinks: false,
        findHasMany: false,
        findBelongsTo: false,
        findHasOne: false,
        notify: false,
        log: false
    },
    adapters: [
        {
            name: 'sql',
            type: 'DSSqlAdapter',
            registerOptions: {
                default: true
            },
            options: {
                client: 'sqlite3',
                connection: {
                    filename: Path.join(__dirname, '../db/storey.sqlite')
                },
                migrations: {
                    directory: Path.join(__dirname, '../db/migrations'),
                    tableName: 'migrations_storey'
                },
                seeds: {
                    directory: Path.join(__dirname, '../db/seeds')
                }
            }
        }
    ]
};

internals.DS = null;


internals.registerAdapter = function (config, callback) {

    var adapter = null;
    var adapterNotFound = new Error('Adapter type not configured in the storey plugin');

    if (config.type === 'DSSqlAdapter') {
        adapter = new DSSqlAdapter(config.options);
        internals.DS.registerAdapter(config.name, adapter, config.registerOptions);
        return callback();
    }

    callback(adapterNotFound);
};


internals.loadAdapters = function (adapters, callback) {

    Async.each(adapters, internals.registerAdapter, function (err) {

        if (err) {
            return callback(err);
        }

        callback();
    });
};


internals.init = function (options) {

    // Options can be optional if used as a module

    options = options || {};

    // Merge plugin options with defaults

    options = _.defaultsDeep(options, internals.defaults);

    // JSData store

    internals.DS = new JSData.DS(options.store);

    // JSData load adapters into store

    internals.loadAdapters(options.adapters, function (err) {

        if (err) {
            throw err;
        }
    });

    return internals.DS;
};


exports.register = function (server, options, next) {

    // Create data store and expose
    try {
        internals.init(options);

        server.expose('DS', internals.DS);
    }
    catch (err) {
        return next(err);
    }

    next();
};


exports.register.attributes = {
    pkg: Pkg
};


exports.DS = internals.init;
