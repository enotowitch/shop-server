import mongoose from "mongoose"

const prodSchema = new mongoose.Schema(
	{
		// ! MAIN
		title: {
			type: String,
			// required: true, // todo
			unique: true
		},
		weight: {
			type: Number,
			// required: true, // todo
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
			type: Number,
			// required: true // todo
		},
		// ? MAIN
		// ! SECONDARY
		compound: String,
		calories: Number,
		proteins: Number,
		fats: Number,
		carbohydrates: Number,
		expiration: Number,
		temperature: String,
		// ? SECONDARY
		// ! OTHER
		delivery: String,
		payment: String,
		warranty: String
		// ? OTHER
	},
	{
		timestamps: true
	})

export default mongoose.model("Prod", prodSchema)