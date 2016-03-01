#!/bin/bash
gem install heroku
# Add your Heroku git repo:
git remote add heroku git@heroku.com:frima-server-test.git
  # Turn off warnings about SSH keys:
echo "Host heroku.com" >> ~/.ssh/config
echo "   StrictHostKeyChecking no" >> ~/.ssh/config
echo "   CheckHostIP no" >> ~/.ssh/config
echo "   UserKnownHostsFile=/dev/null" >> ~/.ssh/config
  # Clear your current Heroku SSH keys:
heroku keys:clear
  # Add a new SSH key to Heroku
yes | heroku keys:add
  # Push to Heroku!
yes | git subtree push --prefix GameServer heroku master || exit 1
echo "Did 3"