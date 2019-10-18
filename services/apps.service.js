var AppModel = require('../models/apps.model');

exports.createApp = async function(appDetails){

	var NewApp = new AppModel({
		name : appDetails.name
	});

	try{
		var savedApp = await NewApp.save();
		return savedApp;
	}catch(e)
	{
		throw Error("exception saving app"); 
	}
}

exports.getApps = async function()
{
	const results = await AppModel.find({});
  	console.log(results);
	return results;
}