﻿using System.Collections.Generic;
using UnityEngine;

namespace Assets.Scripts.Services.ComboHits
{
    public class ComboHitSequence
    {
        public string Name { get; set; }
        public Rect TriggerZone {get; set;}
        public int TriggerFrequency { get; set; }
        public float MaxFirstHitWaitTime { get; set; }
        public float MaxWaitTimeBetweenHits { get; set; }
        public List<Vector2> HitZones { get; set; }
        public float BonusMultiplier { get; set; }
        public float HitZoneDisplayInterval { get; set; }
        public bool EndOfDisplaySequence
        {
            get
            {
                return currentlyShownHitZoneIndex >= HitZones.Count - 1;
            }
        }
        public bool NextHitZoneReadyToDisplay
        {
            get
            {
                return Time.time - lastHitZoneDisplayTime > HitZoneDisplayInterval;
            }
        }
        public bool EndOfSequence
        {
            get
            {
                return nextHitZoneIndex + 1 >= HitZones.Count;
            }
        }
        public int NextHitZoneIndex
        {
            get
            {
                return nextHitZoneIndex;
            }
        }

        private int nextHitZoneIndex = 0;
        private float triggerStartTime = 0;
        private float lastHitTime = 0;
        private int currentlyShownHitZoneIndex = -1;
        private float lastHitZoneDisplayTime = 0;

        public ComboHitSequence(string name, int triggerFrequency, float bonusMultiplier, Rect triggerZone, float maxFirstHitWaitTime = 2f, float maxWaitTimeBetweenHits = 1f, float hitZoneDisplayInterval = 0.5f)
        {
            this.Name = name;
            this.TriggerFrequency = triggerFrequency;
            this.BonusMultiplier = bonusMultiplier;
            this.TriggerZone = triggerZone;
            this.MaxFirstHitWaitTime = maxFirstHitWaitTime;
            this.MaxWaitTimeBetweenHits = maxWaitTimeBetweenHits;
            this.HitZoneDisplayInterval = hitZoneDisplayInterval;
            this.HitZones = new List<Vector2>();
        }

        public bool IsActivable(Vector2 hitPosition)
        {
            bool frequencyRequirementMatch = UnityEngine.Random.Range(0, TriggerFrequency) == 0;
            bool triggerZoneRequirementMatch = TriggerZone.Contains(hitPosition);
            return frequencyRequirementMatch && triggerZoneRequirementMatch && !IsAlive();
        }

        public virtual void Reset()
        {
            nextHitZoneIndex = 0;
            triggerStartTime = Time.time;
            lastHitTime = 0;
            currentlyShownHitZoneIndex = -1;
        }

        public bool IsAlive()
        {
            bool firstHitWaitTimeElapsed = nextHitZoneIndex == 0 && Time.time - triggerStartTime > MaxFirstHitWaitTime;
            bool nextHitWaitTimeElapsed = nextHitZoneIndex > 0 && Time.time - lastHitTime > MaxWaitTimeBetweenHits;

            return !firstHitWaitTimeElapsed && !nextHitWaitTimeElapsed;
        }

        public Vector2 GetNextHitZoneLocationToDisplay()
        {
            if (!EndOfDisplaySequence) {
                currentlyShownHitZoneIndex++;
            }
            lastHitZoneDisplayTime = Time.time;
            return HitZones[currentlyShownHitZoneIndex];
        }

        public void MoveNext()
        {
            lastHitTime = Time.time;
            nextHitZoneIndex++;
        }
    }
}