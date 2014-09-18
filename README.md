knoxfs
======

A very simple node.js CLI to interact with Hadoop through an Apache Knox gateway

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
ls     - Usage: ls <path>
open   - Usage: open <path>
create - Usage: create <local-file-path> <dest-path>
rm - Usage: rm <path>
cd - Usage: cd <path>
pwd - Usage: pwd
---------------------------------------------------
```