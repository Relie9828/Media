const functions = require("firebase-functions");

const app = require('express')();

const FBAuth = require('./util/fbAuth')

//scream route
const { getAllScream, postOneScream } = require('./handlers/screams');
//signup & login
const { signup, login, uploadImage } = require('./handlers/users');

//signup, login Routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage)

// passing data into the data base with body, userHandle, & timestamp
app.post('/scream', FBAuth, postOneScream);
//Scream route
app.get ('/scream', getAllScream );

// the ./app now needs to be exported so i can be exported as an API
exports.api = functions.https.onRequest(app);