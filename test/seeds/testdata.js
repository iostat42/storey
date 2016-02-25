'use strict';

const Chance = require('chance');
const chance = new Chance();
const table = 'storey';

const internals = {};

internals.genRecord = function (id) {

    const record = {
        id: id,
        number: chance.natural({ min: 1, max: 10000 })
    };

    return record;
};

exports.seed = function (knex, Promise) {

    const ids = chance.unique(chance.natural, 100);

    return Promise.join([
        // Deletes ALL existing entries
        knex(table).del(),

        Promise.map(ids, (id) => {

            return knex(table).insert(internals.genRecord(id))
                .catch((err) => {

                    console.error(err);
                    return err;
                });
        })
    ]);
};
