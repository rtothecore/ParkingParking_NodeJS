var mongoose = require("mongoose")
var Schema = mongoose.Schema

var JoinUserSchema = new Schema({
	email: String,
	join_date: String
})

var JoinUser = mongoose.model("JoinUser", JoinUserSchema)
module.exports = JoinUser