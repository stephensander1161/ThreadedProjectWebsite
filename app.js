/*All code made by Chi except post method*/
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const initializePassport = require('./passport-config');

// Use methods
app.use(express.static('views', { extensions: ['html', 'htm'], index: 'home.html' }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(session({
   secret: 'secret',
   resave: false,
   saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));


let sqlCon = mysql.createPool({
   connectionLimit: 10,
   host: 'localhost',
   user: 'root',
   password: '',
   database: 'travelexperts'
});

let emailUserNameSql = "SELECT `CustEmail` FROM `customers`";
let emailUserName = [];
sqlCon.getConnection((err, connection) => {
   if (err) throw err;
   console.log('Connected!');

   sqlCon.query(emailUserNameSql, (err, result) => {
      if (err) throw err;
      result.forEach(item => {
         // Remove space, line breas, and carriage return from data
         let removeFormat = item.CustEmail.replace(/(\s|\r\n|\n|\r)/gm, "");
         emailUserName.push(removeFormat);
      });
      
      connection.release();
   });
});


// Coded by Chi. Login Test.
initializePassport(
   passport, 
   /* This function returns a username/email if it is in the list of 
    user emails in db (emailUserName) */
   email => emailUsername.find(username => username === email )
);

// Coded by Chi. Login Test.
app.get('/login', checkNotAuthenticated, (req, res) => {
   res.render('login');
})

// Coded by Chi. Login Test.
app.post('/login', passport.authenticate('local', {
   successRedirect: '/',
   failureRedirect: '/login',
   failureFlash: true
}));

// This is for testing. Coded by Romit.
app.get('/rcontact', (req, res) => {
   let sql = "SELECT `AgtFirstName`, `AgtLastName`, `AgtBusPhone`, `AgtEmail`," +
      " `AgtPosition`, `AgencyId` FROM `agents` LIMIT 3";

   sqlCon.getConnection((err, connection) => {
      if (err) throw err;

      sqlCon.query(sql, (err, agents) => {
         if (err) throw err;
         res.render('rcontact', { agents });
         connection.release();
      });
   });
})

// Coded by Stephen and Chi
app.get('/vPackagesForm', (req, res) => {
   let sql = "SELECT `PkgName`, `PkgStartDate`, `PkgEndDate`, `PkgDesc`, " +
      "`PkgBasePrice` FROM `packages` ";
   
   sqlCon.getConnection((err, connection) => {
      if (err) throw err;
      console.log('Connected!');

      sqlCon.query(sql, (err, packages) => {
         if (err) throw err;
         let index = 0;
         res.render('vPackagesForm', { packages, images, index });
         connection.release();
      });
   });
});


// Coded by Chi & Romit
// Dynamic generation of 'agents' from DB.
app.get('/contact', (req, res) => {

   let sql = "SELECT `AgtFirstName`, `AgtLastName`, `AgtBusPhone`, `AgtEmail`," +
      " `AgtPosition`, `AgencyId` FROM `agents` LIMIT 3";

   sqlCon.getConnection((err, connection) => {
      if (err) throw err;

      sqlCon.query(sql, (err, agents) => {
         if (err) throw err;
         res.render('contact', { agents });
         connection.release();
      });
   });
});

// Coded by Chi
app.post('/register', async (req, res) => {

   try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      let data = [req.body.first_name, req.body.last_name, req.body.address,
         req.body.city, req.body.province, req.body.pCode,
         req.body.countrySelect, req.body.phone, req.body.email, hashedPassword];
      
      let sql = "INSERT INTO `customers`(`CustFirstName`, `CustLastName`," +
         " `CustAddress`, `CustCity`, `CustProv`, `CustPostal`, `CustCountry`, " +
         "`CustBusPhone`, `CustEmail`, `password`) VALUES" +
         "(?,?,?,?,?,?,?,?,?,?);";
   
      sqlCon.getConnection((err, connection) => {
         if (err) throw err;
         console.log('Connected!');
   
         sqlCon.query(sql, data, (err, result, fields) => {
            if (err) throw err;
            connection.release();
         });
      });
   } catch {
      res.redirect('register');
   }
});

/*Post method started by Stephen but finished with Chi's help*/

app.post("/vPackages_form", (req, res) => {
   let data = [req.body.dateLeaving, req.body.dateReturning, req.body.leavingFrom, req.body.vacaPackage];

   sqlCon.getConnection((err, connection) => {
      if (err) throw err;

      let sql = "INSERT INTO `orders`(`dateLeaving`, `dateReturning`,"
         + " `leavingFrom`, `packageChosen`) "
         + "VALUES (?,?,?,?)";
      sqlCon.query(sql, data, (err, result, fields) => {
         if (err) throw err;
         connection.release();
      });
      res.redirect('thanks')
   });

  
});

// Passport method that auto clear session and log you out.
// Requires method-override package
// Coded by Chi. Login Test.
app.delete('/logout', (req, res) => {
   req.logOut()
   res.redirect('login')
});

// Use to protect pages that un-authenticated should not access (i.e. Profile, User's Setting, etc)
// Coded by Chi. Login Test.
function checkAuthenticated (req, res, next) {
   if(req.isAuthenticated()) {
      return next();
   }
   res.redirect('login');
}

// Use to protect pages that authenticated should not access (i.e. login page)
// Coded by Chi. Login Test.
function checkNotAuthenticated (req, res, next) {
   if (req.isAuthenticated()) {
      return res.redirect('/');
   }
   next();
}

// Coded by Chi.
app.use((req, res, next) => {
   res.status(404).redirect('404');
});

let server = app.listen(8001, () => {
   const host = server.address().address;
   const port = server.address().port;

   console.log("Server is listening on port 8000. Ready to accept requests\n" +
      "Host Address: " + host + "\nPort: " + port);
});