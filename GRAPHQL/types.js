const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLFloat,
} = require('graphql');

movieType = new GraphQLObjectType({
    name: 'Movie',
    fields: {
        link: { type: GraphQLString },
        id: { type: GraphQLString },
        metascore: { type: GraphQLInt },
        rating: { type: GraphQLFloat},
        synopsis: { type: GraphQLString },
        title: { type: GraphQLString },
        year: { type: GraphQLInt }
    }
});

exports.movieType = movieType;
