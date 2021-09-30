const Hapi = require('@hapi/hapi');
const {
    nanoid
} = require('nanoid');
const books = [];

const init = async () => {

    const server = Hapi.server({
        port: 5000,
        host: 'localhost'
    });

    await server.start();

    server.route([{
            method: 'POST',
            path: '/books',
            handler: (request, h) => {
                const bookId = nanoid(16);

                const {
                    name = null,
                        year = null,
                        author = null,
                        summary = null,
                        publisher = null,
                        pageCount = null,
                        readPage = null,
                        reading = null,
                } = request.payload;

                const insertedAt = new Date().toISOString();
                const updatedAt = insertedAt;

                const newBook = {
                    id: bookId,
                    name,
                    year,
                    author,
                    summary,
                    publisher,
                    pageCount,
                    readPage,
                    finished: (pageCount === readPage) ? true : false,
                    reading,
                    insertedAt,
                    updatedAt
                }

                if (name === null || name.length <= 0) {
                    return h.response({
                        status: "fail",
                        message: "Gagal menambahkan buku. Mohon isi nama buku"
                    }).type('application/json').code(400);
                } else if (readPage > pageCount) {
                    return h.response({
                        status: "fail",
                        message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
                    }).type('application/json').code(400);
                } else {

                    books.push(newBook);

                    const isSuccess = books.filter((book) => book.id === bookId).length > 0;

                    if (isSuccess) {
                        return h.response({
                            status: "success",
                            message: "Buku berhasil ditambahkan",
                            data: {
                                bookId
                            }
                        }).type('application/json').code(201);
                    } else {
                        return h.response({
                            status: "error",
                            message: "Buku gagal ditambahkan"
                        }).code(500);
                    }
                }
            }
        }, //end
        {
            method: 'GET',
            path: '/books',
            handler: (request, h) => {
                return h.response({
                    "status": "success",
                    "data": {
                        "books": [{
                            "id": "Qbax5Oy7L8WKf74l",
                            "name": "Buku A",
                            "publisher": "Dicoding Indonesia"
                        }]
                    }
                }).type('application/json').code(200);
            }
        },
        {
            method: 'GET',
            path: '/books/{bookId}',
            handler: (request, h) => {
                books.push({
                    "id": "aWZBUW3JN_VBE-9I",
                    "name": "Buku A Revisi",
                    "year": 2011,
                    "author": "Jane Doe",
                    "summary": "Lorem Dolor sit Amet",
                    "publisher": "Dicoding",
                    "pageCount": 200,
                    "readPage": 26,
                    "finished": false,
                    "reading": false,
                    "insertedAt": "2021-03-05T06:14:28.930Z",
                    "updatedAt": "2021-03-05T06:14:30.718Z"
                });

                const {
                    bookId
                } = request.params;

                const book = books.find((book) => {
                    return (book.id === bookId);
                });

                if (book) {
                    return h.response({
                        "status": "success",
                        "data": {
                            "book": book,
                        }
                    }).type('application/json').code(200);
                } else {
                    return h.response({
                        "status": "fail",
                        "message": "Buku tidak ditemukan"
                    }).type('application/json').code(404);
                }
            }
        }, //end
        {
            method: 'PUT',
            path: '/books/{bookId}',
            handler: (request, h) => {
                books.push({
                    "id": "aWZBUW3JN_VBE-9I",
                    "name": "Buku A Revisi",
                    "year": 2011,
                    "author": "Jane Doe",
                    "summary": "Lorem Dolor sit Amet",
                    "publisher": "Dicoding",
                    "pageCount": 200,
                    "readPage": 26,
                    "finished": false,
                    "reading": false,
                    "insertedAt": "2021-03-05T06:14:28.930Z",
                    "updatedAt": "2021-03-05T06:14:30.718Z"
                });

                const {
                    bookId
                } = request.params;

                const {
                    name = null,
                        year = null,
                        author = null,
                        summary = null,
                        publisher = null,
                        pageCount = null,
                        readPage = null,
                        reading = null,
                        insertedAt = null,
                } = request.payload;

                const book = books.find((book) => {
                    return (book.id === bookId);
                });

                if (name == null) {
                    return h.response({
                        "status": "fail",
                        "message": "Gagal memperbarui buku. Mohon isi nama buku"
                    }).type('application/json').code(400);
                } else if (readPage > pageCount) {
                    return h.response({
                        "status": "fail",
                        "message": "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
                    }).type('application/json').code(400);
                } else if (!book) {
                    return h.response({
                        "status": "fail",
                        "message": "Gagal memperbarui buku. Id tidak ditemukan"
                    }).type('application/json').code(404);
                }

                const index = books.findIndex((book) => book.id === bookId);

                if (index !== -1) {
                    books[index] = {
                        ...books[index],
                        id: bookId,
                        name,
                        year,
                        author,
                        summary,
                        publisher,
                        pageCount,
                        readPage,
                        finished: (readPage === pageCount) ? true : false,
                        reading,
                        insertedAt,
                        updatedAt: new Date().toISOString(),
                    }
                }

                return h.response({
                    "status": "success",
                    "message": "Buku berhasil diperbarui"
                }).type('application/json').code(200);

            }
        }
    ]);

    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();