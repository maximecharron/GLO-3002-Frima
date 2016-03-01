
git remote add frima-server-test https://git.heroku.com/frima-server-test.git || exit 1;

git subtree --prefix GameServer frima-server-test master || exit 1;
