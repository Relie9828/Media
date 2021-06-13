const functions = require("firebase-functions");
const admin = require('firebase-admin');

admin.initializeApp();

const express = required('express')
const app = express();

app.get('/scream', (req, res) => {
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
})



// Getting or calling screams already in the database

// exports.getScreams = functions.https.onRequest((req, res) => {
//     admin
//         .firestore()
//         .collection('scream')
//         .get()
//         .then((data) => {
//             let scream = [];
//             data.forEach((doc) => {
//                 scream.push(doc.data());
//             });
//             return res.json(scream);
//         })
//         .catch((err) => console.error.error(err));
// });



// This script would be to add a new scream to the database

exports.createScream = functions.https.onRequest((req, res) => {

    // this will block any request from client side
    if(req.method !== 'POST'){
        return res.status(400).json({error: "Method not allowed"})
    }
   const newScream = {
       body: req.body.body,
       userHandle: req.body.userHandle,
       createdAt: admin.firestore.Timestamp.fromDate(new Date())
   };
   
   admin
    .firestore()
    .collection('scream')
    .add(newScream)
    .then((doc) => {
        res.json({message: `document ${doc.id} created succesfully`});
    })
    .catch((err) => {
        res.status(500).json({error: 'something went wrong'});
        console.error(err);
    });
});

// this function is used to get the function as an API https request
exports.api = functions.https.onRequest(app);