import UserModel from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import config from "config"

function myError(err, res) {
	console.log(err)
	return res.status(501).json(err) // todo delete err to front on production
}

export const register = async (req, res) => {
	try {

		const pass = req.body.password
		const passwordHash = await bcrypt.hash(pass, 10)

		const doc = await new UserModel({
			email: req.body.email,
			password: passwordHash
		})

		const user = await doc.save()
		const { password, ...userData } = user._doc // * trim password
		const token = jwt.sign({ _id: user._id }, config.get("jwtKey"))

		res.json({ ...userData, token })

	} catch (err) {
		myError(err, res)
	}
}

export const login = async (req, res) => {
	try {

		const user = await UserModel.findOne({ email: req.body.email })
		if (!user) {
			myError(err, res)
		}

		const pass = req.body.password
		const isValidPass = await bcrypt.compare(pass, user._doc.password)
		if (!isValidPass) {
			myError(err, res)
		}

		const { password, ...userData } = user._doc // * trim password
		const token = jwt.sign({ _id: user._id }, config.get("jwtKey"))

		res.json({ ...userData, token })

	} catch (err) {
		myError(err, res)
	}
}

export const auth = async (req, res) => {
	try {
		const { token } = req.params
		const decoded = jwt.verify(token, config.get("jwtKey"))

		const user = await UserModel.findById(decoded._id)
		const { password, ...userData } = user._doc // * trim password

		res.json(userData)

	} catch (err) {
		myError(err, res)
	}
}