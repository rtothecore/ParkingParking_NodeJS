var mongoose = require("mongoose")
var Schema = mongoose.Schema

var SmsAuthSchema = new Schema({
	phone_no: String,
	auth_code: String,	
	auth_date: String
})

var SmsAuth = mongoose.model("SmsAuth", SmsAuthSchema)
module.exports = SmsAuth