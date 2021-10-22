import connection from '../database/database.js';

async function validateAuthorization(authorization) {
    if(!authorization) return {
        isValid: false,
        statusCode: 401
    }
    if(!authorization.includes("Bearer ")) return {
        isValid: false,
        statusCode: 422
    }
    const token = authorization.replace("Bearer ", "");

    if(token.trim() === "") return {
        isValid: false,
        statusCode: 422
    }

    const dbResponse = await connection.query('SELECT * FROM sessions WHERE token = $1', [token])
    const tokenIsActive = dbResponse.rows.length

    if(!tokenIsActive) return {
        isValid: false,
        statusCode: 401
    }

    return {
        isValid: true,
        token: token,
        userId: dbResponse.rows[0].userId
    }
}

const Utils = {
    validateAuthorization
}

export default Utils;