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
		const token = jwt.sign({ _id: user._id }, process.env.JWT)

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
		const token = jwt.sign({ _id: user._id }, process.env.JWT)

		res.json({ ...userData, token })

	} catch (err) {
		myError(err, res)
	}
}

export const auth = async (req, res) => {
	try {
		const { token } = req.params
		const decoded = jwt.verify(token, process.env.JWT)

		const user = await UserModel.findById(decoded._id)
		const { password, ...userData } = user._doc // * trim password

		res.json(userData)

	} catch (err) {
		myError(err, res)
	}
}

export const liked = async (req, res) => {

	const userId = req.userId
	const prodId = req.body._id

	try {
		const user = await UserModel.findById(userId)

		// ! like
		if (!user.liked.includes(prodId)) {
			await UserModel.findOneAndUpdate(
				{
					_id: userId
				},
				{
					"$push": { "liked": prodId }
				},
				(err) => {
					err && myError(err, res)

					res.json({
						success: true,
						msg: "liked"
					})
				}
			)
		} else {
			// ! dislike
			await UserModel.findOneAndUpdate(
				{
					_id: userId
				},
				{
					"$pull": { "liked": prodId }
				},
				(err) => {
					err && myError(err, res)

					res.json({
						success: true,
						msg: "disliked"
					})
				}
			)
		}

	} catch (err) { console.log(err) }
}

export const carted = async (req, res) => {

	const userId = req.userId
	const prodId = req.body._id
	const type = req.body.type // (def)one / many

	async function push() {
		try {
			await UserModel.findOneAndUpdate(
				{
					_id: userId
				},
				{
					"$push": { "carted": prodId }
				},
				(err) => {
					err && myError(err, res)

					res.json({
						success: true,
						msg: "carted"
					})
				}
			)
		} catch (err) { console.log(err) }
	}

	// !! carted type...
	// ! ...ONE
	if (type === "one") {
		try {
			const user = await UserModel.findById(userId)

			// ! (0 => 1) "carted"
			if (!user.carted.includes(prodId)) {

				push()

			} else {
				// ! (3 => 0) "discarted"
				await UserModel.findOneAndUpdate(
					{
						_id: userId
					},
					{
						"$pull": { "carted": prodId }
					},
					(err) => {
						err && myError(err, res)

						res.json({
							success: true,
							msg: "discarted"
						})
					}
				)
			}

		} catch (err) { console.log(err) }
	}
	// ? ...ONE
	// ! ...MANY
	if (type === "many+") {

		push()

	}
	// TODO
	if (type === "many-") {
		const find = await UserModel.find({ _id: userId })
		const userCarted = find[0].carted
		const withoutOne = userCarted.splice(userCarted.indexOf(prodId), 1)

		const done = await UserModel.findOneAndUpdate(
			{ _id: userId },
			{ $set: { "carted": userCarted } })

		console.log(done)
		res.json({
			success: true
		})
	}
	// ? ...MANY
	// ?? carted type ...
}

export const viewed = async (req, res) => {

	const { _id } = req.body
	const { userId } = req

	try {
		await UserModel.findOneAndUpdate({ _id: userId }, { $pull: { viewed: _id } }) // pull all dup prods
		const prods = await UserModel.findOneAndUpdate({ _id: userId }, { $push: { viewed: _id } }) // push prod to the end

		// todo

		console.log(prods)
		res.json(prods)

	} catch (err) { console.log(err) }
}