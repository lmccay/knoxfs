var HDFSRequest = require('./hdfsmod');
var readline = require('readline');

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body)
  }
  else {
    console.log(error)
  }
}

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var u;
rl.question("username: ", function(answer) {
  // TODO: Log the answer in a database
  u = answer;

  rl.close();
});

var knox = new HDFSRequest('https://localhost:8443/gateway', 'sandbox', u, 'guest-password');
// knox.get({path: "/tmp", op: "LISTSTATUS"}, callback);
knox.listStatus({path: "/tmp/test/"}, callback);
// knox.get({path: "/tmp", op: "GETCONTENTSUMMARY"}, callback);
// knox.mkdirs({path: "/ljm"}, callback);
// knox.listStatus({path: "/ljm"}, callback);
// knox.open({path: "/ljm"}, callback);
// knox.create('./package.json', {path: "/ljm/readme.txt"}, callback);
