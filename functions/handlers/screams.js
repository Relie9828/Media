
const { db } = require('../util/admin')

exports.getAllScream = (req, res) => {
    db.collection('scream')
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
 }

 exports.postOneScream = (req, res) => {
    if (req.body.body.trim() === ''){
        return res.status(400).json({body: 'Body must not be empty'})
    }
    // block any request from client side -- currently not needed since we've passed app.post('/scream', (req, res) above which automatically executes this code for us --.

    // if(req.method !== 'POST'){
    //     return res.status(400).json({error: "Method not allowed"})
    // }
   const newScream = {
       body: req.body.body,
       userHandle: req.user.handle,
       createdAt: new Date().toISOString()
   };
   
  db.collection('scream')
    .add(newScream)
    .then((doc) => {
        res.json({message: `document ${doc.id} created succesfully`});
    })
    .catch((err) => {
        res.status(500).json({error: 'something went wrong'});
        console.error(err);
    });
}