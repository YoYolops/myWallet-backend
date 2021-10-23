import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

import connection from '../database/database.js';
import { userSchema, loginSchema } from '../schemas.js';

async function auth(req, res) {
    if(loginSchema.validate(req.body).error) return res.sendStatus(422)
    const { email, password } = req.body;
    try {
        const dbResponse = await connection.query('SELECT * FROM users WHERE email = $1;', [email])
        if(!dbResponse.rows.length) return res.sendStatus(404);

        const user = dbResponse.rows[0]
        if(!bcrypt.compareSync(password, user.password)) return res.sendStatus(403);
        delete user.password
        
        const isUserAlreadyLogged = await connection.query(
            `SELECT * FROM sessions WHERE "userId" = ${user.id};`
        )

        if(isUserAlreadyLogged.rows.length) return res.sendStatus(400);

        const token = uuid()
        await connection.query(
            'INSERT INTO sessions (token, "userId")  VALUES ($1, $2);',
            [ token, Number(user.id) ]
        )
            
        delete user.id
        return res.status(200).send({
            ...user,
            token
        })
    } catch(e) {
        console.log("Error POST /auth")
        console.log(e)
        return res.sendStatus(500)
    }
}

async function register(req, res) {
    if(userSchema.validate(req.body).error) return res.sendStatus(422)

    try {
        const hashPassword = bcrypt.hash(req.body.password, 10)
        const isEmailAlreadyRegistered = connection.query(
            'SELECT * FROM users WHERE email = $1;',
            [req.body.email]
        )
    
        const [ resHashPassword, resIsEmailAlreadyRegistered ] = await Promise.all([
            hashPassword,
            isEmailAlreadyRegistered
        ])
        if(resIsEmailAlreadyRegistered.rows.length) return res.sendStatus(409)
    
        await connection.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3);',
            [ req.body.name, req.body.email, resHashPassword ]
        )
    
        return res.sendStatus(201)

    } catch(e) {
        console.log("Error GET /auth")
        console.log(e)
        return res.sendStatus(500)
    }
}

async function logout(req, res) {
    /* Adaptation needed so it can use Utis function for token validation */
    const token = await Utils.validateAuthorization(req.headers.authorization)
    if(!token.isValid) return res.sendStatus(token.statusCode)

    try {
        const dbResponse = await connection.query('DELETE FROM sessions WHERE token = $1;', [ token ])
        if(!dbResponse.rowCount) return res.sendStatus(405)

        return res.sendStatus(200)
    } catch(e) {
        console.log("Error GET /logout")
        console.log(e)
        return res.sendStatus(500)
    }
}

export {
    auth,
    register,
    logout
}