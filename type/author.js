export const typeDef = `
  extend type Query {
    author(id: Int!): Author
  }  
  
  type Author {
    id: Int!
    name: String!
    books: [Book]
  }
`;

var books = [
    { id: 1, name: 'Để thối heo, bạn là kẻ bất tài', authorId: 1 },
    { id: 2, name: 'Dấu hiệu nhận biết kẻ cầm tứ quý', authorId: 2 },
    { id: 3, name: 'Bí kíp nặn ra heo đỏ', authorId: 3 },
    { id: 4, name: 'Cách ẩn mình khi nắm giữ ba đôi thông', authorId: 1 },
    { id: 5, name: 'Khi nào thì nên chặt 2', authorId: 2 },
];

var authors = [
    { id: 1, name: 'Trần Lương' },
    { id: 2, name: 'Phương Anh' },
    { id: 3, name: 'Công Hoan' }
];

export const resolvers = {
    Query: {
        author: (obj, args, context, info) => {
            var id = args.id;
            return authors.find(author => author.id === id)
        },
    },
    Author: {
        books(parent) {
            return books.filter(book =>
                parent.id === book.authorId
            );
        },
    },
};