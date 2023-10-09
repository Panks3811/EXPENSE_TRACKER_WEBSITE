const express = require('express');
const app = express();

var mysql=require('mysql');
var bodyParser=require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


app.set('view engine','ejs');

// create connection with mysql
var conn=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root123",
    database:"expense_tracker"
})

conn.connect(function(err){
    if(err) throw err;
    console.log("connection successful")
})
//  ROUTE 1 :  Define a route
app.get('/', function (req, res) {

  res.render('insert');

});

// // ROUTE 2 :  to insert the values in the database and also in table 

  app.post('/insert', function(req, res){
    var expenseName = req.body.expense_name;
    var amount = req.body.amount;
    var date = req.body.date;

    var sql = `INSERT INTO expenses (expense_name, amount, date) VALUES ('${expenseName}', ${amount}, '${date}')`;

    conn.query(sql, function(err, results){
        if(err) throw err;

        res.send('<h1>Expense Data Sent....</h1>');
    });
});


// // ROUTE 3 :  to show the data in the table with new route
app.get('/show', function(req, res){
  var sql = "SELECT * FROM expenses";

  conn.query(sql, function(err, results){
      if(err) throw err;

      res.render('show', { expenses: results });
  });
});



// ROUTE 4 : to delete the data from table

app.get('/delete/:id', function(req, res){
  var id = req.params.id;

  var sql = `DELETE FROM expenses WHERE id = ${id}`;

  conn.query(sql, function(err, results){
      if (err) throw err;
      
      res.redirect('/show');
  });
});

 // ROUTE 5 : to edit the user details in the table and also in databse
app.get('/edit/:id', function(req, res){
  var id = req.params.id;

  var sql = `SELECT * FROM expenses WHERE id = ${id}`;

  conn.query(sql, function(err, results){
      if (err) throw err;
      res.render('edit', { expense: results[0] });
  });
});


// // ROUTE 6 : to update the values of users data 
app.post('/update/:id', function(req, res){
  var id = req.params.id;
  var expenseName = req.body.expense_name;
  var amount = req.body.amount;
  var date = req.body.date;

  var sql = `UPDATE expenses SET expense_name = '${expenseName}', amount = ${amount}, date = '${date}' WHERE id = ${id}`;

  conn.query(sql, function(err, results){
      if (err) throw err;
      res.redirect('/show');
  });
});

// Start the server
var server =app.listen(4000,function(){
  console.log("Server started on server 4000 ");
})

