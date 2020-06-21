var express = require('express');
var mongoose = require('mongoose');
var multer = require('multer');
const path = require('path');
var cors = require('cors');
const port = 3000;
var app = express();
var db = mongoose.connection;

app.use(cors());

mongoose.connect('mongodb://localhost:27017/imagesUploaded', {useNewUrlParser: true, useUnifiedTopology: true});

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
    console.log("Database Connected...");
});

var imageSchema = new mongoose.Schema({
    url: String
});

var image = mongoose.model('image', imageSchema);

// app.post("/saveimage", (req, res) => {
    
//     var newImage = new image(req.body);
    
//     newImage.save().then(item => {
//         res.send(`Name saved to database ${req.body}`);
//     })
//     .catch(err => {
//         res.status(400).send("Unable to save to database");
//     });
// });

var storage = multer.diskStorage({
    destination: 'images',
    filename: function(req, file, callBack){
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({storage: storage}).single('file');

app.get('/', (req, res) => res.send('Hello...'));

app.get('images', (req, res) => res.send('Images Folder...'));

app.post('/upload', function(req, res){

    upload(req, res, function (err) {

        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        res.status(200).send(`You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr />`)

        savetodb(req);
    })

    function savetodb(req) {
        let url = req.file.path;

        var newImage = new image({url});
    
        newImage.save().then(item => {
            res.send(`Name saved to database ${url}`);
        })
        .catch(err => {
            res.send("Unable to save to database");
        });
    }


});

app.listen(port, () => console.log(`Server running on port ${port}`));