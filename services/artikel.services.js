//MySQL
const bcrypt = require("bcryptjs");
const auth = require("../middlewares/auth.js");
const otpGenerator = require("otp-generator");
const crypto = require("crypto");
const key = "verysecretkey"; // Key for cryptograpy. Keep it secret
var msg91 = require("msg91")("1", "1", "1");
const mysql = require('mysql');
const {db} = require('../config/db.config');
const path = require("path");
const fs = require("fs");
const app = require("express");


async function login({ email, password }, callback) {
  let selectQuery = 'SELECT COUNT(*) as "total", ?? FROM ?? WHERE ?? = ? LIMIT 1';
  let query = mysql.format(selectQuery, ["password", "user_data", "email", email]);
  //let query = mysql.format(selectQuery, ["password", "user_register", "email", email]);

  db.query(query, (err, data) => {
    if(err) {
      return callback(err);
    }
    if (data[0].total == 0) {
      return callback({
        message: "E-Mail oder Passwort ungültig!",
      });
    }
    else {
      if (bcrypt.compareSync(password, data[0].password)) {
        const token = auth.generateAccessToken(email);
        return callback(null, { token });
      }
      return callback({
        message: "E-Mail oder Passwort ungültig!",
      });
      }
  });

}

async function addartikel(params, callback) {
  global.artnrlieferant = params.artnrlieferant;

  if (params.lieferant === undefined) {
    console.log(params.firstname);
    return callback(
        {
          message: "Der Lieferant ist erforderlich",
        },
        ""
    );
  }

  if (params.artikeltyp === undefined) {
    console.log(params.artikeltyp);
    return callback(
        {
          message: "Der Artikeltyp ist erforderlich",
        },
        ""
    );
  }

  if (params.kategorie === undefined) {
    console.log(params.kategorie);
    return callback(
        {
          message: "Die Kategorie ist erforderlich",
        },
        ""
    );
  }

  if (params.artnrlieferant === undefined) {
    console.log(params.artnrlieferant);
    return callback(
        {
          message: "Die Artikelnummer vom Lieferant ist erforderlich",
        },
        ""
    );
  }

  if (params.eancode === undefined) {
    console.log(params.eancode);
    return callback(
        {
          message: "Der EAN-Code ist erforderlich",
        },
        ""
    );
  }

  if (params.material === undefined) {
    console.log(params.material);
    return callback(
        {
          message: "Das Material ist erforderlich",
        },
        ""
    );
  }

  if (params.dimension === undefined) {
    console.log(params.dimension);
    return callback(
        {
          message: "Die Dimension ist erforderlich",
        },
        ""
    );
  }

  if (params.haptik === undefined) {
    console.log(params.haptik);
    return callback(
        {
          message: "Die Haptik ist erforderlich",
        },
        ""
    );
  }

  if (params.optik === undefined) {
    console.log(params.optik);
    return callback(
        {
          message: "Die Optik ist erforderlich",
        },
        ""
    );
  }


/**

//joining path of directory
  const directoryPath = path.join(__dirname, '../uploads/images/1650536911952.jpg');
//passsing directoryPath and callback function
  fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    files.forEach(function (file) {
      // Do whatever you want to do with the file
      console.log(file);
    });
  });

  var bild = {images:  directoryPath};
  console.log(bild);

  var req = http.request(options, function(res) {
    res.on('data', function (chunk) {
      data += chunk;
    });});

*/
/*
  setTimeout(fs.readFile(file.path, (err, data) => {
    db.query(`INSERT INTO testimg(id, img, name) VALUES(?,?,?)`,
        [2, data, file.filename], (err, results) => {
          if (err) throw err
          console.log("file uploaded")
        });
  }), 20000);
*/

  /*
  await fs.readFile(file.path, (err, data) => {
    db.query(`INSERT INTO testimg(id, img, name) VALUES(?,?,?)`,
        [2, data, file.filename], (err, results) => {
          if (err) throw err
          console.log("file uploaded")
        });
  });
*/


  let selectQuery = 'Select Count(*) as "total" FROM ?? WHERE ?? = ? LIMIT 1';
  let query = mysql.format(selectQuery, ["artikel_data", "artnrlieferant", params.artnrlieferant,]);
  //let query = mysql.format(selectQuery, ["user_register", "email", params.email,]);

  await db.query(query, (err, data) => {
    if(err) {
      return callback(err);
    }
    if(data[0].total > 0) {
      return callback({
        message : "Der Artikel existiert bereits!"
      });
    }
    else {
      db.query(
          `INSERT INTO artikel_data(lieferant, artikeltyp, kategorie, artnrlieferant, eancode, material, dimension, haptik, optik) VALUES (?,?,?,?,?,?,?,?,?)`,
          //`INSERT INTO user_register(username, email, password) VALUES (?,?,?)`,
          [params.lieferant, params.artikeltyp, params.kategorie, params.artnrlieferant, params.eancode, params.material, params.dimension, params.haptik, params.optik],
          //[params.username, params.email, params.password],
          (error, results, fields) => {
            if(error){
              return callback(error);
            }
            return callback(null, "Artikel wurde erfolgreich angelegt!");
          }
      );
    }
  });
  /*
  db.query(query, (err, data) => {
    if(err) {
      return callback(err);
    }
    if(data[0].total > 0) {
      return callback({
        message : "Der Artikel existiert bereits!"
      });
    }
    else {
      db.query(
          `INSERT INTO artikel_data(lieferant, artikeltyp, kategorie, artnrlieferant, eancode, material, dimension, haptik, optik) VALUES (?,?,?,?,?,?,?,?,?)`,
          //`INSERT INTO user_register(username, email, password) VALUES (?,?,?)`,
          [params.lieferant, params.artikeltyp, params.kategorie, params.artnrlieferant, params.eancode, params.material, params.dimension, params.haptik, params.optik],
          //[params.username, params.email, params.password],
          (error, results, fields) => {
            if(error){
              return callback(error);
            }
            return callback(null, "Artikel wurde erfolgreich angelegt!");
          }
      );
    }
  });
  */
}

async function createNewOTP(params, callback) {
  // Generate a 4 digit numeric OTP
  const otp = otpGenerator.generate(4, {
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });
  const ttl = 5 * 60 * 1000; //5 Minutes in miliseconds
  const expires = Date.now() + ttl; //timestamp to 5 minutes in the future
  const data = `${params.phone}.${otp}.${expires}`; // phone.otp.expiry_timestamp
  const hash = crypto.createHmac("sha256", key).update(data).digest("hex"); // creating SHA256 hash of the data
  const fullHash = `${hash}.${expires}`; // Hash.expires, format to send to the user
  // you have to implement the function to send SMS yourself. For demo purpose. let's assume it's called sendSMS
  //sendSMS(phone, `Your OTP is ${otp}. it will expire in 5 minutes`);

  console.log(`Your OTP is ${otp}. it will expire in 5 minutes`);

  var otpMessage = `Dear Customer, ${otp} is the One Time Password ( OTP ) for your login.`;

  msg91.send(`+91${params.phone}`, otpMessage, function (err, response) {
    console.log(response);
  });

  return callback(null, fullHash);
}

async function verifyOTP(params, callback) {
  // Separate Hash value and expires from the hash returned from the user
  let [hashValue, expires] = params.hash.split(".");
  // Check if expiry time has passed
  let now = Date.now();
  if (now > parseInt(expires)) return callback("OTP Expired");
  // Calculate new hash with the same key and the same algorithm
  let data = `${params.phone}.${params.otp}.${expires}`;
  let newCalculatedHash = crypto
      .createHmac("sha256", key)
      .update(data)
      .digest("hex");
  // Match the hashes
  if (newCalculatedHash === hashValue) {
    return callback(null, "Success");
  }
  return callback("Invalid OTP");
}

module.exports = {
  login,
  addartikel,
  createNewOTP,
  verifyOTP,
};



//MongoDB
/*
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const auth = require("../middlewares/auth.js");

const otpGenerator = require("otp-generator");
const crypto = require("crypto");
const key = "verysecretkey"; // Key for cryptograpy. Keep it secret
var msg91 = require("msg91")("1", "1", "1");

async function login({ username, password }, callback) {
  const user = await User.findOne({ username });

  if (user != null) {
    if (bcrypt.compareSync(password, user.password)) {
      const token = auth.generateAccessToken(username);
      // call toJSON method applied during model instantiation
      return callback(null, { ...user.toJSON(), token });
    } else {
      return callback({
        message: "Invalid Username/Password!",
      });
    }
  } else {
    return callback({
      message: "Invalid Username/Password!",
    });
  }
}

async function register(params, callback) {
  if (params.username === undefined) {
    console.log(params.username);
    return callback(
      {
        message: "Username Required",
      },
      ""
    );
  }

  const user = new User(params);
  user
    .save()
    .then((response) => {
      return callback(null, response);
    })
    .catch((error) => {
      return callback(error);
    });
}

async function createNewOTP(params, callback) {
  // Generate a 4 digit numeric OTP
  const otp = otpGenerator.generate(4, {
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });
  const ttl = 5 * 60 * 1000; //5 Minutes in miliseconds
  const expires = Date.now() + ttl; //timestamp to 5 minutes in the future
  const data = `${params.phone}.${otp}.${expires}`; // phone.otp.expiry_timestamp
  const hash = crypto.createHmac("sha256", key).update(data).digest("hex"); // creating SHA256 hash of the data
  const fullHash = `${hash}.${expires}`; // Hash.expires, format to send to the user
  // you have to implement the function to send SMS yourself. For demo purpose. let's assume it's called sendSMS
  //sendSMS(phone, `Your OTP is ${otp}. it will expire in 5 minutes`);

  console.log(`Your OTP is ${otp}. it will expire in 5 minutes`);

  var otpMessage = `Dear Customer, ${otp} is the One Time Password ( OTP ) for your login.`;

  msg91.send(`+91${params.phone}`, otpMessage, function (err, response) {
    console.log(response);
  });

  return callback(null, fullHash);
}

async function verifyOTP(params, callback) {
  // Separate Hash value and expires from the hash returned from the user
  let [hashValue, expires] = params.hash.split(".");
  // Check if expiry time has passed
  let now = Date.now();
  if (now > parseInt(expires)) return callback("OTP Expired");
  // Calculate new hash with the same key and the same algorithm
  let data = `${params.phone}.${params.otp}.${expires}`;
  let newCalculatedHash = crypto
    .createHmac("sha256", key)
    .update(data)
    .digest("hex");
  // Match the hashes
  if (newCalculatedHash === hashValue) {
    return callback(null, "Success");
  }
  return callback("Invalid OTP");
}

module.exports = {
  login,
  register,
  createNewOTP,
  verifyOTP,
};
*/
