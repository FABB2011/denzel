const imdb = require('./imdb');
const denzel_washington = 'nm0000243';
const metascore = 70;
const fs = require('fs');
var express = require("express");
var bodyParser = require("body-parser");
const data = require('./movies');
const app = express();
const port = 9292;
const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://FABB:11021102@cluster0-07fid.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// return a random number between 0 and max
function random_int(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// return the movies of the array list_movie that have a metascore greater than the one defined by the user
function limit_metascore(list_movie, metascore){
  let movie_array = []
  for (let i = 0; i < list_movie.length; i++) {
      if (list_movie[i]["metascore"] >= metascore) {
          movie_array.push(list_movie[i]);
      }
  }
  return movie_array
}

// return only the first values defined by the user
function limit_list(list_movie, limit){
  let movie_array = []
  if (limit == undefined){
      return list_movie
  }
  else{
      for (let i = 0; i < limit; i++) {
          movie_array.push(list_movie[i]);
      }   
      return movie_array
  }
}



// extract all the films of a specified actor and make a JSON file with the extracted data
async function start (actor) { 
  try {
    const movies = await imdb(actor);
    console.log(JSON.stringify(movies, null, 2));
    fs.writeFileSync('denzel_washington_films.json', JSON.stringify(movies) );
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
//start(denzel_washington)

// insert films of a specified actor in a mongodb atlas database
async function insert (actor) {
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
//insert(denzel_washington)

// Display all movies
app.get('/', (req, res) => {
  client.connect(err => {
  const collection = client.db("movies").collection("denzel");
  collection.find().toArray((err, items) => {
    if (err) throw err;
    res.json(items);
    //client.close();
  });
});
});

// Fetch a random must-watch movie
app.get('/movies', (req, res) => {
  client.connect(err => {
  const collection = client.db("movies").collection("denzel");
  const metascore = 70
  const limit = 1
  collection.find({metascore:{$gte:metascore}}).toArray(function(err, items){
    if (err) throw err;
    rand_number = random_int(items.length)
    res.json(items[rand_number]);
    //client.close();
  });
});
});

// Fetch a specific movie
app.get('/movies/:id', (req, res) => {
  client.connect(err => {
  const collection = client.db("movies").collection("denzel");
  const id = req.params['id']
  collection.find({id:id}).toArray(function(err, items){
    if (err) throw err;
    res.json(items);
    //client.close();
  });
});
});

// Fetch a random must-watch movie
app.get('/movies/search', (req, res) => {
  client.connect(err => {
  const collection = client.db("movies").collection("denzel");
  const limit = parseInt(req.query.limit);
  const metascore = parseInt(req.query.metascore);
  console.log(limit)
  console.log(metascore)
  collection.find({metascore:{$gte:metascore}}).toArray(function(err, items){
    if (err) throw err;
    rand_number = random_int(items.length)
    res.json(items[rand_number]);
    //client.close();
  });
});
});

// Search for Denzel's movies
app.get('/movies/search/:metascore?/:limit?', (req, res) => {
  const metascore = parseInt(req.params.metascore);
  const limit = parseInt(req.params.limit);
  client.connect(err => {
  const collection = client.db("movies").collection("denzel");
  collection.find({metascore:{$gte:metascore}}).limit(limit).toArray(function(err, items){
    if (err) throw err;
    res.json(items);
    //client.close();
  });

});
});



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

//add_review()



app.post('/movies/:id',async(request,response)=>{
  const id = request.params.id;
  const review = request.body['review'];
  add_review(id, review)
  response.send("rien")



});



app.listen(port);

