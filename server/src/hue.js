const auth = require('./routes/authenticate')
const db = require('./db');
const huejay = require('huejay');

const dbDefaults = {users: [{name: 'admin', password:auth.generateHash('admin')}], hueClientConfig: {host: '192.168.1.3'} };
db.defaults(dbDefaults).write();
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
    const client = getClient();
    const user = new client.users.User;
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
    user.password = auth.generateHash(user.password);
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
    if (!auth.validatePassword(userToAuthenticate.password, user.password))  {
        console.log('found user, wrong password');
        return {success: false, message: 'Authntication failed. Wrong password'};
    }
    // if user is found and password is right
    // create a token with only our given payload
    // we don't want to pass in the entire user since that has the password
    const payload = {
        username: user.username 
    };
    var token = auth.generaToken(payload, secret);

    return {
        success: true,
        message: 'Enjoy your token!',
        token: token
    };
}

exports.clean = () => {
    console.log('cleaning ...');
    const client = getClient();
    return client.users.get().then(currentUser => {
        console.log(`currentUser deviceType: ${currentUser.deviceType} - ${currentUser.username}`);
        // delete users except currentUser
        client.users.getAll()
            .then(users => {
                for (let user of users) {
                    if (currentUser.username !== user.username && user.deviceType === 'HueControl') {
                        console.log(`removing: ${user.deviceType} - ${user.username}`);
                        // client.users.delete(user).then(() => {
                        //     console.log('Remove previous user %s', user);
                        // }).catch(error => {
                        //     console.log('Failed to remove user %s. Error: %s', user, error.stack);
                        // })
                    }
                }
            });
        
        console.log('cleaned');
        return {
            'success': true,
            'message': 'cleaned'
        };
    }).catch(err => {
        console.log('error %s', err.stack);
        return {
            'success': false,
            'message': 'HueControl is not authenticated. Cannot clean;'
        };
    })
    console.log('einde');
        
}

exports.init = () => {
    const cleanResult = clean();
    if (cleanResult.success) {
        const client = getClient();
        client.users.get()
            .then(currentUser => {
                console.log(`currentUser deviceType: ${currentUser.deviceType} - ${currentUser.username}`);
                // delete current user
                console.log('removing current user');
                client.users.delete(currentUser).then(() => {
                    console.log('Remove current user %s', currentUser);
                }).catch(error => {
                    console.log('Failed to remove user %s. Error: %s', currentUser, error.stack);
                })

                console.log('initialzied');
                return {
                    'success': true,
                    'message': 'initialized'
                };
                
                
            })
        .catch(err => {
            console.log('error %s', err.stack);
            return {
                'message': 'HueControl is not authenticated. Cannot initialize;'
            };
        })
    }
}

// function sensors(user) {
//     return client.sensors.getAll();
// }

