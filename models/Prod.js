import mongoose from "mongoose"

const prodSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			unique: true
		},
		// categories
		cats: {
			type: Array,
			required: true
		},
		text: {
			type: String,
			required: true,
		},
		imgUrl: {
			type: String,
			required: true
		},
		price: {
			type: String,
			required: true
		}
	},
	{
		timestamps: true
	})

export default mongoose.model("Prod", prodSchema)