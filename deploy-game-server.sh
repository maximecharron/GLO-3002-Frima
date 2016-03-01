#!/bin/bash
set -e
echo "Did 1"
git remote add frima-server-test https://git.heroku.com/frima-server-test.git || exit 1
echo "Did 2"
git subtree push --prefix GameServer frima-server-test master || exit 1
echo "Did 3"