import { Router } from 'express';

import { auth, register, logout } from './controllers/auth.js';
import {
    registerEntry,
    getEntries,
    deleteEntry,
    updateEntry
} from './controllers/entries.js';

const routes = Router();

routes.get("/logout", logout)
routes.get("/entries", getEntries)

routes.post("/auth", auth)
routes.post("/register", register)
routes.post("/entries", registerEntry)

routes.delete("/entries/:id", deleteEntry)

routes.put("/entries/:id", updateEntry)


export default routes;