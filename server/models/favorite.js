var mongoose = require("mongoose")
var Schema = mongoose.Schema

var FavoriteSchema = new Schema({
	user_email: String,
	parking_no: String,	
	date: String	
})

var Favorite = mongoose.model("Favorite", FavoriteSchema)
module.exports = Favorite