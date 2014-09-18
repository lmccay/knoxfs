var HDFSRequest = require('./hdfsmod');
var readline = require('readline'),
    rl = readline.createInterface(process.stdin, process.stdout);

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
    case 'help':
      console.log('');
      console.log('Available KnoxFs Commands and Usage ---------------');
      console.log('ls     - Usage: ls <path> ');
      console.log('open   - Usage: open <path> ');
      console.log('create - Usage: create <local-file-path> <dest-path> ');
      console.log('---------------------------------------------------');
      break;
    default:
      if (line.startsWith('ls ')) {
        var knox = new HDFSRequest('https://localhost:8443/gateway', 'sandbox', 'guest', 'guest-password');
        // knox.get({path: "/tmp", op: "LISTSTATUS"}, callback);
        var array = line.split(" ");
        var status = knox.listStatus({path: array[1]}, callback);
      }
      if (line.startsWith('open ')) {
        var knox = new HDFSRequest('https://localhost:8443/gateway', 'sandbox', 'guest', 'guest-password');
        // knox.get({path: "/tmp", op: "LISTSTATUS"}, callback);
        var array = line.split(" ");
        var status = knox.open({path: array[1]}, callback);
      }
      if (line.startsWith('create ')) {
        var knox = new HDFSRequest('https://localhost:8443/gateway', 'sandbox', 'guest', 'guest-password');
        // knox.get({path: "/tmp", op: "LISTSTATUS"}, callback);
        var array = line.split(" ");
        knox.create(array[1], {path: array[2]}, callback);
      }
      if (line.startsWith('rm ')) {
        var knox = new HDFSRequest('https://localhost:8443/gateway', 'sandbox', 'guest', 'guest-password');
        // knox.get({path: "/tmp", op: "LISTSTATUS"}, callback);
        var array = line.split(" ");
        knox.rm({path: array[1]}, callback);
      }
  }
  rl.prompt();
}).on('close', function() {
  console.log('Have a great day!');
  process.exit(0);
});