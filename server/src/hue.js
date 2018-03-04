const data = require('../../data/data.json');
const low = require('lowdb');
const lodashId = require('lodash-id');
const FileSync = require('lowdb/adapters/FileSync');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const adapter = new FileSync('../data/db.json');
const db = low(adapter);
db._.mixin(lodashId);

const generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

const validatePassword = (plainText, hash) => {
    console.log('plain %s', plainText);
    console.log('hash %s', hash);
    return bcrypt.compareSync(plainText, hash);
}

db.defaults({users: [{name: 'admin', password:generateHash('admin')}], hueClientConfig: {host: '192.168.1.3'} }).write();
const dbGetUsers = () => {
    return db.get('users');
}

const dbGetUser = id => {
    const users = dbGetUsers();
    return users.getById(id);
}

const dbGetUserByName = username => {
    const users = dbGetUsers();
    console.log('finding user by name %s', username);
    return users.find({username: username});
}

const dbGetHueClientConfig = () => {
    return db.get('hueClientConfig');
}

const huejay = require('huejay');
getClient = () => {
    const config = db.get('hueClientConfig').value();
    console.log('get clinet %s', config);
    return new huejay.Client(config);
}

console.log(getClient());

exports.getBridge = () => {
    console.log('hallo bridge');
    const client = getClient();
    console.log(client);
    let response = { ipAddress : client.config.host, authenticated: false};
    client.users.get().then(user => {
        response.authenticated = true
    });
    return response;
}

exports.setBridge = ipAddress => {
    console.log('set bridge');
    db.set('hueClientConfig.host', ipAddress).write();
    let client = getClient();
    let user = new client.users.User;
    user.deviceType = 'HueControl';
    client.users.create(user).then(user => {
        console.log('username %s',user.username);
        db.set('hueClientConfig.username', user.username).write();
        console.log(db.get('hueClientConfig').value());
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

exports.getUsers = function() {
    return db.get('users').value();
}

exports.getUser = (id) => {
    const user = dbGetUser(id).value();
    delete user['password'];
    return user;
}

exports.addUser = (user) => {
    console.log('adding user %s', user);
    const users = db.get('users');
    user.password = generateHash(user.password);
    const newUser = users.insert(user).write();
    delete newUser['password'];
    return newUser;
}

exports.authenticate = userToAuthenticate =>  {
    console.log('authnticating %s', userToAuthenticate.username);
    const user = dbGetUserByName(userToAuthenticate.username).value();
    if (!user) {
        console.log('didnt find user');
        return {success: false, message: 'Authntication failed. Unknon user' + userToAuthenticate.username};
    }
    if (!validatePassword(userToAuthenticate.password, user.password))  {
        console.log('found user, wrong password');
        return {success: false, message: 'Authntication failed. Wrong password'};
    }
    // if user is found and password is right
    // create a token with only our given payload
    // we don't want to pass in the entire user since that has the password
    const payload = {
        admin: user.admin 
    };
    var token = jwt.sign(payload, '12345', {
        expiresIn: 60*60*24
    });

    return {
        success: true,
        message: 'Enjoy your token!',
        token: token
    };
}

// function sensors(user) {
//     return client.sensors.getAll();
// }

