const {
    addBook,
    getAllBook,
    getBookDetailById,
    updateBookById,
    deleteBookById,
} = require('./handler');

const routes = [{
        method: 'POST',
        path: '/books',
        handler: addBook
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllBook
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: getBookDetailById
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: updateBookById
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBookById
    }
];

module.exports = routes;