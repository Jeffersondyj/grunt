/**
 * 定义站点地图
 */
mf = typeof mf === 'undefined' ? {} : mf;
(function () {
    mf.MAP = {
        "index": {
            "user": {
                "account": {}
            },
            "help": {
                "help1": {},
                "help2": {}
            }
        },
        "user": {
            "add": {
                "plan": {},
                "unit": {},
				"keyword": {}
            },
            "user": {
                "account": {}
            }
        }
    };
})();

/**
 * 该文件同时被node读取，生成站点文件（/src/**）
 */
if (typeof exports !== 'undefined') {
    exports.MAP = mf.MAP;
}