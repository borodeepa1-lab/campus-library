const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const db = require('./db');

const typeDefs = `#graphql
    type Author {
        id: ID!
        name: String!
        country: String!
        books: [Book!]!
    }

    type Book {
        id: ID!
        title: String!
        year: Int!
        author: Author!
    }

    type Query {
        authors: [Author!]!
        author(id: ID!): Author
        books: [Book!]!
    }

    type Mutation {
        addBook(title: String!, year: Int!, authorId: ID!): Book!
    }
`;

const resolvers = {
    Query: {
        authors: async () => {
            const [rows] = await db.query(
                'SELECT id, name, country FROM authors'
            );
            return rows;
        },

        author: async (_, { id }) => {
            const [rows] = await db.execute(
                'SELECT id, name, country FROM authors WHERE id = ?',
                [id]
            );
            return rows[0] || null;
        },

        books: async () => {
            const [rows] = await db.query(
                'SELECT id, title, year, author_id FROM books'
            );
            return rows;
        }
    },

    Author: {
        books: async (author) => {
            const [rows] = await db.execute(
                'SELECT id, title, year, author_id FROM books WHERE author_id = ?',
                [author.id]
            );
            return rows;
        }
    },

    Book: {
        author: async (book) => {
            const [rows] = await db.execute(
                'SELECT id, name, country FROM authors WHERE id = ?',
                [book.author_id]
            );
            return rows[0];
        }
    },

    Mutation: {
        addBook: async (_, { title, year, authorId }) => {
            const [result] = await db.execute(
                'INSERT INTO books (title, year, author_id) VALUES (?, ?, ?)',
                [title, year, authorId]
            );

            const [rows] = await db.execute(
                'SELECT id, title, year, author_id FROM books WHERE id = ?',
                [result.insertId]
            );

            return rows[0];
        }
    }
};

async function startServer() {
    const server = new ApolloServer({
        typeDefs,
        resolvers
    });

    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 }
    });

    console.log(`GraphQL API ready at ${url}`);
}

startServer().catch((error) => {
    console.error('Failed to start GraphQL server:', error);
    process.exit(1);
});