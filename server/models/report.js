var mongoose = require("mongoose")
var Schema = mongoose.Schema

var ReportSchema = new Schema({
	code: String,
	report_date: String,	
	user_email: String,
	user_phone_no: String,
	parking_name: String,
	parking_lat: String,
	parking_lng: String,
	parking_tel: String,
	parking_fee_info: String,
	parking_etc_info: String,
	parking_pictureA: String,
	parking_pictureB: String,
	parking_pictureC: String,
	status: String,
	hold_reason: String
})

var Report = mongoose.model("Report", ReportSchema)
module.exports = Report