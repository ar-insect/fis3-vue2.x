#! /bin/bash
rm -rf ./build/dist
fis3 release publish -f ./fis-conf-prod.js -cd ./build
