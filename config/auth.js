/**
 * credentials for signing up through facebook and google
 * @type {Object}
 */
module.exports = {

    'facebookAuth' : {
        'clientID'      : '1919784535011152', // your App ID
        'clientSecret'  : '64a50d7dd3e70fbd908c05855bb3976d', // your App Secret
        'callbackURL'   : 'http://localhost:4000/auth/facebook/callback'
    },
    'gitHubAuth' : {
        'clientID'      : '43ac0ae53c3f7d34c67c', // your App ID
        'clientSecret'  : '1fb828679da3ddd4da14a01df4d7d15c8595dae3', // your App Secret
        'callbackURL'   : 'http://localhost:4000/auth/github/callback'
    },

    'googleAuth' : {
        'clientID'      : '975483214865-ouhobikauf1pjpip8oqg43f8bboqi132.apps.googleusercontent.com',
        'clientSecret'  : 'NbDEIADbEoufYUOThbooFTKw',
        'callbackURL'   : 'http://localhost:4000/auth/google/callback'
    }

};
