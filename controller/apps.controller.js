var appsService = require('../services/apps.service');

exports.createApp = async function(req,res,next)
{
	var newApp = {
		name : "PUBG"
	};

	try{
		var createdApp = appsService.createApp(newApp);
		return res.status(201).json({status: 201, data: createdApp, message: "Succesfully Created an app"})
	}catch(e)
	{
		return res.status(400).json({status: 400, message: "App Creation was Unsuccesfull"})
	}
}

exports.getApps = async function(req,res,next)
{
	try{
		var apps = await appsService.getApps();
		return res.status(200).json({status: 201, data: apps, message: "Apps fetched Succesfully"})
	}catch(e)
	{
		throw Error("Exception fetching apps from DB");
	}
	
}