knoxfs
======

A very simple node.js CLI to interact with Hadoop through an Apache Knox gateway

Node.js must be installed on your machine for KnoxFs to work. You can download the installer for your favorite platform from http://nodejs.org/download/.

Simply clone this project and install it with npm to get all of the dependencies and run.
   
```
cd knoxfs
npm install
node knoxfs.js

knoxfs>
KKKKKKKKK    KKKKKKK                                                     FFFFFFFFFFFFFFFFFFFFFF
K:::::::K    K:::::K                                                     F::::::::::::::::::::F
K:::::::K    K:::::K                                                     F::::::::::::::::::::F
K:::::::K   K::::::K                                                     FF::::::FFFFFFFFF::::F
KK::::::K  K:::::KKKnnnn  nnnnnnnn       ooooooooooo xxxxxxx      xxxxxxx  F:::::F       FFFFFF ssssssssss
  K:::::K K:::::K   n:::nn::::::::nn   oo:::::::::::oox:::::x    x:::::x   F:::::F            ss::::::::::s
  K::::::K:::::K    n::::::::::::::nn o:::::::::::::::ox:::::x  x:::::x    F::::::FFFFFFFFFFss:::::::::::::s
  K:::::::::::K     nn:::::::::::::::no:::::ooooo:::::o x:::::xx:::::x     F:::::::::::::::Fs::::::ssss:::::s
  K:::::::::::K       n:::::nnnn:::::no::::o     o::::o  x::::::::::x      F:::::::::::::::F s:::::s  ssssss
  K::::::K:::::K      n::::n    n::::no::::o     o::::o   x::::::::x       F::::::FFFFFFFFFF   s::::::s
  K:::::K K:::::K     n::::n    n::::no::::o     o::::o   x::::::::x       F:::::F                s::::::s
KK::::::K  K:::::KKK  n::::n    n::::no::::o     o::::o  x::::::::::x      F:::::F          ssssss   s:::::s
K:::::::K   K::::::K  n::::n    n::::no:::::ooooo:::::o x:::::xx:::::x   FF:::::::FF        s:::::ssss::::::s
K:::::::K    K:::::K  n::::n    n::::no:::::::::::::::ox:::::x  x:::::x  F::::::::FF        s::::::::::::::s
K:::::::K    K:::::K  n::::n    n::::n oo:::::::::::oox:::::x    x:::::x F::::::::FF         s:::::::::::ss
KKKKKKKKK    KKKKKKK  nnnnnn    nnnnnn   ooooooooooo xxxxxxx      xxxxxxxFFFFFFFFFFF          sssssssssss
```

Author: Larry McCay

This very simple CLI is handy for simple monitoring needs of files within HDFS through the Apache Knox Gateway.
By leveraging the REST APIs exposed by Knox there is no need for a local Hadoop install for client libraries and configuration in order to access HDFS.
```
Available KnoxFs Commands and Usage ---------------
ls        - Usage: ls <path>
lfs       - Usage: lfs <path>
cat       - Usage: cat <path>
append    - Usage: append <local-file-path> [<dest-file>]
put       - Usage: put <local-file-path> [<dest-path>]
chmod     - Usage: chmod <octal> <path>
chown     - Usage: chown <owner[:group]> <path>
rm        - Usage: rm <path>
cd        - Usage: cd <path>
pwd       - Usage: pwd
mkdir     - Usage: mkdir <path>
login     - Usage: login <username> <password>
logout    - Usage: logout
whoami    - Usage: whoami
cluster   - Usage: cluster
hostname  - Usage: hostname
mnt       - Usage: mnt <hostname:port> <cluster>
{exec jar}- Usage: <path/filename>.jar [-cp=some.jar,someother.jar] classname [args...]
ps        - Usage: ps
job       - Usage: job
kill      - Usage: kill
---------------------------------------------------
```

## Usage
The default settings for KnoxFs assume a localhost installation of an Apache Knox instance and a topology called sandbox.
It also defaults to the demo username and password for the Apache Knox demo LDAP server: guest:guest-password.

In order to login as another user and interact with another topology deployment the following can be used:

```
knoxfs/> login username password
knoxfs/> mnt knoxhost:8443 topologyname
```

Once you are logged in as your appropriate user and you have mounted the correct Knox topology, you may interact with HDFS
through the available commands.

```
knoxfs/> ls
knoxfs/>
drwx,rwx,rwx 777 yarn hadoop 0 Tue Feb 10 2015 11:04:01 GMT-0500 (EST) 0 app-logs
drwx,r-x,r-x 755 hdfs hdfs 0 Tue Feb 10 2015 10:58:26 GMT-0500 (EST) 0 apps
drwx,r-x,r-x 755 hdfs hdfs 0 Tue Feb 10 2015 10:55:54 GMT-0500 (EST) 0 hdp
drwx,r-x,r-x 755 mapred hdfs 0 Tue Feb 10 2015 10:55:15 GMT-0500 (EST) 0 mapred
drwx,r-x,r-x 755 hdfs hdfs 0 Tue Feb 10 2015 10:55:15 GMT-0500 (EST) 0 mr-history
drwx,r-x,r-x 755 hdfs hdfs 0 Tue Feb 10 2015 10:56:40 GMT-0500 (EST) 0 system
drwx,rwx,rwx 777 hdfs hdfs 0 Tue Feb 10 2015 12:18:09 GMT-0500 (EST) 0 tmp
drwx,r-x,r-x 755 hdfs hdfs 0 Tue Feb 10 2015 12:39:49 GMT-0500 (EST) 0 user

8 listed.
knoxfs/>
```

## Known Issues - pull requests welcomed! :)
* put does not work with Knox 0.4.0 or earlier releases - currently requires a build from master or branch v0.5.0
* cat of large files out of memory's the process
* login just sets the state for username and password - doesn't do any actual authentication
* should prompt for password and hide the characters as typed
* cd .. does not support multiple levels - you can only go up one at a time
