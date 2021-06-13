const querystring = require('querystring');
const core = require('@actions/core');
const http = require('http');

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
