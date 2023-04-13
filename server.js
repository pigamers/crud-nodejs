const express = require("express"); //express package initiated
const app = express(); // express instance has been created and will be access by app variable
const cors = require("cors");
const dotenv = require("dotenv");
var bodyParser = require("body-parser");
const connection = require("./config/db.js");

dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));

//reading the form
app.get("/", (req, res) => {
  res.redirect("/index.html");
});


//create
app.post("/create", (req, res) => {
  console.log(req.body.name);
  var name = req.body.name;
  var fatherName = req.body.fatherName;
  var motherName = req.body.motherName;
  var email = req.body.email;
  var contact = req.body.contact;
  try {
    connection.query(
      "INSERT into empinfo (name,fatherName,motherName,email,contact) values(?,?,?,?,?)", 
      [name, fatherName, motherName, email, contact],
      function (err, result) {
        if (err) {
          console.log(err);
        } else {
          // res.json({ result });
          res.redirect("/data");  
        }
      }
    );
  } catch (err) {
    res.send(err);
  }
});

//read operation which will be passing value to ejs engine
app.get("/data", (req, res) => {
    const allData = "select * from empinfo";
    connection.query(allData, (err, rows) => {
      if (err) {
        res.send(err);
      } else {
        // res.json({ rows });
        res.render("read.ejs", { rows });  // redering read.ejs file along with data
      }
    });
  });

//delete
app.get("/delete-data", (req, res) => {
    const deleteData = "delete from empinfo where id=?";
    connection.query(deleteData, [req.query.id], (err, rows) => {
      if (err) {
        res.send(err);
      } else {
        res.redirect("/data");
      }
    });
});

//passing data to update page
app.get("/update-data", (req, res) => {
    const updateData = "select * from  empinfo where id=?";
    connection.query(updateData, req.query.id, (err, eachRow) => {
      if (err) {
        res.send(err);
      } else {
        console.log(eachRow[0]);
        result = JSON.parse(JSON.stringify(eachRow[0]));  //in case if it dint work 
        res.render("edit.ejs", { data: eachRow[0] });
      }
    });
});

//final update
app.post("/final-update", (req, res) => {
    const id_data = req.body.hidden_id;
    const name_data = req.body.name;
    const fatherName_data = req.body.fatherName;
    const motherName_data = req.body.motherName;
    const email_data = req.body.email;
    const contact_data = req.body.contact;
  
    console.log("id...", req.body.name, id_data);
  
    const updateQuery = "update empinfo set name=?, fatherName=?, motherName=?, email=?, contact=? where id=?";
  
    connection.query(
      updateQuery,
      [name_data, fatherName_data, motherName_data, email_data, contact_data, id_data],
      (err, rows) => {
        if (err) {
          res.send(err);
        } else {
          res.redirect("/data");
        }
      }
    );
  });


app.listen(process.env.PORT || 3000, function (err) {
  if (err) console.log(err);
  console.log(`listening to port ${process.env.PORT}`);
});