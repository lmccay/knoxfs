// var request = require('request').defaults({jar: true});
var request = require('request');
var fs = require('fs');

function HDFSRequest(knoxUrl, cluster, user, pwd) {
  this.knoxUrl=knoxUrl;
  this.cluster=cluster;
  this.user = user;
  this.pwd = pwd;
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" // Avoids DEPTH_ZERO_SELF_SIGNED_CERT error for self-signed certs
}
function get(options,callback) {
  // console.log(JSON.stringify(arguments));

  var options = options || {};
  var operation = options.op || ""; 
  var path = options.path || "/tmp";
  var version = options.version || "v1";
  url = this.knoxUrl + '/' + this.cluster + '/webhdfs/' + version + path + '?op=' + operation;
  // console.log('url: ' + url);
  request(url, callback).auth(this.user, this.pwd, true);
}
function put(options,callback) {
  console.log(JSON.stringify(arguments));

  var options = options || {};
  var operation = options.op || "";
  var path = options.path || "/tmp";
  var version = options.version || "v1";
  url = this.knoxUrl + '/' + this.cluster + '/webhdfs/' + version + path + '?op=' + operation;
  console.log('url: ' + url);
  request.put(url, callback).auth(this.user, this.pwd, true);
}
function post(options,callback) {
  console.log(JSON.stringify(arguments));

  var options = options || {};
  var operation = options.op || "";
  var path = options.path || "/tmp";
  var version = options.version || "v1";
  url = this.knoxUrl + '/' + this.cluster + '/webhdfs/' + version + path + '?op=' + operation;
  console.log('url: ' + url);
  request.post(url, callback).auth(this.user, this.pwd, true);
}
function remove(options,callback) {
  var options = options || {};
  var operation = options.op || "";
  var path = options.path || "/tmp";
  var version = options.version || "v1";
  url = this.knoxUrl + '/' + this.cluster + '/webhdfs/' + version + path + '?op=' + operation;
  console.log('url: ' + url);
  request.del(url, callback).auth(this.user, this.pwd, true);
}
function listStatus(options,callback) {
  // console.log(JSON.stringify(arguments));
  var options = options || {};
  options = mixin(options, {op: "LISTSTATUS"});
  this.get(options, callback);
}
function listFileStatus(options,callback) {
  // console.log(JSON.stringify(arguments));
  var options = options || {};
  options = mixin(options, {op: "GETFILESTATUS"});
  this.get(options, callback);
}
function checksum(options,callback) {
  // console.log(JSON.stringify(arguments));
  var options = options || {};
  options = mixin(options, {op: "GETFILECHECKSUM"});
  this.get(options, callback);
}
function open(options,callback) {
  console.log(JSON.stringify(arguments));
  var options = options || {};
  options = mixin(options, {op: "OPEN"});
  this.get(options, callback);
}
function mkdirs(options,callback) {
  console.log(JSON.stringify(arguments));
  var options = options || {};
  options = mixin(options, {op: "MKDIRS"});
  this.put(options, callback);
}
function mv(options,callback) {
  console.log(JSON.stringify(arguments));
  var options = options || {};
  options = mixin(options, {op: "RENAME"});
  var version = options.version || "v1";
  var operation = options.op || "";
  var path = options.path || "/tmp";
  var destination = options.destination || "";
  url = this.knoxUrl + '/' + this.cluster + '/webhdfs/' + version + '/' + path + '?op=' + operation + "&destination=" + destination;
  console.log('url: ' + url);
  request.put(url, callback).auth(this.user, this.pwd, true);
}
function chmod(options,callback) {
  console.log(JSON.stringify(arguments));
  var options = options || {};
  options = mixin(options, {op: "SETPERMISSION"});
  var version = options.version || "v1";
  var operation = options.op || "";
  var path = options.path || "/tmp";
  var permission = options.permission || "700";
  url = this.knoxUrl + '/' + this.cluster + '/webhdfs/' + version + '/' + path + '?op=' + operation + "&permission=" + permission;
  console.log('url: ' + url);
  request.put(url, callback).auth(this.user, this.pwd, true);
}
function chown(options,callback) {
  console.log(JSON.stringify(arguments));
  var options = options || {};
  options = mixin(options, {op: "SETOWNER"});
  var version = options.version || "v1";
  var operation = options.op || "";
  var path = options.path || "/tmp";
  var owner = options.owner || "guest";
  var ownergroup = owner.split(":");
  url = this.knoxUrl + '/' + this.cluster + '/webhdfs/' + version + path + '?op=' + operation + "&owner=" + ownergroup[0];
  if (ownergroup.length > 1) {
	url += "&group=" + ownergroup[1];
  }
  console.log('url: ' + url);
  request.put(url, callback).auth(this.user, this.pwd, true);
}
function rm(options,callback) {
  console.log(JSON.stringify(arguments));
  var options = options || {};
  options = mixin(options, {op: "DELETE"});
  this.remove(options, callback);
}
HDFSRequest.prototype.create = function create(localfile, options,callback) {
  console.log(JSON.stringify(arguments));
  var options = options || {};
  var operation = options.op || "CREATE";
  var path = options.path || "/tmp";
  var version = options.version || "v1";
  url = this.knoxUrl + '/' + this.cluster + '/webhdfs/' + version + '/' + path + '?op=' + operation;
  options = mixin(options, {uri: url, op: "CREATE", followRedirect: "false", jar: "true"});
  console.log('url: ' + url);
  // fs.createReadStream(localfile).pipe(request.put(url, callback).auth(this.user, this.pwd, true));

  // send http request
  request.put(options, function (error, response, body) {
    // forward request error
    if (error) return callback(error);
    // check for expected redirect
    if (response.statusCode == 307) {
        // generate query string
        options = mixin(options, {jar: "true", uri: response.headers.location, op: "CREATE", followRedirect: "false"});
        // send http request
        fs.createReadStream(localfile).pipe(request.put(response.headers.location, function (error, response, body) {
            // forward request error
            if (error) return callback(error);
            // check for expected created response
            if (response.statusCode == 201) {
                // execute callback
                return callback(null, response, response.headers.location);
            } else {
                return callback(new Error('expected http 201 created but received: ' + response.statusCode));   
            } 
       }).auth(this.user, this.pwd));
    } else {
        console.log(response.statusCode);
        return callback(new Error('expected redirect'));   
    }
  }.bind(this)).auth(this.user, this.pwd, true);
}
HDFSRequest.prototype.append = function append(localfile, options,callback) {
  console.log(JSON.stringify(arguments));
  var options = options || {};
  var operation = options.op || "APPEND";
  var path = options.path || "/tmp";
  var version = options.version || "v1";
  url = this.knoxUrl + '/' + this.cluster + '/webhdfs/' + version + '/' + path + '?op=' + operation;
  options = mixin(options, {uri: url, op: "APPEND", followRedirect: "false", jar: "true"});
  console.log('url: ' + url);
  // fs.createReadStream(localfile).pipe(request.put(url, callback).auth(this.user, this.pwd, true));

  // send http request
  request.post(options, function (error, response, body) {
    // forward request error
    if (error) return callback(error);
    // check for expected redirect
    if (response.statusCode == 307) {
        // generate query string
        options = mixin(options, {jar: "true", uri: response.headers.location, op: "APPEND", followRedirect: "false"});
        // send http request
        fs.createReadStream(localfile).pipe(request.post(response.headers.location, function (error, response, body) {
            // forward request error
            if (error) return callback(error);
            // check for expected created response
            if (response.statusCode == 200) {
                // execute callback
                return callback(null, response, response.body);
            } else {
                return callback(new Error('expected http 200 created but received: ' + response.statusCode));   
            } 
       }).auth(this.user, this.pwd));
    } else {
        console.log(response.statusCode);
        return callback(new Error('expected redirect'));   
    }
  }.bind(this)).auth(this.user, this.pwd, true);
}
function mixin(target, source) {
  source = source || {};
  Object.keys(source).forEach(function(key) {
    target[key] = source[key];
  });
  
  return target;
}

HDFSRequest.prototype.listStatus=listStatus;
HDFSRequest.prototype.listFileStatus=listFileStatus;
HDFSRequest.prototype.checksum=checksum;
HDFSRequest.prototype.open=open;
HDFSRequest.prototype.put=put;
HDFSRequest.prototype.get=get;
HDFSRequest.prototype.mv=mv;
HDFSRequest.prototype.chmod=chmod;
HDFSRequest.prototype.chown=chown;
HDFSRequest.prototype.remove=remove;
HDFSRequest.prototype.mkdirs=mkdirs;
// HDFSRequest.prototype.create=create;
HDFSRequest.prototype.rm=rm;
module.exports=HDFSRequest;
