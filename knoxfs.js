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

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body);
  }
  else {
    console.log(error);
  }
}

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

rl.on('line', function(line) {
  switch(line.trim()) {
    case '?':
    case 'help':
      console.log('');
      console.log('Available KnoxFs Commands and Usage ---------------');
      console.log('ls     - Usage: ls <path> ');
      console.log('open   - Usage: open <path> ');
      console.log('create - Usage: create <local-file-path> <dest-path> ');
      console.log('rm     - Usage: rm <path> ');
      console.log('cd     - Usage: cd <path> ');
      console.log('pwd    - Usage: pwd ');
      console.log('login  - Usage: login <username> <password>');
      console.log('whoami - Usage: whoami ');
      console.log('---------------------------------------------------');
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
        var status = knox.open({path: path}, callback);
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
      else if (line.startsWith('login ')) {
        var array = line.split(" ");
        user = array[1];
        pwd = array[2];
      }
      else if (line == 'whoami') {
        console.log(user);
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
             }
           }
         }
         else {
          this.wd += array[1];
         }
         if (this.wd != "/") {
           this.wd += "/";
         }
         console.log("set working dir to: " + this.wd);
      }
      else if (line.startsWith('pwd')) {
        console.log("current working dir is: " + this.wd);
      }
  }
  rl.prompt();
}).on('close', function() {
  console.log('Have a great day!');
  process.exit(0);
});