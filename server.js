const https = require('https')
const httpProxy = require('http-proxy')
const fs = require('fs')
const config = require('./config.json')

var proxy = new httpProxy.createProxyServer({
  target: config.target
})

var options = {/*key, cert, ca*/}

Object.keys(config.ssl).forEach(function(keyName){
  var key = config.ssl[keyName]
  if(fs.existsSync(config.ssl[keyName])){
    key = fs.readFileSync(config.ssl[keyName])
  }
  options[keyName] = key
})

var server = https.createServer(options, function(req, res){
  proxy.web(req, res)
})

server.on('upgrade', function(req, socket, head){
  proxy.ws(req, socket, head);
})

server.listen(config.port||443)
