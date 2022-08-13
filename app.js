const fs= require('fs');
var path = require("path");
const {parseString}= require('xml2js')
const Redis=require('redis')

const redisclient = Redis.createClient()
function convert(){
if(process.argv.length>4){
    console.log('invalid number of parameters')
    return 
}
var filename=process.argv[2]
if(process.argv[2]=='-v')
{
    filename=process.argv[3]
}

const xml= fs.readFileSync(filename).toString();

parseString(xml, function(err, data){

    
    redisclient.set('subdomains', JSON.stringify(data['config'].subdomains[0].subdomain))
    
    data['config'].cookies[0].cookie.forEach( (x)=>{

        let str='cookie:'+ x.$.name+':'+ x.$.host
        redisclient.set(str,x._)
    })
})
if(process.argv[2]=='-v'){
	redisclient.keys('*', (err, keys)=>{
    		keys.forEach( key =>{console.log(key)})
		})
	}
}
convert()
