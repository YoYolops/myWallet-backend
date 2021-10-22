import dayjs from 'dayjs';

import { entrieSchema } from '../schemas.js';
import connection from '../database/database.js';
import Utils from '../utils/utils.js';

async function registerEntrie(req, res) {
    const { description, value } = req.body;

    if(entrieSchema.validate(req.body).error) return res.sendStatus(422)

    try {
        let token = Utils.validateAuthorization(req.headers.authorization) //Returns a promise
    } catch(e) {
        console.log("Error POST /entries")
        console.log(e)
        return res.sendStatus(500)
    }
}