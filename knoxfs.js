var HDFSRequest = require('./hdfsmod');
var HCatRequest = require('./hcatmod');
var readline = require('readline'),
    rl = readline.createInterface(process.stdin, process.stdout);
    
var user = "guest";
var pwd = "guest-password";
var hostport = "localhost:8443";
var cluster = "sandbox";
var wd = "/tmp/";
var prev = "";

rl.setPrompt('knoxfs' + wd + '> ');
rl.prompt();

if (typeof String.prototype.startsWith != 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str){
    return this.indexOf(str) == 0;
  };
}

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function printHelp() {
  console.log('');
  console.log('Available KnoxFs Commands and Usage ---------------');
  console.log('ls       - Usage: ls <path> ');
  console.log('lfs      - Usage: lfs <path> ');
  console.log('cat      - Usage: cat <path> ');
  console.log('append   - Usage: append <local-file-path> [<dest-file>]');
  console.log('put      - Usage: put <local-file-path> [<dest-path>] ');
  console.log('chmod    - Usage: chmod <octal> <path> ');
  console.log('chown    - Usage: chown <owner[:group]> <path> ');
  console.log('rm       - Usage: rm <path> ');
  console.log('cd       - Usage: cd <path> ');
  console.log('pwd      - Usage: pwd ');
  console.log('mkdir    - Usage: mkdir <path>');
  console.log('login    - Usage: login <username> <password>');
  console.log('logout   - Usage: logout');
  console.log('whoami   - Usage: whoami ');
  console.log('cluster  - Usage: cluster ');
  console.log('hostname - Usage: hostname ');
  console.log('mnt      - Usage: mnt <hostname:port> <cluster> ');
  console.log('{exec jar}- Usage: <path/filename>.jar [-cp=some.jar,someother.jar] classname [args...]');
  console.log('ps        - Usage: ps');
  console.log('job       - Usage: job <jobid>');
  console.log('kill      - Usage: kill <jobid>');
  console.log('---------------------------------------------------');
}

function callback(error, response, body) {
 // console.log(body);
 if (typeof response != 'undefined' && response.statusCode == 200 || typeof response != 'undefined' && response.statusCode == 201) {
   if (body[0] === '{' || body[0] === '[') {
     if (body.startsWith('{"FileStatuses')) {
       displayListings(body);
     }
     else if (body.startsWith('{"FileStatus"')) {
       displayListing(body);
     }
     else {
       process.stdout.write(JSON.stringify(JSON.parse(body), null, 2));
     }
   }
   else {
     console.log(body);
   }
   if(response.statusCode == 201) {
     console.log("successfully created")
   }
   rl.prompt();
 }
 else {
   if (response && response.statusCode == 403) {
     console.log("permission denied");
   }
   else if (response && response.statusCode == 404) {
     console.log("file not found");
   }
   else if (response && response.statusCode == 400) {
     console.log("bad request");
   }
   else if (response && response.statusCode == 401) {
     console.log("authentication required - try login");
   }
   else if (response && response.statusCode == 403) {
     console.log("Forbidden - check the health of your cluster.");
   }
   else if (response && response.statusCode == 500) {
     console.log("System Error: Please ensure that the correct Knox instance is mounted and that the topology url's are correct.");
   }
   else {
     if (typeof response != 'undefined') {
       console.log(response.statusCode);
     }
   }
 	 if (error) {
 	   console.log(error);
 	 }
  }
}

function hcatcallback(error, response, body) {
 // console.log(body);
 if (typeof response != 'undefined' && response.statusCode == 200 || typeof response != 'undefined' && response.statusCode == 201) {
   if (body[0] === '{' || body[0] === '[') {
     if (body.startsWith('{"id')) {
       displayProcesses(body);
     }
     else {
       displayProcesses(body);
       // process.stdout.write(JSON.stringify(JSON.parse(body), null, 2));
     }
   }
   else {
     console.log(body);
   }
   if(response.statusCode == 201) {
     console.log("successfully created")
   }
   rl.prompt();
 }
 else {
   if (response && response.statusCode == 403) {
     console.log("permission denied");
   }
   else if (response && response.statusCode == 404) {
     console.log("file not found");
   }
   else if (response && response.statusCode == 400) {
     console.log("bad request");
   }
   else if (response && response.statusCode == 401) {
     console.log("authentication required - try login");
   }
   else if (response && response.statusCode == 403) {
     console.log("Forbidden - check the health of your cluster.");
   }
   else if (response && response.statusCode == 500) {
     console.log("System Error: Please ensure that the correct Knox instance is mounted and that the topology url's are correct.");
   }
   else {
     if (typeof response != 'undefined') {
       console.log(response.statusCode);
     }
   }
 	 if (error) {
 	   console.log(error);
 	 }
  }
}

function displayProcesses(body) {
  var obj = JSON.parse(body);
  console.log('in displayProcesses');
  var listing = "_";
  for(var i=0; i < obj.length; i++){
    listing = "";
    listing += obj[i].id + " " +
    obj[i].detail.status.username + " " +
    obj[i].detail.status.jobPriority + " " +
    evalBoolean(obj[i].detail.status.jobComplete, 'complete', 'not_complete') + " " +
    evalBoolean(obj[i].detail.status.retired, 'retired', 'not_retired') + " " +
    obj[i].detail.status.state + " " +
    convertTime(obj[i].detail.status.startTime) + " " +
    convertTime(obj[i].detail.status.finishTime) + " ";
    console.log(listing);
  }
  console.log("");
  console.log(obj.length + " listed.");
}

function evalBoolean(bool, trueMessage, falseMessage) {
  if (bool == true) {
    return trueMessage;
  }
  return falseMessage;
}

function displayListings(body) {
  var obj = JSON.parse(body);
  console.log();
  var listing = "_";
  for(var i=0; i < obj.FileStatuses.FileStatus.length; i++){
    listing = "_";
    if (obj.FileStatuses.FileStatus[i].type == "DIRECTORY" ) {
      listing = "d";
    }
    listing += toSymbolic(parseInt(obj.FileStatuses.FileStatus[i].permission)) + " " +
    obj.FileStatuses.FileStatus[i].permission + " " +
    obj.FileStatuses.FileStatus[i].owner + " " + 
    obj.FileStatuses.FileStatus[i].group + " " + 
    obj.FileStatuses.FileStatus[i].length + " " + 
    convertTime(parseInt(obj.FileStatuses.FileStatus[i].modificationTime)) + " " + 
    obj.FileStatuses.FileStatus[i].replication + " " + 
    obj.FileStatuses.FileStatus[i].pathSuffix;
    console.log(listing);
  }
  console.log("");
  console.log(obj.FileStatuses.FileStatus.length + " listed.");
}

function displayListing(filestatus) {
  var obj = JSON.parse(filestatus);
  console.log();
  listing = "_";
  if (obj.FileStatus.type == "DIRECTORY" ) {
    listing = "d";
  }
  console.log(listing + 
  toSymbolic(parseInt(obj.FileStatus.permission)) + " " + 
  obj.FileStatus.owner + " " + 
  obj.FileStatus.group + " " + 
  obj.FileStatus.length + " " + 
  convertTime(parseInt(obj.FileStatus.modificationTime)) + " " + 
  obj.FileStatus.replication + " " +
  obj.FileStatus.pathSuffix);
}

function convertTime(timeMilliSecs) {
  var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
  d.setUTCSeconds(timeMilliSecs/1000);
  return d;
}

function toSymbolic ( octal, output ) {
	var digits, binary, block=[]
		, output = output || 'array';
	
	if (octal > 777) octal = new String(octal).substring(1, 4);	
	if ( !isOctalValid( octal ) ) {
		throw new Error( "Permission octal representation is not valid: " + octal );
	}
		
	
	digits = ( octal ).toString().split('');
	
	digits.forEach( function ( d, index ) {
		var symbole = '';
		binary = (parseInt(d)).toString(2);
		symbole += ( binary >= 100 ) ? 'r' : '-';
		symbole += ( (binary-100) >= 10 ) ? 'w' : '-';
		symbole += ((binary-100) == 1 || (binary-110) == 1 ) ? 'x' : '-';
		block[index] = symbole;
	});
	return ( 'string' == output.toLowerCase() ) ? block.join('') : block ;
}

function isOctalValid ( octal ) {
	if ( !octal ) return false;
	return !!( parseInt(octal) && octal > 100 && octal < 778 );	
}

function printBanner() {
  console.log("");
  console.log("KKKKKKKKK    KKKKKKK                                                     FFFFFFFFFFFFFFFFFFFFFF              ");
  console.log("K:::::::K    K:::::K                                                     F::::::::::::::::::::F              ");
  console.log("K:::::::K    K:::::K                                                     F::::::::::::::::::::F              ");
  console.log("K:::::::K   K::::::K                                                     FF::::::FFFFFFFFF::::F              ");
  console.log("KK::::::K  K:::::KKKnnnn  nnnnnnnn       ooooooooooo xxxxxxx      xxxxxxx  F:::::F       FFFFFF ssssssssss   ");
  console.log("  K:::::K K:::::K   n:::nn::::::::nn   oo:::::::::::oox:::::x    x:::::x   F:::::F            ss::::::::::s  ");
  console.log("  K::::::K:::::K    n::::::::::::::nn o:::::::::::::::ox:::::x  x:::::x    F::::::FFFFFFFFFFss:::::::::::::s ");
  console.log("  K:::::::::::K     nn:::::::::::::::no:::::ooooo:::::o x:::::xx:::::x     F:::::::::::::::Fs::::::ssss:::::s");
  console.log("  K:::::::::::K       n:::::nnnn:::::no::::o     o::::o  x::::::::::x      F:::::::::::::::F s:::::s  ssssss ");
  console.log("  K::::::K:::::K      n::::n    n::::no::::o     o::::o   x::::::::x       F::::::FFFFFFFFFF   s::::::s      ");
  console.log("  K:::::K K:::::K     n::::n    n::::no::::o     o::::o   x::::::::x       F:::::F                s::::::s   ");
  console.log("KK::::::K  K:::::KKK  n::::n    n::::no::::o     o::::o  x::::::::::x      F:::::F          ssssss   s:::::s ");
  console.log("K:::::::K   K::::::K  n::::n    n::::no:::::ooooo:::::o x:::::xx:::::x   FF:::::::FF        s:::::ssss::::::s");
  console.log("K:::::::K    K:::::K  n::::n    n::::no:::::::::::::::ox:::::x  x:::::x  F::::::::FF        s::::::::::::::s ");
  console.log("K:::::::K    K:::::K  n::::n    n::::n oo:::::::::::oox:::::x    x:::::x F::::::::FF         s:::::::::::ss  ");
  console.log("KKKKKKKKK    KKKKKKK  nnnnnn    nnnnnn   ooooooooooo xxxxxxx      xxxxxxxFFFFFFFFFFF          sssssssssss    ");
  console.log("");
  console.log("Author: Larry McCay");
  console.log("");
}

function splash() {
  printBanner();
  printHelp();
  rl.prompt();
}

splash();

function validateDirectory(next) {
  var knox = new HDFSRequest('https://' + hostport + '/gateway', cluster, user, pwd);
  // console.log("validating: " + next);
  knox.listFileStatus({path: next}, function callback(error, response, body) {
    // console.log(response.statusCode);
    if (typeof response != 'undefined' && response.statusCode == 200) {
      prev = "" + wd;
      wd = next;
      console.log("");
      rl.setPrompt('knoxfs' + wd + '> ');
      rl.prompt();
      // console.log("prev: " + prev);
      // console.log("wd: " + wd);
    }
    else {
      console.log(next + ': No such file or directory.')
    }
  });
}

function changeDirectory(line) {
  var next = wd.value;
  var array = line.split(" ");
  if (typeof wd == 'undefined') wd = "/";
  if (array[1].startsWith("/")) {
     next = "" + array[1];
  }
  else if (".." == array[1]) {
    var dirs = wd.split('/');
    if (dirs.length > 1) {
      next = "/";
      for (var i = 0; i < dirs.length-2; i++) {
        next = next + dirs[i];
        if (!next.endsWith("/")) {
          next += "/";
        }
      }
    }
  }
  else {
    next = wd + array[1];
  }
  if (!next.endsWith("/")) {
    next = next + "/";
  }
  validateDirectory(next);
}

rl.on('line', function(line) {
  switch(line.trim()) {
    case '?':
    case 'help':
      printHelp();
      break;
    case 'splash':
      splash();
      break;
    default:
      var knox = new HDFSRequest('https://' + hostport + '/gateway', cluster, user, pwd);

      if (line.startsWith('ls ') || line == "ls") {
        var array = line.split(" ");
        if (array.length > 1 && !array[1].startsWith("/")) array[1] = wd + array[1];
        var path = "";
        if (array.length == 1) {
          path = wd;
        }
        else {
          path = array[1];
        }
        var status = knox.listStatus({path: path}, callback);
      }
      else if (line.startsWith('lfs ')) {
        var array = line.split(" ");
        if (array.length > 1 && !array[1].startsWith("/")) array[1] = wd + array[1];
        var path = "";
        if (array.length == 1) {
          path = wd;
        }
        else {
          path = array[1];
        }
        var status = knox.listFileStatus({path: path}, callback);
      }
      else if (line.startsWith('checksum ')) {
        var array = line.split(" ");
        if (array.length > 1 && !array[1].startsWith("/")) array[1] = wd + array[1];
        var path = "";
        if (array.length == 1) {
          path = wd;
        }
        else {
          path = array[1];
        }
        knox.checksum({path: path}, callback);
      }
      else if (line.startsWith('cat ')) {
        var array = line.split(" ");
        if (array.length > 1 && !array[1].startsWith("/")) array[1] = wd + array[1];
        var path = "";
        if (array.length == 1) {
          path = wd;
        }
        else {
          path = array[1];
        }
        knox.open({path: path}, callback);
      }
      else if (line.startsWith('put ')) {
        var array = line.split(" ");
        var path;
        if (array.length == 3) {
          if (!array[2].startsWith("/")) {
            path = wd + array[2];
          }
          else {
            path = array[2];
          }
        }
        else {
          path = wd + array[1].replace(/^.*[\\\/]/, '');
        }
        knox.create(array[1], {path: path}, callback);
        // console.log("Not available yet.")
      }
      else if (line.startsWith('append ')) {
        var array = line.split(" ");
        var path;
        if (array.length == 3) {
          if (!array[2].startsWith("/")) {
            path = wd + array[2];
          }
          else {
            path = array[2];
          }
        }
        else {
          path = wd + array[1].replace(/^.*[\\\/]/, '');
        }
        knox.append(array[1], {path: path}, callback);
        // console.log("Not available yet.")
      }
      else if (line.startsWith('rm ')) {
        var array = line.split(" ");
        if (!array[1].startsWith("/")) array[1] = wd + array[1];
        knox.rm({path: array[1]}, callback);
      }
      else if (line.startsWith('mkdir ')) {
        var array = line.split(" ");
        if (!array[1].startsWith("/")) array[1] = wd + array[1];
        knox.mkdirs({path: array[1]}, callback);
      }
      else if (line.startsWith('mv ')) {
        var array = line.split(" ");
        if (!array[1].startsWith("/")) array[1] = wd + array[1];
        if (!array[2].startsWith("/")) array[2] = wd + array[2];
        knox.mv({path: array[1], destination: array[2]}, callback);
      }
      else if (line.startsWith('chmod ')) {
        var array = line.split(" ");
        if (!array[2].startsWith("/")) array[2] = wd + array[2];
        knox.chmod({path: array[2], permission: array[1]}, callback);
      }
      else if (line.startsWith('chown ')) {
        var array = line.split(" ");
        if (!array[2].startsWith("/")) array[2] = wd + array[2];
        knox.chown({path: array[2], owner: array[1]}, callback);
      }
      else if (line.startsWith('login ')) {
        var array = line.split(" ");
        user = array[1];
        pwd = array[2];
      }
      else if (line == 'logout') {
        user = "";
        pwd = "";
      }      else if (line == 'whoami') {
        console.log(user);
      }
      else if (line == 'cluster') {
        console.log(cluster);
      }
      else if (line == 'hostname') {
        console.log(hostport);
      }
      else if (line.startsWith('mnt ')) {
        var array = line.split(" ");
        hostport = array[1];
        cluster = array[2];
        console.log("mounted cluster: " + cluster + " on host: " + hostport);
      }
      else if (line.startsWith('cd ')) {
        changeDirectory(line);
      }
      else if (line.startsWith('pwd')) {
        console.log("current working dir is: " + wd);
      }
      else if (line.startsWith('ps')) {
        var knoxcat = new HCatRequest('https://' + hostport + '/gateway', cluster, user, pwd);
        knoxcat.jobs({showall: 'true', fields: '*'}, hcatcallback);
      }
      else if (line.startsWith('job ')) {
        var array = line.split(" ");
        var knoxcat = new HCatRequest('https://' + hostport + '/gateway', cluster, user, pwd);
        knoxcat.job(array[1], callback);
      }
      else if (line.startsWith('kill ')) {
        var array = line.split(" ");
        var knoxcat = new HCatRequest('https://' + hostport + '/gateway', cluster, user, pwd);
        knoxcat.kill(array[1], callback);
      }
      else {
	      if (line.trim() != "") {
          var array = line.split(" ");
          // knoxfs/tmp/> wordcount.jar -cp=transform.jar:someother.jar org.myorg.WordCount wordcount/input wordcount/output
          // [ 'wordcount.jar',
          //   '-cp=transform.jar:someother.jar',
          //   'org.myorg.WordCount',
          //   'wordcount/input',
          //   'wordcount/output' ]
          if (array[0].endsWith(".jar")) {
            var knoxcat = new HCatRequest('https://' + hostport + '/gateway', cluster, user, pwd, callback);
            // function jar(jar, libjars, classname, options,callback) {
            var libjars = "";
            var classname = "";
            if (array[1].startsWith("-cp=")) {
              libjars = array[1].substr(4);
              classname = array[2];
            }
            else {
              classname = array[1];
            }
            var args = {};
            args['arg'] = [];
            for (i = 3; i < array.length; i++) {
              args['arg'][i-3] = array[i];
            }
            console.log(args); 
            knoxcat.jar(array[0], libjars, array[2], args)
          }
          else {
  	        console.log("-knoxfs: " + line + ": command not found")
	        }
	      }
      }
  }
  rl.setPrompt('knoxfs' + wd + '> ');
  rl.prompt();
}).on('close', function() {
  console.log('Have a great day!');
  process.exit(0);
});