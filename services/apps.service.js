var request = require('request');
var cheerio = require('cheerio');
var stopWords = require('stopword')
var AppModel = require('../models/apps.model');
var logger = require('../config/loggingConfig');
var constants = require('../util/Constants');

exports.createApp = async function(appDetails){

	var package = appDetails.package;
	var app =  await module.exports.getApp(package);
	if( app.length > 0)
	{
		console.log("App already exists " + package);
		return ;
	}	
	var newApp = new AppModel({
		name : appDetails.name,
		imgUrl : appDetails.imgUrl,
		package : appDetails.package,
		devName : appDetails.devName,
		screenShotUrls: appDetails.screenShotUrls
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
		await request(url,function(error,response,html){
			if(!error)
			{
				var appDetails = []
				var content = cheerio.load(html);
				var apps = content('.WsMG1c');
				var imgs = content('.ZYyTud');
				var packages = content('.poRVub');
				var devNames = content('.mnKHRc');

				for(var index in apps)
				{
					var title;
					var imgUrl;
					var packageName;
					var devName;
					if(index != null && apps[index]!= null && apps[index].attribs != null && apps[index].attribs.title != null)		
						title = apps[index].attribs.title;

					var span = imgs[index].children;

					if( span != null && span.length >= 1 && span[0] != null && span[0]['children'] != null )
					{
						var imgTag = span[0]['children'][0];
						if(imgTag !=- null && imgTag['attribs'] != null && imgTag['attribs']['data-src'] != null)
							imgUrl = imgTag['attribs']['data-src'];
					}

					var anchor = packages[index];
					if(anchor != null && anchor['attribs'] != null && anchor['attribs']['href']!=null)
					{
						packageName = anchor['attribs']['href'];
						packageName = packageName.split("=")[1];		
					}
					if(devNames[index]['children'] != null 
						&& devNames[index]['children'].length > 0
						&& devNames[index]['children'][0] != null
						&& devNames[index]['children'][0]['children'] != null
						&& devNames[index]['children'][0]['children'].length > 0)
					{
						devName = devNames[index]['children'][0]['children'][0]['data'];
					}
					
					if(!appCache.has(title))
					{
						var data = {
							name : title,
							imgUrl : imgUrl,
							package : packageName,
							devName : devName
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
var scrapeScreenShots =  async function(app)
{
	
	var url = "https://play.google.com/store/apps/details?id=" + app.package;
	var ssList = [];
	 request(url, function(error,response,html){
		var content = cheerio.load(html);
		var appDetail = content('.DYfLw');
	
		for(var index in appDetail)
		{
			if(appDetail[index]['attribs'] != null
				&& appDetail[index]['attribs']['src'] != null)
			{
				var screenShotUrl = appDetail[index]['attribs']['src'];
				if(screenShotUrl.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g))
				{
					console.log(screenShotUrl);
					ssList.push(screenShotUrl);
				}			
			}
			
		}
		app.screenShotUrls = ssList;
		module.exports.createApp(app);
		console.log("scraping done" + app.name + app.screenShotUrls);
		return ssList;
	});


}

exports.deleteAllApps = function()
{
	AppModel.deleteMany({},function(obj){
		console.log(obj);
	});
}

var storeApps =  async function(appDetails){
	for(app in appDetails)
	{
		scrapeScreenShots(appDetails[app]);			
	}
	return true;
};

