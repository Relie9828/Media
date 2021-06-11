const functions = require("firebase-functions");
const admin = require('firebase-admin');

admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello, Aurelien");
});

// Getting or calling screams already in the database

exports.getScreams = functions.https.onRequest((req, res) => {
    admin
        .firestore()
        .collection('scream')
        .get()
        .then((data) => {
            let scream = [];
            data.forEach((doc) => {
                scream.push(doc.data());
            });
            return res.json(scream);
        })
        .catch((err) => console.error.error(err));
});

// This script would be to add a new scream to the database

exports.createScream = functions.https.onRequest((req, res) => {
   const newScream = {
       body: req.body.body,
       userHandle: req.body.userHandle,
       createdAt: admin.firestore.Timestamp.fromDate(new Date())
   };
   
   admin
    .firestore()
    .collection('scream')
    .add(newScreams)
    .then((doc) => {
        req.json({ message: `document ${doc.id} created succesfully`});
    })
    .catch((err) => {
        res.status(500).json({error: 'something went wrong'});
        console.error(err);
    });
});
