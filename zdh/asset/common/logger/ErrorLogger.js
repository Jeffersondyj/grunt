define("common/logger/ErrorLogger",["require","exports","module","common/logger/Logger"],function(require){var e=require("common/logger/Logger"),t="errorLog",n={};return n.LEVEL_INFO="info",n.LEVEL_WARNING="warning",n.LEVEL_ERROR="error",n.info=function(e,t,r){return n.log(e,n.LEVEL_INFO,t,r)},n.warning=function(e,t,r){return n.log(e,n.LEVEL_WARNING,t,r)},n.error=function(e,t,r){return n.log(e,n.LEVEL_ERROR,t,r)},n.log=function(n,r,i,o){var s=i||{};if(s.msg=n,s.level=r,o&&o.toString)s.exception=o.toString();return e.log(s,t,!0)},n});