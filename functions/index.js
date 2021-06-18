//when building the data base for ... I'll change the 'scream' to 'massage' or 'post'
// but use the same user(Auth)

const functions = require("firebase-functions");
const admin = require('firebase-admin');
const app = require('express')();

admin.initializeApp();

const firebaseConfig = {
    apiKey: "AIzaSyASF9HYDb6NammIrZ5A8a7IKe_ob2JlVmE",
    authDomain: "new-social-c2d10.firebaseapp.com",
    projectId: "new-social-c2d10",
    storageBucket: "new-social-c2d10.appspot.com",
    messagingSenderId: "220054453914",
    appId: "1:220054453914:web:a856e4fff2dfbe03cb2923",
    measurementId: "G-HSESEZ1SFD"
  };

//config has been passed here so firebase knows which one we're talking about
const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);

//where ever we see firestore will be replced with 'db'
const db = admin.firestore();

app.get ('/scream', (req, res) => {
   db
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
   
  db
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

//checks for characters matching
const isEmail = (email) => {
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(emailRegEx)) return true;
    else return false;
}

//this will prevent white spaces
const isEmpty = (string) => {
    if(string.trim() === '') return true;
    else return false;
}

//sign up Route
app.post('/signup', (req, res) => {
    const newUser ={
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
       handle: req.body.handle,
    }

let errors = {};


//check email validation & that it's not empty
if (isEmpty(newUser.email)) {
    errors.email = 'Must not be empty'
} else if(!isEmail(newUser.email)){
    errors.email = 'Must be a valid email address'
}

//checking for password matching & not empty
if(isEmpty(newUser.password)) errors.password = 'Must not be empty'
if(newUser.password !== newUser.confirmPassword) errors.confirmPassword = 'Passwords must match';
if(isEmpty(newUser.handle)) errors.handle = 'Must not be empty';

if(Object.keys(errors).length > 0) return res.status(400).json(errors);

//TODO validate data
let token, userId;
db.doc(`/users/${newUser.handle}`)
    .get()
    .then((doc) => {
        if(doc.exists){
            return res.status(400).json({handle: 'This is already taken'})
        }else {
           return firebase
                .auth()
                .createUserWithEmailAndPassword(newUser.email, newUser.password)
        }
    })
    .then((data) => {
        userId = data.user.uid;
        return data.user.getIdToken();
    })
    .then((idToken) => {
        token = idToken;
        const userCredentials = {
           handle: newUser.handle,
            email: newUser.email,
            createdAt: new Date() .toISOString(),
            userId
        }
        return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() =>{
        return res.status(201).json({token});
    })


    .catch((err) => {
        console.error((err));
        if(err.code === 'auth/email-already-in-use'){
            return res.status(400).json({email: 'Email already in use'})
        }else {
            return res.status(500).json({error: err.code});
        }
    })

})

//login confirmation & auth
app.post('/login', (req,res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };

    let errors = {};

    if(isEmpty(user.email)) errors.email = "Must not be empty";
    if(isEmpty(user.password)) errors.password = "Must not be empty";

    if(Object.keys(errors).length > 0) return res.status(400).json(errors)

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
        return data.user.getIdToken()
    })
    .then(token => {
        return res.json({token});
    })
    .catch(err =>{
        console.error(err);
        if(err.code === 'auth/wrong-password'){
            return res.status(403).json({general: 'Wrong password or email'})
        }else return res.status(500).json({error: err.code})
    });
})
// the ./app now needs to be exported so i can be exported as an API
exports.api = functions.https.onRequest(app);