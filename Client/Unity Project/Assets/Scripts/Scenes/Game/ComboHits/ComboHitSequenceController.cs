﻿using Assets.Scripts.Extensions;
using Assets.Scripts.Services.ComboHits;
using Assets.Scripts.Utils.UnityObjectPool;
using System.Collections.Generic;
using UnityEngine;

namespace Assets.Scripts.Scenes.Game.ComboHits
{
    public class ComboHitSequenceController
    {
        public event ComboHitZoneController.HitZoneClickedEventHandler OnHitZoneClicked = delegate { };
        public delegate void SequenceAchievedEventHandler(ComboHitSequence comboHitSequence);
        public event SequenceAchievedEventHandler OnSequenceAchieved = delegate { };
        public delegate void SequenceTerminatedEventHandler(ComboHitSequence comboHitSequence);
        public event SequenceTerminatedEventHandler OnSequenceTerminated = delegate { };

        private List<ComboHitZoneController> hitZones = new List<ComboHitZoneController>();
        private ComboHitSequence hitSequence = null;
        public ComboHitSequence HitSequence
        {
            get
            {
                return hitSequence;
            }
        }
        
        public bool IsActive { get { return isActive; } }
        private bool isActive = false;
        private UnityObjectPool hitZonePool;
        private UnityObjectPool bonusBubblePool;
        private UnityObjectPool hitFeedbackBubblePool;
        private GameObject boss;
        private Canvas canvas;
        private float baseHitZoneZPosition;

        public ComboHitSequenceController(UnityObjectPool hitZonePool, UnityObjectPool bonusBubblePool, UnityObjectPool hitFeedbackBubblePool, GameObject boss, Canvas canvas, float baseHitZoneZPosition)
        {
            this.hitZonePool = hitZonePool;
            this.bonusBubblePool = bonusBubblePool;
            this.hitFeedbackBubblePool = hitFeedbackBubblePool;
            this.boss = boss;
            this.canvas = canvas;
            this.baseHitZoneZPosition = baseHitZoneZPosition;
        }

        public void ShowSequence(ComboHitSequence hitSequence)
        {
            this.hitSequence = hitSequence;
            this.hitSequence.Reset();
            this.isActive = true;
        }

        public void Update()
        {
            if (!hitSequence.IsAlive())
            {
                TerminateSequence();
            }
            else {
                ShowHitZones();
            }
        }

        private void TerminateSequence()
        {
            foreach (ComboHitZoneController hitZone in hitZones)
            {
                hitZone.Hide();
            }
            hitZones.Clear();
            isActive = false;
            OnSequenceTerminated(hitSequence);
        }

        private void ShowHitZones()
        {
            if (!hitSequence.EndOfDisplaySequence && hitSequence.NextHitZoneReadyToDisplay)
            {
                ShowNextHitZone();
            }
        }

        private void ShowNextHitZone()
        {
            try
            {
                GameObject comboHitZone = (GameObject)hitZonePool.GetNext();
                Vector2 localPosition = boss.Translate(hitSequence.GetNextHitZoneLocationToDisplay(), canvas.gameObject);
                ComboHitZoneController comboHitZoneController = comboHitZone.GetComponent<ComboHitZoneController>();
                comboHitZoneController.OnHitZoneClicked -= HitZoneClickedEventHandler;
                comboHitZoneController.OnHitZoneClicked += HitZoneClickedEventHandler;
                comboHitZoneController.Show(localPosition, baseHitZoneZPosition * hitSequence.HitZones.Count - hitSequence.NextHitZoneIndex);
                hitZones.Add(comboHitZoneController);
            }
            catch (PoolExhaustedException)
            {
                // Intentionally blank
            }
        }

        private void HitZoneClickedEventHandler(ComboHitZoneController hitZoneController)
        {
            OnHitZoneClicked(hitZoneController);
            if (hitSequence.NextHitZoneIndex == hitZones.IndexOf(hitZoneController))
            {
                if (hitSequence.EndOfSequence)
                {
                    ProcessSequenceAchieved();
                }
                ProcessHitZoneClicked(hitZoneController);
            }
        }

        private void ProcessHitZoneClicked(ComboHitZoneController hitZoneController)
        {
            ShowHitFeedbackText();
            hitZoneController.PlayHitSound((float)hitSequence.NextHitZoneIndex / hitSequence.HitZones.Count);
            hitSequence.MoveNext();
        }

        private void ProcessSequenceAchieved()
        {
            ShowBonusBubble();
            OnSequenceAchieved(hitSequence);
        }

        private void ShowBonusBubble()
        {
            try
            {
                GameObject comboBonusBubble = (GameObject)bonusBubblePool.GetNext();
                ComboBonusBubbleController comboBonusBubbleController = comboBonusBubble.GetComponent<ComboBonusBubbleController>();
                Color bonusTextColor = GetBonusTextColor(hitSequence.BonusMultiplier);
                comboBonusBubbleController.Show(Camera.main.GetMousePosition(), hitSequence.BonusMultiplier, bonusTextColor);
            }
            catch (PoolExhaustedException)
            {
                // Intentionally blank
            }
        }

        private Color GetBonusTextColor(float bonusMultiplier)
        {
            if (bonusMultiplier <= 2)
            {
                return new Color(0, 148f / 255f, 0);
            }
            else if (bonusMultiplier <= 3)
            {
                return new Color(11f / 255f, 0, 148f / 255f);
            }
            else if (bonusMultiplier <= 4)
            {
                return new Color(1, 0, 0);
            }
            else if (bonusMultiplier <= 10)
            {
                return new Color(1, 111f / 255f, 0);
            }
            else
            {
                return new Color(1, 0, 153f / 255f);
            }
        }

        private void ShowHitFeedbackText()
        {
            try
            {
                GameObject hitFeedbackBubble = (GameObject)hitFeedbackBubblePool.GetNext();
                ComboHitFeedbackBubbleController hitFeedbackBubbleController = hitFeedbackBubble.GetComponent<ComboHitFeedbackBubbleController>();
                hitFeedbackBubbleController.Show(Camera.main.GetMousePosition(), hitSequence.NextHitZoneIndex + 1);
            }
            catch (PoolExhaustedException)
            {
                // Intentionally blank
            }
        }
    }
}