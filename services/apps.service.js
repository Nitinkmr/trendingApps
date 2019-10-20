var request = require('request');
var cheerio = require('cheerio');
var stopWords = require('stopword')
var AppModel = require('../models/apps.model');
var logger = require('../config/loggingConfig');
var constants = require('../util/Constants');

exports.createApp = async function(appDetails){

	var package = stopWords.removeStopwords(appDetails.name.split(" "));
	package = package.join(".");
	package = constants.packagePrefix + package.toLowerCase();
	var app =  await module.exports.getApp(package);
	if( app.length > 0)
	{
		console.log("App already exists " + package);
		return ;
	}	
	var newApp = new AppModel({
		name : appDetails.name,
		imgUrl : appDetails.imgUrl,
		package : package
	});

	try{
		var savedApp = await newApp.save();
		return savedApp;
	}catch(e)
	{
		throw Error("exception saving app"); 
	}
}

exports.getApp = async function(package){
	logger.info("finding app by package " + package);
	var app = await AppModel.find({'package':package}).exec();
	return app;
}
exports.getApps =  async function()
{
	logger.info("Recieved getApps Request");
	const results = await AppModel.find({});
	return results;
}

exports.scrapeApps = async function()
{
	try{
		var url = "https://play.google.com/store/apps/collection/topselling_free";
		var appCache = new Map();
		request(url,function(error,response,html){
			if(!error)
			{
				var appDetails = []
				var content = cheerio.load(html);
				var apps = content('.WsMG1c');
				var imgs = content('.ZYyTud');

				for(var index in apps)
				{
					var title;
					var imgUrl;
					if(index != null && apps[index]!= null && apps[index].attribs != null && apps[index].attribs.title != null)		
						title = apps[index].attribs.title;

					var span = imgs[index].children;

					if( span != null && span.length >= 1 && span[0] != null && span[0]['children'] != null )
					{
						var imgTag = span[0]['children'][0];
						if(imgTag !=- null && imgTag['attribs'] != null && imgTag['attribs']['data-src'] != null)
							imgUrl = imgTag['attribs']['data-src'];
					}
					if(!appCache.has(title))
					{
						var data = {
							name : title,
							imgUrl : imgUrl
							};						
						appDetails.push(data);
						appCache.set(title,data)
					}
				}
			}		
			return storeApps(appDetails);	
		})
		
	}catch(e)
	{

		
	}	
}

exports.deleteAllApps = function()
{
	AppModel.deleteMany({},function(obj){
		console.log(obj);
	});
}

var storeApps = function(appDetails){
	for(app in appDetails)
	{
		module.exports.createApp(appDetails[app]);	
	}
	return true;
	};