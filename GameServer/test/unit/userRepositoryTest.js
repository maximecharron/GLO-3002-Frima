var proxyquire = require('proxyquire');
var chai = require('chai');
var spies = require('chai-spies');
chai.use(spies);

var expect = chai.expect;
var should = chai.should();
var sinon = require("sinon");

var users = "USERS";

var userModelStub = {};
var jwtStub = {};

var decoded = {iss: "41224d776a326fb40f000001" };

var Consumable = require("../../domain/items/consumable.js");

var UserRepository = proxyquire('./../../repository/userRepository.js', {'./../models/user.js': userModelStub, 'jwt-simple': jwtStub });

//Stubs

userModelStub.findOne = function() { };
jwtStub.decode = function() { return decoded; };

before(function(done){
    done();
});

describe("userRepository", function ()
{
    beforeEach(function(done)
    {
        done();
    });

    describe("addUserItems", function()
    {
        it("should call UserModel.findOne", function()
        {
            //Arrange
            //var userRepository = new UserRepository();
            //var bdSpy = chai.spy.on(userModelStub, 'findOne');
            //var item = new Consumable(0, 0, "item", 10, 10, 10);
            //var token = "aToken";

            //Act
            //userRepository.addUserItems(token, item);

            //Assert
            //expect(bdSpy).to.have.been.called.once;
        });
    });
});


