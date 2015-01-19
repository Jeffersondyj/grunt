define("common/utils/strings",["require"],function(){var e={};e.escapeHTML=function(e){return(""+e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},e.unescapeHTML=function(e){return(""+e).replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").replace(/&quot;/g,'"')},e.escapeQuote=function(e){return e.replace(/'/g,"&#39;").replace(/"/g,"&quot;")};var t="string-hidden-span";e.getDisplayWidth=function(n,r){var i=e.escapeHTML(n);r=r||{};var o=$("#"+t);if(!o.length)o=$("<span>").attr("id",t),$("<div>").css({position:"absolute",left:"-10000px",top:"-10000px"}).append(o).appendTo(document.body);return o.attr("style","").css(r).html(i),o.width()},e.upperCaseFirstChar=function(e){return e.slice(0,1).toUpperCase()+e.slice(1)},e.stringify=function(e){if(window.JSON)return JSON.stringify(e);else return n(e)};var n=function(){function e(e){if(/["\\\x00-\x1f]/.test(e))e=e.replace(/["\\\x00-\x1f]/g,function(e){var t=o[e];if(t)return t;else return t=e.charCodeAt(),"\\u00"+Math.floor(t/16).toString(16)+(t%16).toString(16)});return'"'+e+'"'}function t(e){for(var t,r=["["],i=e.length,o=0;i>o;o++){var s=e[o];switch(typeof s){case"undefined":case"function":case"unknown":break;default:if(t)r.push(",");r.push(n(s)),t=1}}return r.push("]"),r.join("")}function r(e){return 10>e?"0"+e:e}function i(e){return'"'+e.getFullYear()+"-"+r(e.getMonth()+1)+"-"+r(e.getDate())+"T"+r(e.getHours())+":"+r(e.getMinutes())+":"+r(e.getSeconds())+'"'}var o={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"};return function(r){switch(typeof r){case"undefined":return"undefined";case"number":return isFinite(r)?String(r):"null";case"string":return e(r);case"boolean":return String(r);default:if(null===r)return"null";else if(r instanceof Array)return t(r);else if(r instanceof Date)return i(r);else{var o,s="{",a=[s],u=n;for(var l in r)if(r.hasOwnProperty(l)){var c=r[l];switch(typeof c){case"undefined":case"unknown":case"function":break;default:if(o)a.push(",");o=1,a.push(u(l)+":"+u(c))}}return a.push("}"),a.join("")}}}}();return e});