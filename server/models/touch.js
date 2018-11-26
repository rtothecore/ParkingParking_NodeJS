var mongoose = require("mongoose")
var Schema = mongoose.Schema

var TouchSchema = new Schema({
	parking_no: String,
	touch_count: String,	
	last_touch_date: String	
})

var Touch = mongoose.model("Touch", TouchSchema)
module.exports = Touch