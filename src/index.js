'use strict';

const express = require('express');
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

//SQL server connection configuration
var config = {
  server: 'sql1',
  authentication: {
      type: 'default',
      options: {
          userName: 'sa',
          password: 'TestDB@home2'
      }
  },
  options: {
      database: 'testDB',
      rowCollectionOnRequestCompletion: true  //Tells tedious to return the array of results on the request callback
  }
}

var connection

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello world!\n');
});

app.get('/sqlserver', (req, res) => {
  try {
    connection = new Connection(config);
    connection.on('connect', function(err) {
      if (err)
      {
        console.log(new Date().toUTCString() + ' : Database connection failed to database : ' + config.options.database);
      }
      else
      {
          console.log(new Date().toUTCString() + ' : Database connected : ' + this.config.server + '.' + this.config.options.database + ' Status : ' + this.state.name);
          executeStatement(res);
          //res.send('Hello my world!\n');
      }
    })
  }
  catch  (ex)
  {
    console.log(new Date().toUTCString() + ' : ' + 'Error: ' + ex.message);
    res.status(500);
    res.send(ex.message);
  }
  }
);

  function executeStatement(res) {
    //prepare the reqes to the DB and provide the callback function
    var request = new Request("select * from test FOR JSON PATH", function(err, rowCount, rows) {
      if (err) {
        console.log(err);
      } else {
        //REturn data on the response to the server.
        //rows contains the values as well as metadata all wrapped in two arrays for some reason,
        // we just want the values returned
        console.log(rowCount + ' rows');
		    let values = rows[0][0].value;
    	res.send(values);
      }
    });
    //Loop through the columns of the resultf from the DB and print to the console
    request.on('row', function(columns) {
      columns.forEach(function(column) {
        console.log(column.value);
      });
    });
    //execute the actual DB request
    connection.execSql(request);
  }

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
