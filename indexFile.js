var jade = require('jade');
var fs = require('fs-extra');

module.exports = function (config) {
    var fn = jade.compileFile(__dirname + '/index.jade');

    var html = fn(config);
    fs.outputFileSync(config.indexFile.path,html)

}
