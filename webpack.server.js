var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
var path = require('path');
var devServer = {
    host: 'localhost',
    port: 8080
};

new WebpackDevServer(webpack(config), {
    // proxy: {
    //   '/manager': {
    //     target: 'http://localhost:30080',
    //     secure: false
    //   },
    //   '/filestorage': {
    //     target: 'http://192.168.14.205:12088/',
    //     secure: false
    //   }
    // }
    contentBase: path.join(__dirname, 'public'),
    hot: false,
    quiet: true,
    noInfo: false,
    stats: {
        colors: true
    }
}).listen(devServer.port, devServer.host, function(err, result) {
    if (err) {
        console.log(err);
    }
    console.log('Listening at ' + devServer.host + ':' + devServer.port);
});