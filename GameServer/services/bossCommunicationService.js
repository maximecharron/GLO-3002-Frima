function BossCommunicationService()
{}

BossCommunicationService.prototype.createBossStatusUpdate = function (theBoss) {
    return JSON.stringify({
        command: {
            name: "bossStatusUpdate",
            parameters: theBoss.toJson()
        }
    });
}

module.exports = BossCommunicationService;
