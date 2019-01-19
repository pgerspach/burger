const connection = require("../config/connection.js");

// Helper function for SQL syntax.
// Let's say we want to pass 3 values into the mySQL query.
// In order to write the query, we need 3 question marks.
// The above helper function loops through and creates an array of question marks - ["?", "?", "?"] - and turns it into a string.
// ["?", "?", "?"].toString() => "?,?,?";
function printQuestionMarks(num, double) {
  var arr = [];

  for (var i = 0; i < num; i++) {
    if (double) {
      arr.push("??");
    } else {
      arr.push("?");
    }
  }

  return arr.toString();
}

// Helper function to convert object key/value pairs to SQL syntax
function objToSql(ob) {
  var arr = [];

  // loop through the keys and push the key/value as a string int arr
  for (var key in ob) {
    var value = ob[key];
    // check to skip hidden properties
    if (Object.hasOwnProperty.call(ob, key)) {
      // if string with spaces, add quotations (Lana Del Grey => 'Lana Del Grey')
      if (typeof value === "string" && value.indexOf(" ") >= 0) {
        value = "'" + value + "'";
      }
      // e.g. {name: 'Lana Del Grey'} => ["name='Lana Del Grey'"]
      // e.g. {sleepy: true} => ["sleepy=true"]
      arr.push(key + "=" + value);
    }
  }

  // translate array of strings to a single comma-separated string
  return arr.toString();
}

// Object for all our SQL statement functions.
const orm = {
  selectAll: function(tableInput, cb) {
    var queryString = "SELECT * FROM ??";
    connection.query(queryString, tableInput, function(err, result) {
      if (err) {
        throw err;
      }
      cb(result);
    });
  },
  insertOne: function(table, cols, vals, cb) {
    var queryString = "INSERT INTO ??";

    queryString += " (";
    queryString += printQuestionMarks(vals.length, true);
    queryString += ") ";
    queryString += "VALUES (";
    queryString += printQuestionMarks(vals.length, false);
    queryString += ") ";

    console.log(queryString);
    console.log([table].concat(cols).concat(vals))
    connection.query(
      queryString,
      [table].concat(cols).concat(vals),
      function(err, result) {
        if (err) {
          throw err;
        }

        cb(result);
      }
    );
  },
  // An example of objColVals would be {name: panther, sleepy: true}
  updateOne: function(table, objColVals, condition, cb) {
    var queryString = "UPDATE " + "??";

    queryString += " SET ";
    queryString += "?";
    queryString += " WHERE ";
    queryString += "?";

    let condProp = Object.keys(condition)[0];
    let condVal = condition[condProp];

    console.log(queryString);
    connection.query(
      queryString,
      [table, objColVals, condition],
      function(err, result) {
        if (err) {
          throw err;
        }

        cb(result);
      }
    );
  }
};

// Export the orm object for the model (cat.js).
module.exports = orm;
