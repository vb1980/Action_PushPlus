module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(794);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 191:
/***/ (function(module) {

module.exports = require("querystring");

/***/ }),

/***/ 605:
/***/ (function(module) {

module.exports = require("http");

/***/ }),

/***/ 794:
/***/ (function(__unusedmodule, __unusedexports, __webpack_require__) {

const querystring = __webpack_require__(191);
const core = __webpack_require__(961);
const http = __webpack_require__(605);

function Post(data, host, headers) {
    const opt = {
        method: 'POST',
        headers: headers,
        rejectUnauthorized: false,
        timeout: 30000
    };

    let requestCallback = (resolve)=>{
        return (result)=>{
            const encoding = result.headers['content-encoding'];
            if( encoding === 'undefined'){
                result.setEncoding('utf-8');
            }
            let chunks = '';
            result.on('data', function(chunk) {
                    try {
                    chunks+=(chunk);
                    } catch(e) {
                    console.log(e);
                    }
                    }).on('end', function(){
                        if (chunks !== undefined && chunks != null) {
                        resolve(chunks);
                        } else {
                        // 请求获取不到返回值
                        resolve(opt.host+"无返回值ERROR");
                        }
                        })
        }};
    return new Promise((resolve, reject) => {
            let cb = requestCallback(resolve);
            const req = http.request(host, opt, cb);
            req.on('error', function (e) {
                    // request请求失败
                    console.log(opt.host+'请求失败: ' + e.message);
                    reject("0");
                    });
            req.write(data);
            req.end();
    });
}


async function run() {
    try { 
        let postData = querystring.stringify({
            token: core.getInput('token',{ required: true }),
            title: core.getInput('title'),
            content: core.getInput('content',{ required: true }),
            template: core.getInput('template')
            });

        //let SCKEY = core.getInput('SCKEY',{ required: true });
        return Post(postData,`http://pushplus.hxtrip.com/send`, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
        },'http');
    } 
    catch (error) {
        console.log(error);
    }
}
run();


/***/ }),

/***/ 961:
/***/ (function(module) {

module.exports = eval("require")("@actions/core");


/***/ })

/******/ });