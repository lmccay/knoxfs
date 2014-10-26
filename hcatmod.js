var request = require('request');
var fs = require('fs');

function HCatRequest(knoxUrl, cluster, user, pwd) {
  this.knoxUrl=knoxUrl;
  this.cluster=cluster;
  this.user = user;
  this.pwd = pwd;
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" // Avoids DEPTH_ZERO_SELF_SIGNED_CERT error for self-signed certs
}
function get(options,callback) {
  console.log(JSON.stringify(arguments));

  var options = options || {};
  var operation = options.op || ""; 
  var path = options.path || "/jobs";
  var version = options.version || "v1";
  var url = options.url || "";
  if (url == "") {
    url = this.knoxUrl + '/' + this.cluster + '/templeton/' + version + path;
  }
  console.log('url: ' + url);
  request(url, callback).auth(this.user, this.pwd, true);
}
function put(options,callback) {
  console.log(JSON.stringify(arguments));

  var options = options || {};
  var operation = options.op || "";
  var path = options.path || "/tmp";
  var version = options.version || "v1";
  url = this.knoxUrl + '/' + this.cluster + '/templeton/' + version + path;
  console.log('url: ' + url);
  request.put(url, callback).auth(this.user, this.pwd, true);
}
function post(options,callback) {
  console.log(JSON.stringify(arguments));

  var options = options || {};
  var operation = options.op || "";
  var path = options.path || "/tmp";
  var version = options.version || "v1";
  url = this.knoxUrl + '/' + this.cluster + '/templeton/' + version + path;
  console.log('url: ' + url);
  request.post(url, callback).auth(this.user, this.pwd, true);
}
function remove(options,callback) {
  var options = options || {};
  var operation = options.op || "";
  var path = options.path || "/jobs/job";
  var version = options.version || "v1";
  url = this.knoxUrl + '/' + this.cluster + '/templeton/' + version + path;
  console.log('url: ' + url);
  request.del(url, callback).auth(this.user, this.pwd, true);
}

function jobs(options,callback) {
  // console.log(JSON.stringify(arguments));
  var options = options || {};
  var showall = options.showall || "false";
  var version = options.version || "v1";
  url = this.knoxUrl + '/' + this.cluster + '/templeton/' + version + '/jobs' + '?showall=' + showall + "&fields=*";
  options = mixin(options, {url: url});
  this.get(options, callback);
}
function job(jobid,callback) {
  // console.log(JSON.stringify(arguments));
  var options = options || {path: '/jobs/' + jobid};
  this.get(options, callback);
}
//wordcount.jar -cp=transform.jar:someother.jar  org.myorg.WordCount wordcount/input wordcount/output
// % curl -s -d user.name=ctdean \
//        -d jar=wordcount.jar \
//        -d class=org.myorg.WordCount \
//        -d libjars=transform.jar \
//        -d arg=wordcount/input \
//        -d arg=wordcount/output \
//        'http://localhost:50111/templeton/v1/mapreduce/jar'
function jar(jarname, libjars, classname, options,callback) {
  var options = options || {};
  console.log("check the args: " + options);
  var version = options.version || "v1";
  var classFile = options.classFile || "";
  var libjars = options.libjars || "";
  url = this.knoxUrl + '/' + this.cluster + '/templeton/' + version + '/mapreduce/jar';
  var body = "jar=" + jarname + "&class=" + classname;
  if (libjars != "") {
    body += + "&libjars=" + libjars;
  }
  for (i = 0; i < options.arg.length; i++) {
    body += "&arg=" + options.arg[i];
  }
  request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded'},
    url:     url,
    body:    body
  }, function(error, response, body){
    console.log(body);
  }).auth(this.user, this.pwd, true);
}

function kill(jobid, callback) {
  url = this.knoxUrl + '/' + this.cluster + '/templeton/v1/jobs/' + jobid;
  console.log('url: ' + url);
  request.del({
    url:     url,
  }, function(error, response, body){
    console.log(body);
  }).auth(this.user, this.pwd, true);
}

function mixin(target, source) {
  source = source || {};
  Object.keys(source).forEach(function(key) {
    target[key] = source[key];
  });
  
  return target;
}

HCatRequest.prototype.jobs=jobs;
HCatRequest.prototype.job=job;
HCatRequest.prototype.jar=jar;
HCatRequest.prototype.kill=kill;
HCatRequest.prototype.get=get;
HCatRequest.prototype.put=put;
HCatRequest.prototype.post=post;
HCatRequest.prototype.remove=remove;
module.exports=HCatRequest;
