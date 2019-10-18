var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')

var appSchema = new mongoose.Schema({
	name : String
});

appSchema.plugin(mongoosePaginate);
const appModel = mongoose.model('AppModel',appSchema);
module.exports = appModel;