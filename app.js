const functions = require('./functions');
var express = require("express");
var bodyParser = require("body-parser");
const app = express();
const port = 9292;
const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://FABB:11021102@cluster0-07fid.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Populate the database
app.get('/movies/populate/:actor', async(request, response) => {
  const res = request.params.actor;
  await functions.insert_films(res);
  response.send("Database populated");
});

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
  collection.find({metascore:{$gte:metascore}}).toArray(function(err, items){
    if (err) throw err;
    rand_number = functions.random_int(items.length)
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

// Save a watched date and a review.
app.post('/movies/:id',async(request,response)=>{
  const id = request.params.id;
  const review = request.body['review'];
  functions.add_review(id, review)
  response.send("Review added")
});

app.listen(port);
