# GLO-3002
Game Server

### Installer MongoDB
Suivre le guide d'installation officiel pour votre poste de travail :
* [Windows](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/)
* [Mac](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/)
* [Linux](http://docs.mongodb.org/manual/administration/install-on-linux/)

### Installer Redis
Suivre le guide d'installation ici: 
http://redis.io/download


### Installer Node JS
* Windows : http://nodejs.org/download/
* Mac : http://nodejs.org/download/
* Ubuntu 14.04 (pour autre version linux : [Documentation Node Linux](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager))
```
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm
```

Vérifier que Node est installé avec la commande:
```
node -v
```
Devrais afficher v0.10.x, si vous avez un message d'erreur Node ne s'est pas installé correctement.
Vérifier que Node est installé avec la commande:
```
npm -v
```
Devrais afficher v1.3.x, si vous avez un message d'erreur npm ne s'est pas installé correctement.


# Directives for running the server locally

1. Start mongod. It can be found in the bin of your MongoDB install. If MongoDB is in your path, just run <code>mongod</code>
2. Start redis-server. It can be found in the bin of your Redis install. If you installed Redis as a service, it may already be running.
3. Open a console in the GameServer folder. 
4. Type <code>npm start</code>
5. Have fun!


# How to run test suite

Test are executed with Mocha and Chai. To run the tests, assuming you are in the GameServer folder, ensure you have all required dependencies by running <code>npm install</code>.

To run the tests, execute <code>npm test</code>

# How to run test coverage

To run code coverage, execute <code>npm run cover</code>
