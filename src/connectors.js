const Sequelize = require('sequelize');
const casual = require('casual');
const _ = require('lodash');
const Mongoose = require('mongoose');
const fetch = require('node-fetch');

const db = new Sequelize('blog', 'root', 'root', {
  dialect: 'mysql',
  host: 'localhost'
});

const AuthorModel = db.define('author', {
  firstName: { type: Sequelize.STRING },
  lastName: { type: Sequelize.STRING }
});

const PostModel = db.define('post', {
  title: { type: Sequelize.STRING },
  text: { type: Sequelize.STRING }
});

AuthorModel.hasMany(PostModel);
PostModel.belongsTo(AuthorModel);

// create mock data with a seed, so we always get the same
casual.seed(123);
db.sync({ force: true }).then(() => {
  _.times(10, () => AuthorModel.create({
    firstName: casual.first_name,
    lastName: casual.last_name
  }).then(author => author.createPost({
    title: `A post by ${author.firstName}`,
    text: casual.sentences(3)
  })));
});

const Author = db.models.author;
const Post = db.models.post;

// somewhere in the middle:
Mongoose.connect('mongodb://localhost/views');

const ViewSchema = Mongoose.Schema({
  postId: Number,
  views: Number
});

const View = Mongoose.model('views', ViewSchema);

// modify the mock data creation to also create some views:
casual.seed(123);
db.sync({ force: true }).then(() => {
  _.times(10, () => AuthorModel.create({
    firstName: casual.first_name,
    lastName: casual.last_name
  }).then(author => author.createPost({
    title: `A post by ${author.firstName}`,
    text: casual.sentences(3)
  }).then(post => // <- the new part starts here
    // create some View mocks
    View.update(
      { postId: post.id },
      { views: casual.integer(0, 100) },
      { upsert: true })
  )));
});

// add this somewhere in the middle
const FortuneCookie = {
  getOne() {
    return fetch('http://fortunecookieapi.herokuapp.com/v1/cookie')
      .then(res => res.json())
      .then(res => res[0].fortune.message);
  }
};

module.exports = { Author, Post, View, FortuneCookie };
