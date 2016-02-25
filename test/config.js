'use strict';

// Load modules
const Path = require('path');
const Plugin = require('..');

module.exports = {
    pkg: Plugin.register.attributes.pkg,
    testTable: 'storey',
    plugins: [
        {
            register: Plugin,
            options: {
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
                                filename: Path.join(__dirname, '/artifacts/storey.sqlite')
                            },
                            migrations: {
                                directory: Path.join(__dirname, '/migrations'),
                                tableName: 'migrations_storey'
                            },
                            seeds: {
                                directory: Path.join(__dirname, '/seeds')
                            }
                        }
                    }
                ]
            }
        }
    ]
};
