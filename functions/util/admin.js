const admin = require('firebase-admin');

//config has been passed here so firebase knows which one we're talking about
admin.initializeApp();

//where ever we see firestore will be replced with 'db'
const db = admin.firestore();

module.exports = { admin, db };