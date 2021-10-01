/**
 * Error Response for Handler
 * @param {*} h Hapi
 * @param {Number} statusCode Header status code 4xx
 * @param {String} message Error message
 * @param {String} type Content type
 * @param {String} charset Charset
 * @returns Hapi Response
 */
const errorResponse = (h, statusCode, message, type = 'application/json', charset = 'utf-8') => {
    return h.response({
        "status": "fail",
        "message": String(message)
    }).code(statusCode).type(type).charset(charset);
}

/**
 * Success Response for Handler
 * @param {*} h Hapi
 * @param {Number} statusCode Header status code 2xx
 * @param {Object} objectData Data body
 * @param {String} type Content type
 * @param {String} charset Charset
 * @returns Hapi Response
 */
const successResponse = (h, statusCode, objectData, type = 'application/json', charset = 'utf-8') => {
    return h.response(objectData).code(statusCode).type(type).charset(charset);
}

module.exports = {
    errorResponse,
    successResponse
};