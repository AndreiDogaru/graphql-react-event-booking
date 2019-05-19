const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Event, User } = require('./models');

const app = express();

app.use(bodyParser.json());

const user = userId => User.findById(userId)
  .then(res => ({
    ...res._doc,
    createdEvents: events.bind(this, res._doc.createdEvents),
  })).catch((err) => { throw err; });

const events = eventIds => Event.find({ _id: { $in: eventIds } })
  .then(res => res.map(event => ({
    ...event._doc,
    creator: user.bind(this, event._doc.creator),
  }))).catch((err) => { throw err; });

app.use('/graphql', graphqlHttp({
  schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
      creator: User!
    }

    type User {
      _id: ID!
      email: String!
      password: String
      createdEvents: [Event!]
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input UserInput {
      email: String!
      password: String!
    }

    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput!): Event
      createUser(userInput: UserInput!): User
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    events: () => Event.find()
      .then(res => res.map(event => ({
        ...event._doc,
        creator: user.bind(this, event._doc.creator),
      }))).catch((err) => { throw err; }),

    createEvent: (args) => {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: '5ce14cf33cdde3686009b212',
      });
      return event.save()
        .then(async (res) => {
          const existingUser = await User.findById('5ce14cf33cdde3686009b212');
          if (!existingUser) { throw new Error('User does not exist'); }
          existingUser.createdEvents.push(res);
          await existingUser.save();

          return { ...res._doc, creator: user.bind(this, res.creator) };
        })
        .catch((err) => { throw err; });
    },

    createUser: async (args) => {
      let existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) { throw new Error('Email already in use'); }

      const hashedPass = await bcrypt.hash(args.userInput.password, 12);
      existingUser = new User({
        email: args.userInput.email,
        password: hashedPass,
      });
      return existingUser.save()
        .then(res => ({ ...res._doc }))
        .catch((err) => { throw err; });
    },
  },
  graphiql: true,
}));

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${
    process.env.MONGO_PASSWORD
  }@cluster0-rdqrn.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`,
  { useNewUrlParser: true },
)
  .then(() => { app.listen(3000); })
  .catch((err) => { console.error(err); });
