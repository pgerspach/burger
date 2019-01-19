const orm = require("../config/orm.js");

const burger = {
    create: function(valArr, cb) {
      orm.insertOne("burgers", ['burger_name', 'devoured'],valArr,function(res) {
        cb(res);
      });
    },
    // The variables cols and vals are arrays.
    all: function(cb) {
      orm.selectAll("burgers",function(res) {
        cb(res);
      });
    },
    update: function(id, objColVals, cb) {
      console.log("HERE!: "+id);
      console.log(objColVals);

      let condition = {
        id:id
      };
      orm.updateOne("burgers", objColVals, condition, function(res) {
        cb(res);
      });
    }
  };
  
  // Export the database functions for the controller (catsController.js).
  module.exports = burger;