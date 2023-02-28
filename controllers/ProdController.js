import ProdModel from "../models/Prod.js"
import config from "config"
import fs from "fs"

export const addProd = async (req, res) => {
	const doc = await new ProdModel({
		...req.body
	})
	// todo
	const prod = await doc.save()
	// console.log(prod)
	res.json(prod)
}

export const getAllProd = async (req, res) => {
	const prods = await ProdModel.find()
	// todo
	// console.log(prods)
	res.json(prods)
}

export const getOneProd = async (req, res) => {
	const { id } = req.params
	// todo
	const prod = await ProdModel.findById(id)
	res.json(prod)
}

export const search = async (req, res) => {
	const searchValue = req.params.query.match(/(?:searchValue=)(.*?)(?:&)/)[1].trim()
	const field = req.params.query.match(/(?:field=)(.*?)(?:&)/)[1].trim()

	let prods
	const regExp = { $regex: searchValue, $options: 'i' }

	if (field === "text") {

		prods = await ProdModel.find(
			{ $or: [{ title: regExp }, { text: regExp }, { composition: regExp }] }
		)

	} else {
		prods = await ProdModel.find({ [field]: regExp })
	}

	// todo

	// console.log(prods)
	res.json(prods)
}

export const delProd = async (req, res) => {

	const { id } = req.params

	try {
		const prod = await ProdModel.findOneAndDelete({ _id: id })
		// !! not tested
		const img = prod?.imgUrl?.replace(config.get("baseUrl"), "")
		fs.unlinkSync(img)

		// todo

		// console.log(prod)
		res.json(prod)

	} catch (err) { console.log(err) }
}

export const updProd = async (req, res) => {

	const { id } = req.params

	try {
		const prod = await ProdModel.findOneAndUpdate({ _id: id }, { ...req.body })

		// todo

		// console.log(prod)
		res.json(prod)

	} catch (err) { console.log(err) }
}

export const recently = async (req, res) => {

	try {
		const prods = await ProdModel.find().sort({ createdAt: "desc" }) // todo LIMIT

		// todo

		// console.log(prods)
		res.json(prods)

	} catch (err) { console.log(err) }
}

export const filter = async (req, res) => {

	const { query } = req.params
	const row = query.match(/(.+)(?:&)/)[1] // e.g "price"
	const type = query.match(/(?:&)(.+)/)[1] // e.g "asc"

	try {
		const prods = await ProdModel.find().sort({ [row]: type })

		// console.log(prods)
		res.json(prods)

	} catch (err) { console.log(err) }
}