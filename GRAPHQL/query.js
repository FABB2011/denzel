const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList} = require('graphql');
const _ = require('lodash');
const {movieType} = require('./types.js');
let {movies} = require('./movies.js');

// return a random number between 0 and max
function random_int(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

// return a random movie among those with a metascore greater than 70
function random_movie(list_movie){
    let must_watch = []
    for (let i = 0; i < list_movie.length; i++) {
        if (list[i]["metascore"] > 70) {
            must_watch.push(list_movie[i]);
        }
    }
    rand_number = random_int(must_watch.length)
    return must_watch[rand_number]
}

// return the movies of the array list_movie that have a metascore greater than the one defined by the user
function limit_metascore(list_movie, metascore){
    let movie_array = []
    for (let i = 0; i < list_movie.length; i++) {
        if (movies[i]["metascore"] >= metascore) {
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

const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {

        // display all movies
        movies: {
            type: new GraphQLList(movieType),
            resolve: (parent, args) => movies,
        },

        // display a random must-watch movie
        random_must_watch: {
           type: movieType,
           resolve: (parent, args) => random_movie(movies),
        },

        // search a movie by his id
        movie_id: {
            type: movieType,
            args: {
                id: { type: GraphQLString }
            },
            resolve: function (source, args) {
                return _.find(movies, { id: args.id });
            }
        },

        // search in function of metascore with a limit
        movie_search: {
            type: new GraphQLList(movieType),
            args: {
                metascore: { type: GraphQLInt },
                limit: { type: GraphQLInt }
            },
            //resolve: (parent, args) => limit_metascore(movies, metascore),
            resolve: (parent, args) => limit_list(limit_metascore(movies, args.metascore), args.limit),
        },
    }
});

exports.queryType = queryType;  
