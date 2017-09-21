#! /bin/bash
rm -rf ../serv/dist
fis3 release publish -f ./fis-conf-prod.js -cd ../serv
