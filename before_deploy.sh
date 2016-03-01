#!/bin/bash
if [[ "$TRAVIS_BRANCH" == "server_release" ]]; then
  cd GameServer
else
    echo "else"
fi