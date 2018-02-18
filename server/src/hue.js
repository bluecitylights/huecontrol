 const data = require('../../data/data.json');

 const huejay = require('huejay');
 const client = new huejay.Client(data.authenticate);

exports.users = function() {
    return data.users;
}

// function sensors(user) {
//     return client.sensors.getAll();
// }

