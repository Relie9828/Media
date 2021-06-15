const functions = require("firebase-functions");
const admin = require('firebase-admin');


admin.initializeApp();

const express = require('express');
const app = express();


app.get ('/scream', (req, res) => {
    admin
    .firestore()
    .collection('scream')
    // this orders the screams by date
    .orderBy('createdAt', 'desc')
    .get()
    .then((data) => {
        let scream = [];
        data.forEach((doc) => {
            // gives us controll over which scream we show and were also able to pass the screamID
            scream.push({
                screamId: doc.id,
                body: doc.data().body,
                userHandle: doc.data().userHandle,
                createdAt: doc.data().createdAt,
            });
        });
        return res.json(scream);
    })
    .catch((err) => console.error.error(err));
})


// Requesting scream which are stored in the database
// exports.getScreams = functions.https.onRequest ((req, res) => {
    // admin
    // .firestore()
    // .collection('scream')
    // .get()
    // .then((data) => {
    //     let scream = [];
    //     data.forEach((doc) => {
    //         // function that returns the data inside the document
    //         scream.push(doc.data());
    //     });
    //     return res.json(scream);
    // })
    // .catch((err) => console.error.error(err));
// })


// passing data into the data base with body, userHandle, & timestamp
app.post('/scream', (req, res) => {

    // block any request from client side -- currently not needed since we've passed app.post('/scream', (req, res) above which automatically executes this code for us --.

    // if(req.method !== 'POST'){
    //     return res.status(400).json({error: "Method not allowed"})
    // }
   const newScream = {
       body: req.body.body,
       userHandle: req.body.userHandle,
       createdAt: new Date().toISOString()
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


// the ./app now needs to be exported so i can be exported as an API
exports.api = functions.https.onRequest(app);