const data = require('../../data/data.json');
const low = require('lowdb');
const lodashId = require('lodash-id');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('../data/db.json');

const db = low(adapter);
db._.mixin(lodashId);

module.exports = db;