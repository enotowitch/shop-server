import mongoose from "mongoose"

const prodSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			// required: true, // todo
			unique: true
		},
		// categories
		cats: {
			type: String,
			// required: true // todo
		},
		text: {
			type: String,
			// required: true, // todo
		},
		imgUrl: {
			type: String,
			// required: true // todo
		},
		price: {
			type: String,
			// required: true // todo
		}
	},
	{
		timestamps: true
	})

export default mongoose.model("Prod", prodSchema)