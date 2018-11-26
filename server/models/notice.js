var mongoose = require("mongoose")
var Schema = mongoose.Schema

var NoticeSchema = new Schema({
	subject: String,
	contents: String,	
	date: String	
})

var Notice = mongoose.model("Notice", NoticeSchema)
module.exports = Notice