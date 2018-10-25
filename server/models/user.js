var mongoose = require("mongoose")
var Schema = mongoose.Schema

var UserSchema = new Schema({
	name: String,
	email: String,	
	password: String,
	phone_no: String,
	car_no: String,
	car_type: String,
	level: String,
	tmp_pw_date: String,
	join_date: String,
	mod_date: String,
	pw_date: String
})

var User = mongoose.model("User", UserSchema)
module.exports = User