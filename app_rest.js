var express = require("express");
var bodyParser = require("body-parser");
const data = require('./movies');
const app = express();
const port = 9292;
const {MongoClient} = require('mongodb');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

async function start (actor = DENZEL_IMDB_ID, metascore = METASCORE) { //modified version of sandbox.js that writes movies of an actor to a json file
  try {
    const movies = await imdb(actor);
    console.log(JSON.stringify(movies, null, 2));
	fs.writeFileSync('denzel_movies.json', JSON.stringify(movies) );
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}


async function main(){

  const uri = "mongodb+srv://FABB:11021102@cluster0-07fid.mongodb.net/test?retryWrites=true&w=majority";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {

      await client.connect();

      await  listDatabases(client);

  } catch (e) {
      console.error(e);
  } finally {
      await client.close();
  }
}

main().catch(console.error);

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

// Populate the database
app.get('/movies', (req, res) => {
  res.status(200).send({
    movies: data
  })
});

// Fetch a random must-watch movie
app.get('/movies/must_watch', (req, res) => {
  let must_watch = [];

  for (let i = 0; i < data.length; i++) {
    if (data[i]["metascore"] > 70) {
      must_watch.push(data[i]);
    }
  }
  rand_number = random_int(must_watch.length);
  res.status(200).send({movie: must_watch[rand_number],});
});

// Fetch a specific movie
app.get('/movies/:id', (req, res) => {  
    const id = req.params.id; 
    data.map((movie) => {  
        if (movie.id === id) {      
            return res.status(200).send({movie,})
            ;} 
        });
  return res.status(404).send({ success: 'false',   message: 'movie does not exist',  });
});

// Search for Denzel's movies
app.get('/movies/search/:limit?/:metascore?', (req, res) => {  
  const limit = req.params.limit;
  const metascore = req.params.metascore;

  limited_movies = limit_metascore(data, metascore);
  final_list = limit_list(limited_movies, limit)
  res.status(200).send({movie: final_list,});
  

});

// post a movie review (don't work)
app.post("/movies/:id", (request, response) => {      
  data.push({"id" : request.params.id} ,{'$set': {"data":request.body.date, "review":request.body.review}});
});

app.listen(port);
