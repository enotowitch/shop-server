import jwt from "jsonwebtoken"
import config from "config"

const JWT = process.env.JWT || config.get("jwtKey")

export const auth = async (req, res, next) => {
	try {
		const token = req.headers.authorization
		const decoded = jwt.verify(token, JWT)
		// todo
		req.userId = decoded._id
		next()

	} catch (err) { console.log(err) }
}