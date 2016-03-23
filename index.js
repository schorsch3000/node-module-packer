'use strict';
var fs = require('fs-extra');
var shellescape = require('shell-escape');
require('shelljs/global');
var filter = require('./filter.js')
var glob = require('glob-fs')({gitignore: true});
var path = require('path');
var sanitize = require("sanitize-filename");


var config = fs.readJsonSync('config.json');
fs.mkdirsSync(config.tempPath);
config.tempPath = fs.realpathSync(config.tempPath);
fs.mkdirsSync(config.outputPath);
config.outputPath = fs.realpathSync(config.outputPath);
fs.ensureFileSync(config.indexFile.path)
config.indexFile.path = fs.realpathSync(config.indexFile.path)

/*
for (var packageName in config.packages) {
    var packageData = config.packages[packageName];
    var packageCheckoutDir = config.tempPath + '/' + packageName;
    if (fs.existsSync(packageCheckoutDir)) {
        process.chdir(packageCheckoutDir);
        exec(shellescape(['git', 'reset', '--hard']))
        exec(shellescape(['git', 'checkout', 'master']))
        exec(shellescape(['git', 'pull']))
    } else {
        exec(shellescape(['git', 'clone', packageData.url, packageCheckoutDir]))
        process.chdir(packageCheckoutDir);

    }

    var sanitizeList = function (input) {
        return input.split("* ").join('')
    }


    var tags = exec("git tag");
    tags = tags.output.split("\n").map(sanitizeList);
    tags.pop();



    tags = filter.tag(packageData.tags, tags)

    var branches = exec("git branch -a | grep -v \"*\" | grep -v HEAD | sed 's#remotes/origin/##'  | sed 's/^..//'");
    branches = branches.output.split("\n").map(sanitizeList);
    branches.pop();

    branches = filter.branch(packageData.branches, branches)

    var packager = function (versions, packageName, repack, prefix) {
        prefix = prefix || ''
        repack = !!repack;
        versions.forEach(function (version) {
            console.log(packageName, version, "begin");
            var bundleName = packageName + '-' + prefix + version + '.tgz'
            var bundleDir = config.outputPath + '/' + packageName;
            fs.mkdirsSync(bundleDir)
            var bundlePath = bundleDir + '/' + sanitize(bundleName, {replacement: '_'});
            if (!fs.existsSync(bundlePath) || repack) {
                exec(shellescape(['git', 'checkout', version]))


                exec(shellescape(['tar', '-czf', bundlePath,  '--exclude=.git', '.']))

            } else {
                console.log('skipping, already there and should not be repacked')
            }
            var commitTime=exec('git log -1 --pretty=format:%ct')
            commitTime=parseInt(commitTime.output)
            fs.utimesSync(bundlePath,commitTime,commitTime)
            console.log(packageName, version, "end\n");
        })
    }


    packager(tags, packageName)
    packager(branches, packageName, true, 'dev-')
}
*/
process.chdir(config.outputPath);
config.distributionFiles = {}
glob.readdirSync('**/*.tgz').forEach(function (item) {
    var file={}
    file.stat=fs.statSync(item)
    item = item.split('/');
    if (!config.distributionFiles[item[0]]) {
        config.distributionFiles[item[0]] = []
    }

    file.name=item[1]
    config.distributionFiles[item[0]].push(file);
})


for(var i in config.distributionFiles){
    var list=config.distributionFiles[i];
    list.sort(function(a,b){
        return b.stat.mtime - a.stat.mtime;
    })
}

require('./indexFile.js')(config)
