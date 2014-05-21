var config = {};
process.argv.forEach(function (val, index) {
    if (/^-(\w+):?(.*)?/.test(val)) {
        config[RegExp.$1] = RegExp.$2 === '' ? true : RegExp.$2;
    }
});

(function () {
    var sites = (config.site || 'nirvana').split(',');
    var SITE_PORT = parseInt(config.port || 9080, 10); // 端口起点
    var sitesPorts = {};
    var watchList = {
        _base: {
            files: ['Gruntfile.js', 'build.xml', 'asset/**'],
            tasks: ['build'],
            options: { spawn: false }
        }
    };
    sites.forEach(function (n, i) {
        watchList[n] = {
            files: [n + '/*', n + '/src/**', n + '/asset/**'],
            tasks: ['build:' + n],
            options: { spawn: false }
        };
        sitesPorts[n] = SITE_PORT + i;
    });
    config.sites = sites;
    config.sitesPorts = sitesPorts;
    config.watchList = watchList;
})();

module.exports = function (grunt) {
    var sites = config.sites;
    var sitesPorts = config.sitesPorts;
    var siteDir = 'output';
    var fm = require('util').format;
    var fs = require('fs');
    var path = require('path');
    var express = require('express');

    var deleteFolderRecursive = function (path) {
        var files = [];
        var self = arguments.callee;
        if (fs.existsSync(path)) {
            files = fs.readdirSync(path);
            files.forEach(function (file, index) {
                var curPath = path + "/" + file;
                if (fs.statSync(curPath).isDirectory()) { // recurse
                    self(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    };

    // Project configuration
    grunt.initConfig({
        watch: config.watchList
    });

    grunt.registerTask('build', 'build ant', function (site) {
        var changedSites = sites;
        if (site) changedSites = [site];
        var done = this.async();
        var len = changedSites.length;
        var method = config.local ? 'local' : 'debug';
        if (config.localRoot) {
            method += ' -Droot=' + config.localRoot;
        }
        console.log("[Build Start] %s total:%d  for %s", changedSites.join(','), len, method);
        
        changedSites.forEach(function (n) {
            var exec = require('child_process').exec;
            var pass = true;
            var cmd = fm('ant %s -Dsite=%s -DdebugLog=true -Dminimize=false', method, n);
            var ant = exec(cmd, function (error, stdout, stderr) {
                if (stderr) {
                    pass = false;
                    console.log('stderr: ' + stderr);
                    console.log('stdout: ' + stdout);
                }
                if (error !== null) {
                    pass = false;
                    console.log('exec error: ' + error);
                }
            });
            ant.on("exit", function () {
                console.log("[Build %s] %s", pass ? 'Success' : 'Fail', n);
                if (--len < 1) done(true);
            });
        });
    });

    grunt.registerTask('server', 'Starting web servers', function (live) {
        var done = this.async();
        // 独立运行server task进程不退出
        // grunt server:on

        //single server
        sites.forEach(function (site, nowIndex) {
            var server = {
                port: sitesPorts[site],
                root: path.join(__dirname, siteDir, site),
                dataRoot: path.join(__dirname, site, 'data')
            };
            var app = express();
            app.all('/data*', function (req, res, next) {
                res.sendfile(server.dataRoot + req.params[0]);
            });
            app.use(express.static(server.root));
            var lists = [
                {
                    action: '/upload/plan'
                },
                {
                    action: '/upload/unit', names: ['pic']
                }
            ];

            var middleWare = require('connect-multiparty')();
            lists.forEach(function (list) {
                app.post(list.action, middleWare, function (req, res) {
                    var uploadArr = [req.files[list.name || 'upload']];
                    if (!uploadArr[0]) {
                        var names = list.names;
                        var index = -1;
                        list.names.forEach(function (obj) {
                            if (typeof obj === 'string') {
                                uploadArr[++index] = req.files['upload_' + obj];
                            } else {
                                var prefix = 'upload_' + obj.name;
                                obj.suffix.forEach(function (suffix) {
                                    var str = prefix + '_' + suffix;
                                    if (suffix === '') str = prefix;
                                    uploadArr[++index] = req.files[str];
                                });
                            }
                        });
                    }
                    uploadArr.forEach(function (upload) {
                        if (!upload) return;
                        var fName = '' + new Date().getTime() + '-' + upload.name;
                        var newPath = path.join(server.root, "/asset/", fName);
                        fs.readFile(upload.path, function (err, data) {
                            fs.writeFile(newPath, data, function (err) {
                                if (err) console.error('upload failed', err);
                            });
                        });
                        res.set('Content-Type', 'text/html');
                        
                        res.send(
                            JSON.stringify({
                                model: {
                                    file: path.join('asset/', fName)
                                }
                            })
                        );
                    });
                });
            });

            app.all(/\.json/i, function (req, res, next) {
                res.sendfile(server.dataRoot + req.url.replace(/\.json.*/, '.js'));
            });
            app.listen(server.port, function () {
                console.log('server [%s], [http://127.0.0.1:%s], root [%s]',
                    site, server.port, server.root);
                if (nowIndex === sites.length - 1) done(true);
            });
        });
    });

    /**
     * er-sync task
     *
     * Usage:
     * $ grunt sync:gen
     */
    grunt.registerTask('sync', 'Starting er-sync', function () {
        var Sync = require('./deploy/er-sync.js').Sync;
        sites.forEach(function (n) {
            new Sync(n, __dirname);
        });
        deleteFolderRecursive(path.join(__dirname, siteDir));
    });

    /**
     * 默认启动时的执行顺序
     *
     * $ grunt
     */
    grunt.registerTask("default", ["sync", "build", "server", "watch"]);
    grunt.loadNpmTasks("grunt-contrib-watch");
};