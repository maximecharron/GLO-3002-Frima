using Assets.Scripts.Services.Communication.DTOs.Inbound;

namespace Assets.Scripts.Services.ComboHits
{
    class ComboHitSequenceFactory
    {
        public ComboHitSequence Create(ComboHitSequenceDTO comboHitSequenceDTO)
        {
            ComboHitSequence hitSequence = new ComboHitSequence(comboHitSequenceDTO.name, comboHitSequenceDTO.triggerFrequency, comboHitSequenceDTO.bonusMultiplier, comboHitSequenceDTO.triggerZone.ToRect());
            hitSequence.HitZones = comboHitSequenceDTO.hitZones;
            return hitSequence;
        }
    }
}
