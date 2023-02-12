import express from "express"
import config from "config"
import mongoose from "mongoose"
import cors from "cors"

import * as UserController from "./controllers/UserController.js"
import * as ProdController from "./controllers/ProdController.js"
import { auth } from "./middleware/auth.js"

mongoose.connect("mongodb+srv://enotowitch:qwerty123@cluster0.9tnodta.mongodb.net/dbNameHere?retryWrites=true&w=majority")
	.then(console.log("DB OK")).catch(err => console.log("DB ERR", err))

// ! use
const app = express()
app.use(express.json())
app.use(cors())

const PORT = config.get("port")
app.listen(PORT, (err) => err ? console.log("SERVER ERR", err) : console.log(`SERVER OK, PORT: ${PORT}`))

// !! routes
// ! user
app.post("/register", UserController.register)
app.post("/login", UserController.login)
app.post("/auth/:token", UserController.auth)

app.patch("/user/liked", auth, UserController.liked)
app.patch("/user/carted", auth, UserController.carted)
// ! prod
app.post("/prod", ProdController.addProd)
app.get("/prod", ProdController.getAllProd)
app.post("/prod/:id", ProdController.getOneProd)