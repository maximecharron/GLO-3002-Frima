var self;
//Constructor
function UpdateService(bossRepository, bossCommunicationService, bossService)
{
    this.bossRepository = bossRepository;
    this.bossCommunicationService = bossCommunicationService;
    this.bossService = bossService;
    self = this;

}

//Private method
setInterval(function ()
    {
        self.bossCommunicationService.broadcastBossInformation(self.bossService.getCurrentBoss());
    }, 100
);

setInterval(function ()
    {
        self.bossRepository.saveBossToMongo(self.bossService.getCurrentBoss());
    }, 9000
);

module.exports = UpdateService;
