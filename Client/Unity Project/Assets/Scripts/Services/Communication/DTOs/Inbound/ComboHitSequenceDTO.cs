using System;
using System.Collections.Generic;
using UnityEngine;

namespace Assets.Scripts.Services.Communication.DTOs.Inbound
{
    [Serializable]
    public class ComboHitSequenceDTO
    {
        public string name = "";
        public int triggerFrequency = 1;
        public float bonusMultiplier = 1f;
        public RectDTO triggerZone = new RectDTO(-0.5f, -0.5f, 1f, 1f);
        public float maxFirstHitWaitTime = 2f;
        public float maxWaitTimeBetweenHits = 1f;
        public List<Vector2> hitZones = new List<Vector2>();
    }
}
