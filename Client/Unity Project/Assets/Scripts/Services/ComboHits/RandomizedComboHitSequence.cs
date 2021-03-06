﻿using Assets.Scripts.Extensions;
using UnityEngine;

namespace Assets.Scripts.Services.ComboHits
{
    public class RandomizedComboHitSequence : ComboHitSequence
    {
        public Rect RandomizationBounds { get; set; }
        public int RandomHitZoneCount { get; set; }

        public RandomizedComboHitSequence(string name, Rect randomizationBounds, int randomHitZoneCount, int triggerFrequency, int bonusMultiplier, Rect triggerZone, float maxFirstHitWaitTime = 2f, float maxWaitTimeBetweenHits = 1f, float hitZoneDisplayInterval = 0.5f) :
            base(name, triggerFrequency, bonusMultiplier, triggerZone, maxFirstHitWaitTime, maxWaitTimeBetweenHits, hitZoneDisplayInterval)
        {
            this.RandomizationBounds = randomizationBounds;
            this.RandomHitZoneCount = randomHitZoneCount;
        }

        public override void Reset()
        {
            RandomizeHitZones();
            base.Reset();
        }

        private void RandomizeHitZones()
        {
            HitZones.Clear();
            for (int i = 0; i < RandomHitZoneCount; i++)
            {
                HitZones.Add(RandomizationBounds.RandomPoint());
            }
        }

    }
}