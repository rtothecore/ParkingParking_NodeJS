var mongoose = require("mongoose")
var Schema = mongoose.Schema

var ParkSpaceSchema = new Schema({
	small: String,
	mid: String,
	big: String,
	elec: String,
	hand: String
})

var TimeFeeDataSchema = new Schema({
	time: String,
	fee: String
})

var OpDataSchema = new Schema({
	start_time: String,
	end_time: String
})

var ParkingZoneDataSchema = new Schema({
	no: String,
	name: String,
	division: String,
	type: String,
	addr_road: String,
	addr_jibun: String,
	total_p: String,
	feed: String,
	buje: String,
	op_date: String,
	w_op: OpDataSchema,
	s_op: OpDataSchema,
	h_op: OpDataSchema,
	fee_info: String,
	park_base: TimeFeeDataSchema,
	add_term: TimeFeeDataSchema,
	one_day_park: TimeFeeDataSchema,
	month_fee: String,
	payment: String,
	remarks: String,
	manager: String,
	tel: String,
	lat: String,
	lng: String,
	data_date: String,
	homepage: String,
	park_space_count: ParkSpaceSchema,
	sale_info: String
})

var ParkingZoneData = mongoose.model("ParkingZoneData", ParkingZoneDataSchema)
module.exports = ParkingZoneData