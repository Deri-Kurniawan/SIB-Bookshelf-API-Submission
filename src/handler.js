const {
    nanoid
} = require('nanoid');

const books = require('./books');

const errorResponse = (h, statusCode, message, type = 'application/json', charset = 'utf-8') => {
    return h.response({
        "status": "fail",
        "message": String(message)
    }).code(statusCode).type(type).charset(charset);
}

const successResponse = (h, statusCode, objectData, type = 'application/json', charset = 'utf-8') => {
    return h.response(objectData).code(statusCode).type(type).charset(charset);
}

const addBook = (request, h) => {
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
        return errorResponse(h, 400, "Gagal menambahkan buku. Mohon isi nama buku");
    } else if (readPage > pageCount) {
        return errorResponse(h, 400, "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount");
    } else {

        books.push(newBook);

        const isSuccess = books.filter((book) => book.id === bookId).length > 0;

        if (isSuccess) {
            return successResponse(h, 201, {
                status: "success",
                message: "Buku berhasil ditambahkan",
                data: {
                    bookId
                }
            });
        } else {
            return errorResponse(h, 500, "Buku gagal ditambahkan");
        }
    }
};

const getAllBook = (request, h) => {

    const {
        reading = null,
            finished = null,
            name = null,
    } = request.query;

    let allBooks = [];

    if (reading === null && finished === null && name === null) {
        allBooks = books;
        return successResponse(h, 200, {
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
        });
    } else if (reading !== null) {
        allBooks = books.filter((book) => Number(reading) === Number(book.reading));
    } else if (finished !== null) {
        allBooks = books.filter((book) => Number(finished) === Number(book.finished));
    } else if (name !== null) {
        allBooks = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    }

    return successResponse(h, 200, {
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
    });
};

const getBookDetailById = (request, h) => {

    const {
        bookId
    } = request.params;

    const book = books.find((book) => {
        return (book.id === bookId);
    });

    if (book) {
        return successResponse(h, 200, {
            "status": "success",
            "data": {
                "book": book,
            }
        });
    } else {
        return errorResponse(h, 404, "Buku tidak ditemukan");
    }
};

const updateBookById = (request, h) => {

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
        return errorResponse(h, 400, "Gagal memperbarui buku. Mohon isi nama buku");
    } else if (readPage > pageCount) {
        return errorResponse(h, 400, "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount");
    } else if (!book) {
        return errorResponse(h, 404, "Gagal memperbarui buku. Id tidak ditemukan");
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

    return successResponse(h, 200, {
        "status": "success",
        "message": "Buku berhasil diperbarui"
    });
};

const deleteBookById = (request, h) => {

    const {
        bookId
    } = request.params;

    const book = books.find((book) => {
        return (book.id === bookId);
    });

    if (!book) {
        return errorResponse(h, 404, "Buku gagal dihapus. Id tidak ditemukan");
    } else {
        const index = books.findIndex((book) => book.id === bookId);

        if (index !== -1) {
            books.splice(index, 1);

            return successResponse(h, 200, {
                "status": "success",
                "message": "Buku berhasil dihapus"
            });
        }

    }
};

module.exports = {
    addBook,
    getAllBook,
    getBookDetailById,
    updateBookById,
    deleteBookById,
}