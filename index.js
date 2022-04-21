//MySQL
const express = require("express");
const app = express();

const auth = require("./middlewares/auth.js");
const errors = require("./middlewares/errors.js");
const unless = require("express-unless");

const path = require("path");
const multer = require("multer");

var cors = require('cors');
//const db = require("./config/db.config");
const dbseq = require("./models/sequelize.model");
global.__basedir = __dirname;

//app.use('/public/images', express.static(__dirname + '/public/images'));

const {db} = require('./config/db.config');
const fs = require("fs");


app.use(express.urlencoded({ extended: true }));

app.use(cors());

var corsOptions = {
    origin: function (origin, callback) {
        // db.loadOrigins is an example call to load
        // a list of origins from a backing database
        db.loadOrigins(function (error, origins) {
            callback(error, origins)
        })
    }
}

app.get('/products/:id', cors(corsOptions), function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for an allowed domain.'})
})

app.listen(80, function () {
    console.log('CORS-enabled web server listening on port 80')
})


//start upload image

var storage = multer.diskStorage(
    {
        destination: function (req, file, cb){
            cb(null, __dirname + "/uploads/images");
        },
        filename: function (req, file, cb) {
            cb(null, Date.now()+path.extname(file.originalname));
        },
    }
);

const upload = multer({storage: storage});

app.post("/upload", upload.single("image"),
    (req, res) => {
    if (req.file === "undefined" || req.file == null){
        return res.status(422).send("image cannot be empty, please choose");
    }
    //let file = req.file;
    global.file = req.file;


    fs.readFile(file.path, (err, data) => {
        db.query(`INSERT INTO testimg(id, img, name) VALUES(?,?,?)`,
            [23, data, file.filename], (err, results) => {
                if (err) throw err
                console.log("file successfully uploaded")
                });
        db.query(`UPDATE artikel_data SET image = ?, image_name = ? WHERE artnrlieferant = ?`,
            [data, file.filename, global.artnrlieferant], (err, results) => {
                if (err) throw err
                console.log("file successfully uploaded")
            });
    });

    var insertData = "UPDATE artikel_data SET image = ? WHERE artnrlieferant = 1234";
    //var insertData = "INSERT INTO artikel_data(image)VALUES(?) WHERE artnrlieferant=1234";
        db.query(insertData, [file.originalname], (err, result) => {
            if (err) throw err
            console.log("file uploaded")
        })

        return res.status(200).send({name: file.filename});
});



//end upload image


// connect to mongodb

/**
 * With useNewUrlParser: The underlying MongoDB driver has deprecated their current connection string parser.
 * Because this is a major change, they added the useNewUrlParser flag to allow users to fall back to the old parser if they find a bug in the new parser.
 * You should set useNewUrlParser: true unless that prevents you from connecting.
 *
 * With useUnifiedTopology, the MongoDB driver sends a heartbeat every heartbeatFrequencyMS to check on the status of the connection.
 * A heartbeat is subject to serverSelectionTimeoutMS , so the MongoDB driver will retry failed heartbeats for up to 30 seconds by default.
 */


// middleware for authenticating token submitted with requests
/**
 * Conditionally skip a middleware when a condition is met.
 */
auth.authenticateToken.unless = unless;
app.use(
    auth.authenticateToken.unless({
        path: [
            { url: "/users/login", methods: ["POST"] },
            { url: "/users/register", methods: ["POST"] },
            { url: "/users/otpLogin", methods: ["POST"] },
            { url: "/users/verifyOTP", methods: ["POST"] },
            { url: "/artikel/addartikel", methods: ["POST"] },
        ],
    })
);

app.use(express.json());





// TEST START

app.use(function (req, res, next) {
    res.header("Content-Type", 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.use('/uploads', express.static(__dirname + '/uploads'));
var storage2 = multer.diskStorage(
    {
        destination: function (req, file, cb){
            cb(null, __dirname + "/uploads/images");
        },
        filename: function (req, file, cb) {
            cb(null, Date.now()+path.extname(file.originalname));
        },
    }
);
const upload2 = multer({storage: storage2});

app.post('/upload2', upload2.single('image'), async (req, res, next) => {
    let data = { companyName: req.body['companyName'],id:req.body['id'], imageUrl: req.file.path };
    let sql = `INSERT INTO DataTable SET ? `;
    db.query(sql, data, (insertionErr, insertionResult) => {
        if (insertionErr) {
            console.log(insertionErr);
            throw insertionErr;
        }
        else {
            console.log(insertionResult);
            res.send(insertionResult);
        }
    });
});

// TEST END

// initialize routes
app.use("/users", require("./routes/users.routes"));
app.use("/artikel", require("./routes/artikel.routes"));

// middleware for error responses
app.use(errors.errorHandler);

// listen for requests
app.listen(process.env.port || 4000, function () {
    console.log("Ready to Go!");
});

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('addr: ' + add);
})

// db.sequelize.sync();
/*dbseq.sequelize.sync({ force: true }).then(() => {
    console.log("Drop and re-sync db.");
});*/


//MongoDB
/*
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dbConfig = require("./config/db.config");

const auth = require("./middlewares/auth.js");
const errors = require("./middlewares/errors.js");
const unless = require("express-unless");

// connect to mongodb
*/
/**
 * With useNewUrlParser: The underlying MongoDB driver has deprecated their current connection string parser.
 * Because this is a major change, they added the useNewUrlParser flag to allow users to fall back to the old parser if they find a bug in the new parser.
 * You should set useNewUrlParser: true unless that prevents you from connecting.
 *
 * With useUnifiedTopology, the MongoDB driver sends a heartbeat every heartbeatFrequencyMS to check on the status of the connection.
 * A heartbeat is subject to serverSelectionTimeoutMS , so the MongoDB driver will retry failed heartbeats for up to 30 seconds by default.
 */
/*
mongoose.Promise = global.Promise;
mongoose
  .connect(dbConfig.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.log("Database connected");
    },
    (error) => {
      console.log("Database can't be connected: " + error);
    }
  );

// middleware for authenticating token submitted with requests
 */
/**
 * Conditionally skip a middleware when a condition is met.
 */
/*
auth.authenticateToken.unless = unless;
app.use(
  auth.authenticateToken.unless({
    path: [
      { url: "/users/login", methods: ["POST"] },
      { url: "/users/register", methods: ["POST"] },
      { url: "/users/otpLogin", methods: ["POST"] },
      { url: "/users/verifyOTP", methods: ["POST"] },
    ],
  })
);

app.use(express.json());

// initialize routes
app.use("/users", require("./routes/users.routes"));

// middleware for error responses
app.use(errors.errorHandler);

// listen for requests
app.listen(process.env.port || 4000, function () {
  console.log("Ready to Go!");
});
*/
