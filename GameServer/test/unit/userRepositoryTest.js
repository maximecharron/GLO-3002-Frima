var proxyquire = require('proxyquire');
var chai = require('chai');
var spies = require('chai-spies');
chai.use(spies);

var expect = chai.expect;
var should = chai.should();
var sinon = require("sinon");

var Consumable = require("../../domain/items/consumable.js");
var UserModel = require('./../../models/user.js').model;
var ItemModel = require('./../../models/item.js').model;

//Stubs
var jwtStub = {};
var decoded = {iss: "41224d776a326fb40f000001" };
jwtStub.decode = function() { return decoded; };

var UserRepository = proxyquire('./../../repository/userRepository.js', {'jwt-simple': jwtStub });


var item;
var items;
var user;

before(function(done){
    done();
});

describe("userRepository", function ()
{
    beforeEach(function(done)
    {
        item = new Consumable(0, 0, "item", 10, 10, 10);
        items = [item];
        user = {items: [], save: function(){}  };
        done();
    });

    describe("addUserItems", function()
    {
        it("should call UserModel.findOne", function()
        {
            //Arrange
            var userRepository = new UserRepository();
            var bdSpy = sinon.stub(UserModel, 'findOne');
            bdSpy.yields(null, user);

            var token = "aToken";
            var items = [item];

            //Act
            userRepository.addUserItems(token, items);

            //Assert
            bdSpy.restore();
            sinon.assert.calledOnce(bdSpy);
        });

        it("with no item in user should add items in user", function()
        {
            //Arrange
            var userRepository = new UserRepository();
            var bdSpy = sinon.stub(UserModel, 'findOne');
            bdSpy.yields(null, user);

            var token = "aToken";
            var items = [item];
            var expectedQuantity = 1;

            //Act
            userRepository.addUserItems(token, items);

            //Assert
            bdSpy.restore();
            expect(expectedQuantity).to.equal(user.items.length);
        });

        it("with same item in user should update items quantity in user", function()
        {
            //Arrange
            var newItem = new ItemModel;
            newItem.type = item.type;
            newItem.subType = item.subType;
            newItem.name = item.name;
            newItem.quantity = 1;
            newItem.staminaRegeneration = item.staminaRegeneration;
            newItem.hypeGeneration = item.hypeGeneration;
            newItem.effectDuration = item.effectDuration;
            user.items.push(newItem);

            var userRepository = new UserRepository();
            var bdSpy = sinon.stub(UserModel, 'findOne');
            bdSpy.yields(null, user);

            var token = "aToken";
            var items = [item];
            var expectedItemQuantity = 2;

            //Act
            userRepository.addUserItems(token, items);

            //Assert
            bdSpy.restore();
            expect(expectedItemQuantity).to.equal(user.items[0].quantity);
        });

        it("should call save on user", function()
        {
            //Arrange
            var userRepository = new UserRepository();
            var bdSpy = sinon.stub(UserModel, 'findOne');
            var saveSpy = chai.spy.on(user, 'save');
            bdSpy.yields(null, user);

            var token = "aToken";
            var items = [item];

            //Act
            userRepository.addUserItems(token, items);

            //Assert
            bdSpy.restore();
            expect(saveSpy).to.have.been.called.exactly(1);
        });

    });

    describe("updateUserItems", function()
    {
        it("should call UserModel.findOne", function()
        {
            //Arrange
            var userRepository = new UserRepository();
            var bdSpy = sinon.stub(UserModel, 'findOne');
            bdSpy.yields(null, user);

            var token = "aToken";
            var items = [item];

            //Act
            userRepository.updateUserItems(token, items);

            //Assert
            bdSpy.restore();
            sinon.assert.calledOnce(bdSpy);
        });

        it("should reduce quantity of the item", function()
        {
            //Arrange
            var newItem = new ItemModel;
            newItem.type = item.type;
            newItem.subType = item.subType;
            newItem.name = item.name;
            newItem.quantity = 1;
            newItem.staminaRegeneration = item.staminaRegeneration;
            newItem.hypeGeneration = item.hypeGeneration;
            newItem.effectDuration = item.effectDuration;
            user.items.push(newItem);

            var userRepository = new UserRepository();
            var bdSpy = sinon.stub(UserModel, 'findOne');
            bdSpy.yields(null, user);

            var token = "aToken";
            var items = [item];
            var expectedItemQuantity = 0;

            //Act
            userRepository.updateUserItems(token, items);

            //Assert
            bdSpy.restore();
            expect(expectedItemQuantity).to.equal(user.items[0].quantity);
        });

        it("should call save on user", function()
        {
            //Arrange
            var userRepository = new UserRepository();
            var bdSpy = sinon.stub(UserModel, 'findOne');
            var saveSpy = chai.spy.on(user, 'save');
            bdSpy.yields(null, user);

            var token = "aToken";
            var items = [item];

            //Act
            userRepository.updateUserItems(token, items);

            //Assert
            bdSpy.restore();
            expect(saveSpy).to.have.been.called.exactly(1);
        });

    });

    describe("levelUpUser", function()
    {
        var currentUser;
        var expectedUser;
        var parameters;
        var levelUpInformation;

        beforeEach(function (done) {

            currentUser = {
                experiencePoints : 0,
                level : 0,
                requiredExperiencePointsForNextLevel : 100,
                upgradePointsOnLevelComplete : 1,
                attackPowerLevel : 1,
                staminaPowerLevel : 1,
                hypePowerLevel : 1,
                items: [],
                save: function(){}
            };

            expectedUser = {
                experiencePoints : 100,
                level : 1,
                requiredExperiencePointsForNextLevel : 200,
                upgradePointsOnLevelComplete : 2,
                attackPowerLevel : 2,
                staminaPowerLevel : 2,
                hypePowerLevel : 2,
                items: [],
                save: function(){}
            };

            parameters = {
                experiencePoints : 100,
                level : 1,
                attackPowerLevelUpgrade : 1,
                staminaPowerLevelUpgrade : 1,
                hypePowerLevelUpgrade : 1
            };

            levelUpInformation = {
                nextLevelXp : 200,
                pointForNextLevel : 2
            };

            done();
        });

        it("should call UserModel.findOne", function()
        {
            //Arrange
            var userRepository = new UserRepository();
            var bdSpy = sinon.stub(UserModel, 'findOne');
            bdSpy.yields(null, currentUser);

            var token = "aToken";

            //Act
            userRepository.levelUpUser(token, parameters, levelUpInformation);

            //Assert
            bdSpy.restore();
            sinon.assert.calledOnce(bdSpy);
        });

        it("should update properties of the user", function()
        {
            //Arrange
            var userRepository = new UserRepository();
            var bdSpy = sinon.stub(UserModel, 'findOne');
            bdSpy.yields(null, currentUser);

            var token = "aToken";

            //Act
            userRepository.levelUpUser(token, parameters, levelUpInformation);

            //Assert
            bdSpy.restore();
            expect(JSON.stringify(expectedUser)).to.equal(JSON.stringify(currentUser));
        });

        it("should call save on user", function()
        {
            //Arrange
            var userRepository = new UserRepository();
            var bdSpy = sinon.stub(UserModel, 'findOne');
            var saveSpy = chai.spy.on(currentUser, 'save');
            bdSpy.yields(null, currentUser);

            var token = "aToken";

            //Act
            userRepository.levelUpUser(token, parameters, levelUpInformation);

            //Assert
            bdSpy.restore();
            expect(saveSpy).to.have.been.called.exactly(1);
        });

    });

    describe("updateUserExperience", function()
    {
        var currentUser;
        var expectedUser;
        var experiencePoints;

        beforeEach(function (done) {

            currentUser = {
                experiencePoints : 0,
                items: [],
                save: function(){}
            };

            expectedUser = {
                experiencePoints : 1000,
                items: [],
                save: function(){}
            };

            experiencePoints = 1000;

            done();
        });

        it("should call UserModel.findOne", function()
        {
            //Arrange
            var userRepository = new UserRepository();
            var bdSpy = sinon.stub(UserModel, 'findOne');
            bdSpy.yields(null, currentUser);

            var token = "aToken";

            //Act
            userRepository.updateUserExperience(token, experiencePoints);

            //Assert
            bdSpy.restore();
            sinon.assert.calledOnce(bdSpy);
        });

        it("should update properties of the user", function()
        {
            //Arrange
            var userRepository = new UserRepository();
            var bdSpy = sinon.stub(UserModel, 'findOne');
            bdSpy.yields(null, currentUser);

            var token = "aToken";

            //Act
            userRepository.updateUserExperience(token, experiencePoints);

            //Assert
            bdSpy.restore();
            expect(JSON.stringify(expectedUser)).to.equal(JSON.stringify(currentUser));
        });

        it("should call save on user", function()
        {
            //Arrange
            var userRepository = new UserRepository();
            var bdSpy = sinon.stub(UserModel, 'findOne');
            var saveSpy = chai.spy.on(currentUser, 'save');
            bdSpy.yields(null, currentUser);

            var token = "aToken";

            //Act
            userRepository.updateUserExperience(token, experiencePoints);

            //Assert
            bdSpy.restore();
            expect(saveSpy).to.have.been.called.exactly(1);
        });

    });

});
