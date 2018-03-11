const auth = require('./routes/authenticate')
const db = require('./db');
const huejay = require('huejay');

const dbDefaults = {
    users: [{id: '07341624-3617-4568-b2d4-a271b36004fc', username: 'admin', password:'$2a$10$dxTx69aXqLEADe5ht1HTseE8METJwODvSUK7AamwnubXYYekHDK7.'}], // 'admin'
    hueClientConfig: {} 
};

db.defaults(dbDefaults).write();


const dbGetUsers = () => {
    const users = db.get('users');
    return Promise.resolve(users);
}

const dbGetUser = id => {
    return dbGetUsers()
        .then(users => {
            const user = users.getById(id);
            if (user === undefined) {
                return Promise.reject('Cannot find user' + id);
            }
            return user;
        });
}

const dbGetUserByName = username => {
    return dbGetUsers().then(users => {
        const user = users.find({username: username}).value();
        if (!user) {
            console.log('didnt find user %s '.username);
            return Promise.reject('Authntication failed. Unknon user ' + username);
        }
        return user;
    });
}

const dbGetHueClientConfig = () => {
    return new Promise((resolve, reject) => {
        const config = db.get('hueClientConfig').value();
        if (config === undefined) {
            console.log('cannot find it');
            reject(Error('Cannot find hueClientConfig in db'));
        }
        else {
            console.log('found it')
            resolve(config);
        }
    });
}

const dbSetHost = (ipAddress) => {
    return Promise.resolve(db.set('hueClientConfig.host', ipAddress).write());
}

const dbSetBridgeUsername = username => {
    return Promise.resolve(db.set('hueClientConfig.username', username).write());
}

const dbGetBridgeUser = () => {
    return Promise.resolve(db.get('hueClientConfig').value());
}

const findBridge = () => {
    return huejay.discover().
        then(bridges => {
            if (bridges.length > 1) {
                Promise.reject(Error('only 1 bridge supported'));
            }
            return bridges[0]
        })
}

getClient = () => {
    return Promise.all([findBridge(), dbGetHueClientConfig()])
        .then(result => {
            const bridge = result[0];
            const config = result[1];
            config.host = bridge.ip;
            return new huejay.Client(config);
        });
}

getClient()
    .then(client => console.log(client))
    .catch(error => console.log(error));

const createUser = client => {
    console.log('creating user');
    const user = new client.users.User;
    user.deviceType = 'HueControl';
    return client.users.create(user)
        .then(user => { return dbSetBridgeUsername(user.username) })
        .then({success: true});
}

exports.getBridge = () => {
    return getClient()
        .then(client => new Promise((resolve, reject) => {
            client.users.get()
                .then(user => {resolve({ ipAddress : client.config.host, authenticated: true})}) 
                .catch(error => {resolve({ ipAddress : client.config.host, authenticated: false})}) // dont reject here, the client app must be able to request authentication
        }));
}

exports.setBridge = ipAddress => {
    console.log('set bridge');
    return dbSetHost(ipAddress)
        .then(getClient)
        .then(createUser)
        .catch(error => {
            if (error instanceof huejay.Error && error.type === 101) {
                console.log(`Link button not pressed. Try again...`);
                return {success: false, message: `Link button not pressed. Try again...`};
            }
            return {success: false, message: `error`};
        })
}

exports.getUsers = function() {
    console.log('getusers');
    return dbGetUsers();
}

exports.getUser = (id) => {
    return dbGetUser(id);
}

exports.addUser = (user) => {
    console.log('adding user %s', user);
    return Promise.all([dbGetUsers(), auth.generateHash(user.password)])
        .then(result => {
            const users = result[0];
            const hash = result[1];
            user.password = hash;
            return users.insert(user).write();
        })
}

exports.authenticate = userToAuthenticate =>  {
    console.log('authnticating %s', userToAuthenticate.username);
    return dbGetUserByName(userToAuthenticate.username)
        .then(user => {
            return new Promise((resolve, reject) => {
                auth.validatePassword(userToAuthenticate.password, user.password)
                    .then(() => {
                        
                        // if user is found and password is right
                        // create a token with only our given payload
                        // we don't want to pass in the entire user since that has the password
                        const payload = {
                            username: user.id
                        };
                        return auth.generateToken(payload);
                    })
                    .then(token => {
                        resolve({
                            success: true,
                            message: 'Enjoy your token!',
                            token: token
                        });
                    })
                    .catch(err => {
                        reject(err);
                    })
                });
        })
        .catch(err => {
            console.log('auth failed ' + err);
            return {
                success : false,
                message: 'failed to authenticate'
            }
        });
}

const getHueControlBridgeUsers = (client) => {
    return client.users.getAll()
        .then(users => users.filter(user => user.deviceType === 'HueControl')
    );
}

exports.clean = () => {
    return getClient().then(client => {
        Promise.all([getHueControlBridgeUsers(client), dbGetBridgeUser()])
            .then(result => {
                const users = result[0];
                const current = result[1];
                for (let user of users) {
                    if (current.username !== user.username) {
                        console.log(`removing: ${user.deviceType} - ${user.username}`);
                        client.users.delete(user)
                    }
                }
                return;
            })
            .then(() => {
                return {
                    'success': true,
                    'message': 'cleaned'
                }
            })
            .catch(err => {
                console.log('error %s', err.stack);
                return {
                    'success': false,
                    'message': 'Cannot clean ' + err
                };
            })
        });
}
