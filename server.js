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
                    finished: (pageCount === readPage),
                    reading,
                    insertedAt,
                    updatedAt
                };

                if (name === null || name.length <= 0) {
                    return h.response({
                        status: "fail",
                        message: "Gagal menambahkan buku. Mohon isi nama buku"
                    }).code(400).type('application/json').charset('utf-8');
                } else if (readPage > pageCount) {
                    return h.response({
                        status: "fail",
                        message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
                    }).code(400).type('application/json').charset('utf-8');
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
                        }).code(201).type('application/json').charset('utf-8');
                    } else {
                        return h.response({
                            status: "error",
                            message: "Buku gagal ditambahkan"
                        }).code(500).type('application/json').charset('utf-8');
                    }
                }
            }
        },
        {
            method: 'GET',
            path: '/books',
            handler: (request, h) => {

                const {
                    reading = null,
                        finished = null,
                        name = null,
                } = request.query;

                let allBooks = [];

                if (reading === null && finished === null && name === null) {
                    allBooks = books;
                    return h.response({
                        "status": "success",
                        "data": {
                            "books": allBooks.map(({
                                id,
                                name,
                                publisher,
                            }) => ({
                                id,
                                name,
                                publisher,
                            })),
                        }
                    }).code(200).type('application/json').charset('utf-8');
                } else if (reading !== null) {
                    allBooks = books.filter((book) => Number(reading) === Number(book.reading));
                } else if (finished !== null) {
                    allBooks = books.filter((book) => Number(finished) === Number(book.finished));
                } else if (name !== null) {
                    allBooks = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
                }

                return h.response({
                    "status": "success",
                    "data": {
                        "books": allBooks.map(({
                            id,
                            name,
                            publisher,
                        }) => ({
                            id,
                            name,
                            publisher,
                        })),
                    }
                }).code(200).type('application/json').charset('utf-8');

            }
        },
        {
            method: 'GET',
            path: '/books/{bookId}',
            handler: (request, h) => {

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
                    }).code(200).type('application/json').charset('utf-8');
                } else {
                    return h.response({
                        "status": "fail",
                        "message": "Buku tidak ditemukan"
                    }).code(404).type('application/json').charset('utf-8');
                }
            }
        },
        {
            method: 'PUT',
            path: '/books/{bookId}',
            handler: (request, h) => {

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
                    }).code(400).type('application/json').charset('utf-8');
                } else if (readPage > pageCount) {
                    return h.response({
                        "status": "fail",
                        "message": "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
                    }).code(400).type('application/json').charset('utf-8');
                } else if (!book) {
                    return h.response({
                        "status": "fail",
                        "message": "Gagal memperbarui buku. Id tidak ditemukan"
                    }).code(404).type('application/json').charset('utf-8');
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
                }).code(200).type('application/json').charset('utf-8');
            }
        },
        {
            method: 'DELETE',
            path: '/books/{bookId}',
            handler: (request, h) => {

                const {
                    bookId
                } = request.params;

                const book = books.find((book) => {
                    return (book.id === bookId);
                });

                if (!book) {
                    return h.response({
                        "status": "fail",
                        "message": "Buku gagal dihapus. Id tidak ditemukan"
                    }).code(404).type('application/json').charset('utf-8');
                } else {
                    const index = books.findIndex((book) => book.id === bookId);

                    if (index !== -1) {
                        books.splice(index, 1);

                        return h.response({
                            "status": "success",
                            "message": "Buku berhasil dihapus"
                        }).code(200).type('application/json').charset('utf-8');
                    }

                }
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