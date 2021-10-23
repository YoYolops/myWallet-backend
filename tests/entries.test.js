import app from '../src/index';
import supertest from 'supertest';
import connection from '../src/database/database';

describe("POST /entries", () => {
    beforeAll(async () => {
        await connection.query('DELETE FROM entries;')
        await connection.query('INSERT INTO users (name, email, password) VALUES (yoyo, yoyo@gmail.com, yoyo);')
    })

    it("register entry POST /entries", async () => {
        
    })
})