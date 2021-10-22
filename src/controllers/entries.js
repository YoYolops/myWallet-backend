import dayjs from 'dayjs';

import { entrieSchema } from '../schemas.js';
import connection from '../database/database.js';
import Utils from '../utils/utils.js';

async function registerEntry(req, res) {
    if(entrieSchema.validate(req.body).error) return res.sendStatus(422)
    const { description, value } = req.body;

    try {
        const token = await Utils.validateAuthorization(req.headers.authorization) //Returns a promise
        const date = dayjs().format('YYYY-MM-DD');

        if(!token.isValid) return res.sendStatus(token.statusCode);

        await connection.query(
            'INSERT INTO entries (id, date, description, value, "userId") VALUES ($1, $2, $3, $4);',
            [ date, description, value, token.userId ]
        )

        return res.sendStatus(201)
    } catch(e) {
        console.log("Error POST /entries")
        console.log(e)
        return res.sendStatus(500)
    }
}

async function getEntries(req, res) {
    try {
        const token = await Utils.validateAuthorization(req.headers.authorization);
        if(!token.isValid) return res.sendStatus(token.statusCode)

        const dbResponse = await connection.query(
            'SELECT * FROM entries WHERE "userId" = $1;',
            [ token.userId ]
        )
        const userResponse = dbResponse.rows.map(entry => {
            delete entry.userId
            return entry
        })
        return res.send(userResponse)
    } catch(e) {
        console.log("Error GET /entries")
        console.log(e)
        return res.sendStatus(500)
    }
}

async function deleteEntry(req, res) {
    const { id } = req.params
    if(!id || id.trim() === "" || !Number(id)) return res.sendStatus(400)
    
    try {
        const token = await Utils.validateAuthorization(req.headers.authorization)
        if(!token.isValid) return res.sendStatus(token.statusCode)

        const dbResponse = await connection.query(
            'DELETE FROM entries WHERE id = $1 AND "userId" = $2;',
            [ id, token.userId ]
        )

        if(!dbResponse.rowCount) return res.sendStatus(404)  
        return res.sendStatus(200)
    } catch(e) {
        console.log("Error DELETE /entries")
        console.log(e)
        return res.sendStatus(500)
    }
}

async function updateEntry(req, res) {
    const { id } = req.params
    if(!id || id.trim() === "" || !Number(id)) return res.sendStatus(400)
    if(entrieSchema.validate(req.body).error) return res.sendStatus(422)

    const { description, value } = req.body;
    try {
        const token = await Utils.validateAuthorization(req.headers.authorization)
        if(!token.isValid) return res.sendStatus(token.statusCode)

        const dbResponse = await connection.query(
            `UPDATE entries
             SET description = $1, value = $2
             WHERE id = $3 AND "userId" = $4;`,
            [ description, value, id, token.userId ]
        )

        if(!dbResponse.rowCount) return res.sendStatus(404)
        return res.sendStatus(200)
    } catch(e) {
        console.log("Error PUT /entries")
        console.log(e)
        return res.sendStatus(500)
    }
}

export {
    registerEntry,
    getEntries,
    deleteEntry,
    updateEntry
}