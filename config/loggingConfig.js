const SimpleNodeLogger = require('simple-node-logger'),
    opts = {
        logFilePath:'trendingApps.log',
        timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
    },
logger = SimpleNodeLogger.createSimpleLogger( opts );
module.exports = logger;