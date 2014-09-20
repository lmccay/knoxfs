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
function rm(options,callback) {
  console.log(JSON.stringify(arguments));
  var options = options || {};
  options = mixin(options, {op: "DELETE"});
  this.remove(options, callback);
}
function create(localfile, options,callback) {
  console.log(JSON.stringify(arguments));
  var options = options || {};
  options = mixin(options, {op: "CREATE", followAllRedirects: "true"});
  var operation = options.op || "";
  var path = options.path || "/tmp";
  var version = options.version || "v1";
  url = this.knoxUrl + '/' + this.cluster + '/webhdfs/' + version + path + '?op=' + operation;
  console.log('url: ' + url);

  fs.createReadStream(localfile).pipe(request.put(url, callback).auth(this.user, this.pwd, true));
  // fs.createReadStream('package.json').pipe(this.put(options, callback));
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
HDFSRequest.prototype.remove=remove;
HDFSRequest.prototype.mkdirs=mkdirs;
HDFSRequest.prototype.create=create;
HDFSRequest.prototype.rm=rm;
module.exports=HDFSRequest;
