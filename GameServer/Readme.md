# GLO-3002
Game Server

## Install Node JS
1. Install node by executing the specific installation corresponding to your OS

    * On Windows : http://nodejs.org/download/
    * On Mac : http://nodejs.org/download/
    * On Ubuntu 14.04 (See node Linux for other distributions)
        <code>sudo apt-get update</code>
        <code>sudo apt-get install nodejs</code>
        <code>sudo apt-get install npm</code>

2. Verify that Node is correctly installed by executing this command:
    <code>node -v</code>
    * If you get v0.10.x, then Node is installed. If you get an error message, your Node install did not install correctly.

3. Verify that Node package manager (npm) was install during the Node install by executing this command:
    <code>npm -v</code>
    * If you get v1.3.x, then npm is installed. If you get an error message, your npm install did not install correctly.


# Directives for running the server locally ;)

1. Open a terminal in the root folder of this project

2. Type <code>npm start</code>

3. Be amazed :P

# How to run test suite

Test are executed with Mocha and Chai. To run the tests, ensure you have all required dependencies by running <code>npm install</code>.

To run the test, execute <code>mocha test</code>
