#!/bin/bash

if [ ! -f "./src/@core/.env.testing" ]; then
    cp ./src/@core/.env.test.example ./src/@core/.env.test
fi

npm install

tail -f /dev/null

#npm run start:dev