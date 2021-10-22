import { Router } from 'express';

import { auth, register, logout } from './controllers/auth.js'

const routes = Router();

routes.get("/logout", logout)
routes.post("/auth", auth)
routes.post("/register", register)

export default routes;