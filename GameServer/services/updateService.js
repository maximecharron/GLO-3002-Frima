function UpdateService(bossRepository, bossCommunicationService, bossService)
{
    this.bossRepository = bossRepository;
    this.bossCommunicationService = bossCommunicationService;
    this.bossService = bossService;
    var self = this;
    setInterval(function ()
        {
            self.bossCommunicationService.broadcastBossInformation(self.bossService.getCurrentBoss());
        }, 100
    );

    setInterval(function ()
        {
            self.bossRepository.saveBossBd(self.bossService.getCurrentBoss());
        }, 9000
    );
};

module.exports = UpdateService;