'use strict';

// Load modules

const _ = require('lodash');
const Hoek = require('hoek');
const Async = require('async');
const JSData = require('js-data');
const DSSqlAdapter = require('js-data-sql');
JSData.DSUtils.Promise = require('bluebird');
const Pkg = require('../package.json');

// Declare internals

const internals = {};


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
    }
};

internals.DS = null;


internals.registerAdapter = function (config, callback) {

    let adapter = null;
    const adapterNotFound = new Error('Adapter type not configured in the storey plugin');

    if (config.type === 'DSSqlAdapter') {
        adapter = new DSSqlAdapter(config.options);
        internals.DS.registerAdapter(config.name, adapter, config.registerOptions);
        return callback();
    }

    callback(adapterNotFound);
};


internals.loadAdapters = function (adapters, callback) {

    Async.each(adapters, internals.registerAdapter, (err) => {

        if (err) {
            return callback(err);
        }

        callback();
    });
};


internals.init = function (options) {

    // Merge plugin options with defaults

    options = _.defaultsDeep(options, internals.defaults);

    // JSData store

    internals.DS = new JSData.DS(options.store);

    // JSData load adapters into store

    internals.loadAdapters(options.adapters, (err) => {

        if (err) {
            throw err;
        }
    });

    return internals.DS;
};


exports.register = function (server, options, next) {

    // Create data store and expose
    try {
        Hoek.assert(_.isArray(options.adapters), new Error('Plugin options: the js-data adaptors array is required!'));

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
