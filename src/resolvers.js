const { Author, View, FortuneCookie } = require('./connectors');

const resolvers = {
  Query: {
    author(_, args) {
      return Author.find({ where: args });
    },
    getFortuneCookie() {
      return FortuneCookie.getOne();
    }
  },
  Author: {
    posts(author) {
      return author.getPosts();
    }
  },
  Post: {
    author(post) {
      return post.getAuthor();
    },
    views(post) {
      return View.findOne({ postId: post.id })
        .then(view => view.views);
    }
  }
};

module.exports = resolvers;
