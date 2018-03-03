const data = require('../../data/data.json');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');


const adapter = new FileSync('../data/db.json');
const db = low(adapter);

db.defaults({users: [], authenticate: {} }).write();

const huejay = require('huejay');
const client = new huejay.Client(data.authenticate/*db.get('authenticate').value()*/);

exports.bridge = () => {
    console.log('hallo bridge');
    console.log(client.bridge);
    return { ipAddress : client.config.host, authenticated: /*client.bridge.isAuthenticated()*/false};
}

exports.users = function() {
    return data.users;
}

// function sensors(user) {
//     return client.sensors.getAll();
// }

