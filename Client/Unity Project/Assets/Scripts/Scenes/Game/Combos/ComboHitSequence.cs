using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using Assets.Scripts.Utils.UnityObjectPool;
using System;

namespace Assets.Scripts.Scenes.Game.Combos
{
    public class ComboHitSequence
    {

        public Rect TriggerZone {get; set;}
        public float TriggerFrequency { get; set; }
        public float MaxFirstHitWaitTime { get; set; }
        public float MaxWaitTimeBetweenHits { get; set; }
        public List<Vector2> HitZones { get; set; }
        public float HitZoneSizeScale { get; set; }
        public float BonusMultiplier { get; set; }
        public float HitZoneDisplayInterval { get; set; }
        public Action<ComboHitSequence> OnHitSequenceAchieved { get; set; }
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
                return !(Time.time - lastHitZoneDisplayTime > HitZoneDisplayInterval);
            }
        }

        private int nextHitZoneIndex = 0;
        private int triggerHitCount = 0;
        private float triggerStartTime = 0;
        private float lastHitTime = 0;
        private int currentlyShownHitZoneIndex = -1;
        private float lastHitZoneDisplayTime = 0;

        public bool IsActivable(Vector2 hitPosition)
        {
            triggerHitCount++;
            bool frequencyRequirementMatch = TriggerZone.Contains(hitPosition) && triggerHitCount >= TriggerFrequency;
            return frequencyRequirementMatch && !IsAlive();
        }

        public void Reset()
        {
            nextHitZoneIndex = 0;
            triggerHitCount = 0;
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

        public void Hit(Vector2 hitPosition)
        {
            if (IsHitInZone(hitPosition))
            {
                MoveNext();
            }
        }

        private bool IsHitInZone(Vector2 hitPosition)
        {
            return true;
        }

        private void MoveNext()
        {
            if (nextHitZoneIndex > HitZones.Count)
            {
                OnHitSequenceAchieved(this);
            }
        }

        public Vector2 GetNextHitZoneToDisplay()
        {
            if (!EndOfDisplaySequence) {
                currentlyShownHitZoneIndex++;
            }
            lastHitZoneDisplayTime = Time.time;
            return HitZones[currentlyShownHitZoneIndex];
        }
    }
}