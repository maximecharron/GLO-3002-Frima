var self;
//Constructor
function UpdateService(bossRepository, bossCommunicationService, bossService, redisCommunicationService)
{
    this.bossRepository = bossRepository;
    this.bossCommunicationService = bossCommunicationService;
    this.bossService = bossService;
    this.redisCommunicationService = redisCommunicationService;
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
            self.bossService.saveBossDataBase();
        } catch (error)
        {
            console.log("Problem with interval saveBossToMongo :", error);
        }

    }, 9000
);

setInterval(function ()
    {
        try
        {
            self.redisCommunicationService.getBossCurrentLife(function(err, object){
                if(err)
                {
                    console.log("Problem to getCurrentBossLife on redisCommunicationService: ", err);
                }
                else{
                    var actualBoss = self.bossService.getCurrentBoss();;
                    if(actualBoss.getLife() != object)
                    {
                        self.bossService.updateCurrentLife(object);
                        self.bossCommunicationService.broadcastBossInformation(actualBoss);
                    }

                }
            });
        } catch (error)
        {
            console.log("Problem with interval to getCurrentBossLife in redis :", error);
        }

    }, 200
);

module.exports = UpdateService;
