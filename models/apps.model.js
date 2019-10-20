var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')

var appSchema = new mongoose.Schema({
	name : String,
	imgUrl : String,
	package : String,
	devName : String,
	screenShotUrls : []
});

appSchema.plugin(mongoosePaginate);
const appModel = mongoose.model('AppModel',appSchema);
module.exports = appModel;