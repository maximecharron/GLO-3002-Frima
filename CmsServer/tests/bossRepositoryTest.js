var Boss = require('./../models/boss.js').model;
var bossRepository = require('./../repository/bossRepository.js');
var mongoose = require('mongoose');
var mongoUri = 'mongodb://localhost/testFrimaGameServer';
mongoose.connect(mongoUri);
var assert = require('chai').assert;

var currentBoss = new Boss({
  bossName: 'boss',
  constantBossLife: '10000',
  currentBossLife: '10000',
  serverName: 'abc',
  status: '0'
});

var constantBoss = new Boss({
  bossName: 'boss',
  constantBossLife: '10000',
  currentBossLife: '10000',
  serverName: 'abcConstant',
  status: '0'
});

before(function (done)
{
  currentBoss.save(function (err)
  {
    constantBoss.save(function (err)
    {
      done();
    });
  });
});

describe('Boss repository does', function ()
{

  it('get constant boss list', function ()
  {
    bossRepository.findConstantBossList(function (bosses)
    {
      assert.equal(1, bosses.size(), 'Size is not 1.');
      assert.equal(bosses[0].serverName, constantBoss.serverName, 'serverName does not match.');
    });

  });
  it('get current boss list', function ()
  {
    bossRepository.findBossList(function (bosses)
    {
      assert.equal(1, bosses.size(), 'Size is not 1.');
      assert.equal(bosses[0].serverName, currentBoss.serverName, 'serverName does not match.');
    });

  });
  it('find Single Boss', function ()
  {
    bossRepository.findBoss(currentBoss.serverName, function (boss)
    {
      assert.equal(boss.serverName, currentBoss.serverName, 'serverName does not match.');
    });
  });

  it('updates the boss', function (done)
  {
    var bossToUpdate = constantBoss;
    bossToUpdate.constantBossLife = '1';
    bossRepository.updateBoss(bossToUpdate, function (updatedBoss)
    {
      assert.equal(updatedBoss.constantBossLife, bossToUpdate.constantBossLife, 'BossLife not updated');
      done();
    });
  });

});



