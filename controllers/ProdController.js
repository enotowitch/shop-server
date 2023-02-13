import ProdModel from "../models/Prod.js"

export const addProd = async (req, res) => {
	const doc = await new ProdModel({
		...req.body
	})
	// todo
	const prod = await doc.save()
	console.log(prod)
	res.json(prod)
}

export const getAllProd = async (req, res) => {
	const prods = await ProdModel.find()
	// todo
	console.log(prods)
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

	const prods = await ProdModel.find({ [field]: { $regex: searchValue, $options: 'i' } })

	// todo

	console.log(prods)
	res.json(prods)
}