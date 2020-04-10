const imdb = require('./imdb');
const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://FABB:11021102@cluster0-07fid.mongodb.net/test?retryWrites=true&w=majority";

// return a random number between 0 and max
function random_int(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

// insert films of a specified actor in a mongodb atlas database
async function insert_films (actor) {
    let movies;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {      
        await client.connect();
        movies = await imdb(actor);
        await client.db("movies").collection("denzel").insertMany(movies);
    } 
      catch (e) {
      console.error(e);
      process.exit(1);  
    }
}

// insert a review in the review collection
function add_review(id, review){
    MongoClient.connect(uri, function(err, db) {
      var dbo = db.db("movies");
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0');
      var yyyy = today.getFullYear();
      today = dd + '/' + mm + '/' + yyyy;
  
      obj = [{id: id, date: today, review: review, }]
      dbo.collection("reviews").insertMany(obj, function(err, res) {
      });
    }); 
}

module.exports.random_int = random_int;
module.exports.insert_films = insert_films;
module.exports.add_review = add_review;
