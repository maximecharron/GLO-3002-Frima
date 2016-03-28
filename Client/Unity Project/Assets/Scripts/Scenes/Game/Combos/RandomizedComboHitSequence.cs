using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using Assets.Scripts.Utils.UnityObjectPool;
using System;
using Assets.Scripts.Extensions;

namespace Assets.Scripts.Scenes.Game.Combos
{
    public class RandomizedComboHitSequence : ComboHitSequence
    {
        public Rect RandomizationBounds { get; set; }
        public int RandomHitZoneCount { get; set; }

        public RandomizedComboHitSequence(Rect randomizationBounds, int randomHitZoneCount, int triggerFrequency, int bonusMultiplier, Rect triggerZone, float maxFirstHitWaitTime = 2f, float maxWaitTimeBetweenHits = 1f, float hitZoneDisplayInterval = 0.5f) :
            base(triggerFrequency, bonusMultiplier, triggerZone, maxFirstHitWaitTime, maxWaitTimeBetweenHits, hitZoneDisplayInterval)
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