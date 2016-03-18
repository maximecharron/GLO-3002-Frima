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
        try
        {
            self.bossCommunicationService.broadcastBossInformation(self.bossService.getCurrentBoss());
        } catch (error)
        {
            console.log("Problem with interval broadcastBossInformation :", error);
        }

    }, 100
);

setInterval(function ()
    {
        try
        {
            self.bossRepository.saveBossToMongo(self.bossService.getCurrentBoss());
        } catch (error)
        {
            console.log("Problem with interval saveBossToMongo :", error);
        }

    }, 9000
);

module.exports = UpdateService;
