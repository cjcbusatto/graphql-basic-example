const books = require('../datasources/books');
const authors = require('../datasources/authors');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLList,
} = require('graphql');

// Types
const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: 'This represents the author of an book',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    books: {
      type: new GraphQLList(BookType),
      resolve: author => {
        return books.filter(book => book.authorId === author.id);
      },
    },
  }),
});

const BookType = new GraphQLObjectType({
  name: 'Book',
  description: 'This represents a book written by an author',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: book => {
        return authors.find(author => book.authorId);
      },
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    book: {
      type: BookType,
      description: 'A single book',
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (_, args) => books.find(book => book.id === args.id),
    },
    books: {
      type: new GraphQLList(BookType),
      description: 'List of all books',
      resolve: () => books,
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: 'List of All Authors',
      resolve: () => authors,
    },
    author: {
      type: AuthorType,
      description: 'A single author',
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (_, args) => authors.find(author => author.id === args.id),
    },
  }),
});

// Mutations
const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields: () => ({
    addBook: {
      type: BookType,
      description: 'Add a book',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (_, args) => {
        const book = { id: books.length + 1, name: args.name, authorId: args.aurthorId };
        books.push(book);
        return book;
      },
    },
  }),
});

module.exports = { RootQueryType, RootMutationType };
