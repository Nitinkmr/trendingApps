var express = require('express')
var router = express.Router()

var appController = require('../controller/apps.controller')

router.post('/',appController.createApp);
router.get('/',appController.getApps);
router.get('/scrape',appController.scrapeApps);
router.delete('/',appController.deleteApps);
router.get('/:package',appController.getApp);
module.exports = router;
