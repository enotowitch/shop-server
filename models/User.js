import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true
		},
		password: {
			type: String,
			required: true
		},
		liked: {
			type: Array,
			default: []
		},
		carted: {
			type: Array,
			default: []
		},
		ordered: {
			type: Array,
			default: []
		},
		viewed: {
			type: Array,
			default: []
		}
	},
	{
		timestamps: true
	}
)

export default mongoose.model("User", userSchema)