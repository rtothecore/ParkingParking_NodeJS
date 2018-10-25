var mongoose = require("mongoose")
var Schema = mongoose.Schema

var LeaveUserSchema = new Schema({
	name: String,
	email: String,	
	phone_no: String,
	car_no: String,
	car_type: String,
	leave_date: String
})

var LeaveUser = mongoose.model("LeaveUser", LeaveUserSchema)
module.exports = LeaveUser