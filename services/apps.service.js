var request = require('request');
var cheerio = require('cheerio');

var AppModel = require('../models/apps.model');
var logger = require('../config/loggingConfig')

exports.createApp = async function(appDetails){

	var newApp = new AppModel({
		name : appDetails.name,
		imgUrl : appDetails.imgUrl
	});

	try{
		var savedApp = await newApp.save();
		return savedApp;
	}catch(e)
	{
		throw Error("exception saving app"); 
	}
}

exports.getApps =  async function()
{
	logger.info("Recieved getApps Request");
	const results = await AppModel.find({});
  	console.log(results);
	return results;
}

exports.scrapeApps = async function()
{
	try{
		var url = "https://play.google.com/store/apps/collection/topselling_free";
	
		request(url,function(error,response,html){
			if(!error)
			{
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
						
					var newApp = new AppModel({
						name : title,
						imgUrl : imgUrl
					});
					
					module.exports.createApp(newApp);
						
				}

			}
			
		});
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


