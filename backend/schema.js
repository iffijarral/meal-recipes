// schema/schema.js
const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList } = require('graphql');
const Meal = require('./models/Meal');

const MealType = new GraphQLObjectType({
  name: 'Meal',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    category: { type: GraphQLString },
    ingredients: { type: new GraphQLList(GraphQLString) },
    tags: { type: new GraphQLList(GraphQLString) },
    area: { type: GraphQLString },
    youtubeLink: { type: GraphQLString },
    image: { type: GraphQLString },
    description: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    meal: {
      type: MealType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return Meal.findById(args.id);
      },
    },
    meals: {
      type: new GraphQLList(MealType),
      resolve() {
        return Meal.find({});
      },
    },
  },
});

// Mutation starts
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addMeal: {
      type: MealType,
      args: {
        name: { type: GraphQLString },
        category: { type: GraphQLString },
        ingredients: { type: new GraphQLList(GraphQLString) },
        tags: { type: new GraphQLList(GraphQLString) },
        area: { type: GraphQLString },
        youtubeLink: { type: GraphQLString },
        image: { type: GraphQLString },
        description: { type: GraphQLString },
      },
      resolve(parent, args) {
        const meal = new Meal(args);
        return meal.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
