function BossCommunicationService()
{}

BossCommunicationService.prototype.createBossStatusUpdate = function (theBoss) {
    return JSON.stringify({
        function: {
            name: "bossStatusUpdate",
            boss: theBoss.toJson()
        }
    });
}

module.exports = BossCommunicationService;
