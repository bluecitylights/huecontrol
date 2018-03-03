const data = require('../../data/data.json');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');


const adapter = new FileSync('../data/db.json');
const db = low(adapter);

db.defaults({users: [], authenticate: {} }).write();

const huejay = require('huejay');
getClient = () => {
    return new huejay.Client(db.get('authenticate').value());
}

console.log(getClient());

exports.getBridge = () => {
    const client = getClient();
    console.log('hallo bridge');
    console.log(client);
    let response = { ipAddress : client.config.host, authenticated: false};
    client.users.get().then(user => {
        response.authenticated = true
    });
    return response;
}

exports.setBridge = ipAddress => {
    console.log('set bridge');
    db.set('authenticate.host', ipAddress).write();
    let client = getClient();
    let user = new client.users.User;
    user.deviceType = 'HueControl';
    client.users.create(user).then(user => {
        db.set('authenticate.username', user.username).write();
        console.log(db.get('authenticate').value());
        const currentUser = client.config.username;
        client.users.get().then(user => {
            client.users.delete(currentUser).then(() => {
                console.log('Remove previous user %s', currentUser);
            }).catch(error => {
                console.log('Failed to remove user %s. Error: %s', currentUser, error.stack);
            })
        })
    }).catch(error => {
        if (error instanceof huejay.Error && error.type === 101) {
          return console.log(`Link button not pressed. Try again...`);
        }
        console.log(error.stack);
    });
}

exports.users = function() {
    return data.users;
}

// function sensors(user) {
//     return client.sensors.getAll();
// }

