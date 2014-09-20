var HDFSRequest = require('./hdfsmod');
var readline = require('readline'),
    rl = readline.createInterface(process.stdin, process.stdout);
var user = "guest";
var pwd = "guest-password";
var hostport = "localhost:8443";
var cluster = "sandbox";
var wd = "/";

rl.setPrompt('knoxfs> ');
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
  console.log('open     - Usage: open <path> ');
  console.log('checksum - Usage: checksum <path> ');
  console.log('create   - Usage: create <local-file-path> <dest-path> ');
  console.log('chmod    - Usage: chmod <octal> <path> ');
  console.log('chown    - Usage: chown <owner[:group]> <path> ');
  console.log('rm       - Usage: rm <path> ');
  console.log('cd       - Usage: cd <path> ');
  console.log('pwd      - Usage: pwd ');
  console.log('login    - Usage: login <username> <password>');
  console.log('logout   - Usage: logout');
  console.log('whoami   - Usage: whoami ');
  console.log('cluster  - Usage: cluster ');
  console.log('hostname - Usage: hostname ');
  console.log('mnt      - Usage: mnt <hostname:port> <cluster> ');
  console.log('---------------------------------------------------');
}

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body);
  }
  else {
	  if (response.statusCode == 403) {
	    console.log("permission denied");
	  }
	  else if (response.statusCode == 404) {
	    console.log("file not found");
	  }
	  else if (response.statusCode == 400) {
	    console.log("bad request");
	  }
	  else if (response.statusCode == 401) {
	    console.log("authentication required - try login");
	  }
	  else {
      console.log(response.statusCode);
  	}
  	if (error) {
  	  console.log(error);
  	}
  }
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

printBanner();
printHelp();

rl.on('line', function(line) {
  switch(line.trim()) {
    case '?':
    case 'help':
      printHelp();
      break;
    default:
      var knox = new HDFSRequest('https://' + hostport + '/gateway', cluster, user, pwd);

      if (line.startsWith('ls ') || line == "ls") {
        var array = line.split(" ");
        if (array.length > 1 && !array[1].startsWith("/")) array[1] = this.wd + array[1];
        var path = "";
        if (array.length == 1) {
          path = this.wd;
        }
        else {
          path = array[1];
        }
        var status = knox.listStatus({path: path}, callback);
      }
      else if (line.startsWith('lfs ')) {
        var array = line.split(" ");
        if (array.length > 1 && !array[1].startsWith("/")) array[1] = this.wd + array[1];
        var path = "";
        if (array.length == 1) {
          path = this.wd;
        }
        else {
          path = array[1];
        }
        var status = knox.listFileStatus({path: path}, callback);
      }
      else if (line.startsWith('checksum ')) {
        var array = line.split(" ");
        if (array.length > 1 && !array[1].startsWith("/")) array[1] = this.wd + array[1];
        var path = "";
        if (array.length == 1) {
          path = this.wd;
        }
        else {
          path = array[1];
        }
        knox.checksum({path: path}, callback);
      }
      else if (line.startsWith('open ')) {
        var array = line.split(" ");
        if (array.length > 1 && !array[1].startsWith("/")) array[1] = this.wd + array[1];
        var path = "";
        if (array.length == 1) {
          path = this.wd;
        }
        else {
          path = array[1];
        }
        knox.open({path: path}, callback);
      }
      else if (line.startsWith('create ')) {
        // var array = line.split(" ");
        // knox.create(array[1], {path: array[2]}, callback);
        console.log("Not available yet.")
      }
      else if (line.startsWith('rm ')) {
        var array = line.split(" ");
        knox.rm({path: array[1]}, callback);
      }
      else if (line.startsWith('mkdirs ')) {
        var array = line.split(" ");
        knox.mkdirs({path: array[1]}, callback);
      }
      else if (line.startsWith('mv ')) {
        var array = line.split(" ");
        if (!array[1].startsWith("/")) array[1] = this.wd + array[1];
        if (!array[2].startsWith("/")) array[2] = this.wd + array[2];
        knox.mv({path: array[1], destination: array[2]}, callback);
      }
      else if (line.startsWith('chmod ')) {
        var array = line.split(" ");
        if (!array[2].startsWith("/")) array[2] = this.wd + array[2];
        knox.chmod({path: array[2], permission: array[1]}, callback);
      }
      else if (line.startsWith('chown ')) {
        var array = line.split(" ");
        if (!array[2].startsWith("/")) array[2] = this.wd + array[2];
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
        var array = line.split(" ");
        if (typeof this.wd == 'undefined') this.wd = "/";
        if (array[1].startsWith("/")) {
           this.wd = array[1];
         }
         else if (".." == array[1]) {
           var dirs = this.wd.split('/');
           if (dirs.length > 1) {
             this.wd = "/";
             for (var i = 0; i < dirs.length-2; i++) {
               this.wd += dirs[i];
               if (!this.wd.endsWith("/")) {
                 this.wd += "/";
               }
             }
           }
         }
         else {
          this.wd += array[1];
         }
         if (!this.wd.endsWith("/")) {
           this.wd += "/";
         }
         rl.setPrompt('knoxfs' + this.wd + '> ');
         console.log("set working dir to: " + this.wd);
      }
      else if (line.startsWith('pwd')) {
        console.log("current working dir is: " + this.wd);
      }
      else {
	    if (line.trim() != "") {
	      console.log("-knoxfs: " + line + ": command not found")
	    }
      }
  }
  rl.prompt();
}).on('close', function() {
  console.log('Have a great day!');
  process.exit(0);
});