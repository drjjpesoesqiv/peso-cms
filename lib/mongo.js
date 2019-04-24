var mongodb = require('mongodb');

var mongo = {
  db: null,

  connect: function(url, database) {
    mongodb.connect(url, function(err, client) {
      mongo.db = client.db(database);
    });
  },

  get: function(clxn, limit, page) {
    var skip = (page - 1) * limit;
    return new Promise(function(resolve, reject) {
      mongo.db.collection(clxn).find().skip(skip).limit(limit).toArray(function(err, docs) {
        if (err)
          reject(err);
        resolve(docs);
      });
    });
  },

  getById: function(clxn, id) {
    return new Promise(function(resolve, reject) {
      mongo.db.collection(clxn).findOne({ _id: mongodb.ObjectId(id) }, function(err, doc) {
        resolve(doc);
      });
    });
  },

  getByTitle: function(clxn, title) {
    return new Promise(function(resolve, reject) {
      mongo.db.collection(clxn).findOne({ title: title }).then(doc => {
        resolve(doc);
      }).catch(err => {
        reject(err);
      });
    });
  },

  insert: function(clxn, query, data) {
    return new Promise(function(resolve, reject) {
      mongo.db.collection(clxn).updateOne(query, { $set: data }, { upsert: true }).then(result => {
        resolve(1);
      }).catch(err => {
        reject(err);
      });
    });
  }
}

module.exports = mongo;
