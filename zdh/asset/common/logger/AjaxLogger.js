define("common/logger/AjaxLogger",["require","exports","module","common/logger/Logger"],function(require){var e=require("common/logger/Logger"),t=1,n=[],r=[],i=1,o={};o.mark=function(e,r){var i=t++;return n[i]={path:e,classid:r.classid,time:(new Date).getTime()},i},o.log=function(e){var t=n[e];if(t&&t.classid)if(r.push([t.path,t.classid,(new Date).getTime()-t.time].join()),delete n[e],r.length>=i)return o.dump();else return void 0};var s="ajaxLog";return o.dump=function(){var t={ajaxRecord:r.join("|")},n=e.log(t,s,!0);return r=[],n},o});