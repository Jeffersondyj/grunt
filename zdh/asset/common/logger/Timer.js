define("common/logger/Timer",["require","exports","module"],function(){var e={},t={};return t.start=function(t){var n=+new Date;return t=t||"KEY"+n,e[t]=n,t},t.stop=function(t){if(e[t]){var n=+new Date,r=e[t];return e[t]=null,n-r}return-1},t});