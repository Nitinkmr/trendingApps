var request = require('request');
var cheerio = require('cheerio');

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

exports.scrapeApps = async function()
{
	var url = "https://play.google.com/store/apps/collection/topselling_free";
	console.log("URL IS " + url);
	request(url,function(error,response,html){
		if(!error)
		{
			var content = cheerio.load(html);
			var apps = content('.WsMG1c');
			for(var index in apps)
			{
				if(index != null && apps[index]!= null && apps[index].attribs != null && apps[index].attribs != null)
					console.log(apps[index].attribs.title);
			}

		}
	});
}