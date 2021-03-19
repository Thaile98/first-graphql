import DataLoader from "dataloader";
import {string} from "yup";

export const typeDef = `
  extend type Query {
    book(id: Int!): Book
    books: [Book]
  }  

  type Book {
    id: Int!
    name: String!
    authorId: Int!
    author: Author
  }
`;

var authors = [
    { id: 1, name: 'Trần Lương' },
    { id: 2, name: 'Phương Anh' },
    { id: 3, name: 'Công Hoan' }
];

var books = [
    { id: 1, name: 'Để thối heo, bạn là kẻ bất tài', authorId: 1 },
    { id: 2, name: 'Dấu hiệu nhận biết kẻ cầm tứ quý', authorId: 2 },
    { id: 3, name: 'Bí kíp nặn ra heo đỏ', authorId: 3 },
    { id: 4, name: 'Cách ẩn mình khi nắm giữ ba đôi thông', authorId: 1 },
    { id: 5, name: 'Khi nào thì nên chặt 2', authorId: 2 },
];

export const resolvers = {
    Query: {
        book: (obj, args, context, info) => {
            var id = args.id;
            return books.find(book => book.id === id)
        },
        books: (obj, args, context, info) => {
            return books;
        },
    },
    Book: {
        author: parent => {
            console.log(1);
            return authors.find(({ id }) => parent.authorId === id);
        }
    },
    // Book: {
    //     author: ({ authorId }, args, context, info) => {
    //         const authorDataLoader = AuthorDataLoader.getInstance(context);
    //
    //         return authorDataLoader.load(authorId);
    //     }
    // },
};