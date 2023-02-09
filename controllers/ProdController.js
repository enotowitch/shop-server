import ProdModel from "../models/Prod.js"

export const add = async (req, res) => {
	const doc = await new ProdModel({
		...req.body
	})
	// todo
	const prod = await doc.save()
	console.log(prod)
	res.json(prod)
}

export const get = async (req, res) => {
	const prods = await ProdModel.find()
	// todo
	console.log(prods)
	res.json(prods)
}