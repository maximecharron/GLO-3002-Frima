using UnityEngine;
using System.Collections;
using Assets.Scripts.Utils.UnityObjectPool;
using System.Collections.Generic;
using Assets.Scripts.Extensions;
using System;

namespace Assets.Scripts.Scenes.Game.Combos
{
    public class ComboHitSequenceController
    {
        private const int GREEN_TEXT_COLOR_MULTIPLIER = 2;
        private const int BLUE_TEXT_COLOR_MULTIPLIER = 3;
        private const int RED_TEXT_COLOR_MULTIPLIER = 5;
        private const int ORANGE_TEXT_COLOR_MULTIPLIER = 10;

        public Action<ComboHitZoneController> OnHitZoneClicked { get; set; }
        public Action<ComboHitSequence> OnSequenceAchieved { get; set; }
        public Action<ComboHitSequence> OnSequenceTerminated {get; set;}

        private List<ComboHitZoneController> hitZones = new List<ComboHitZoneController>();
        private ComboHitSequence hitSequence = null;
        public ComboHitSequence HitSequence
        {
            get
            {
                return hitSequence;
            }
        }
        private bool isActive = false;
        public bool IsActive
        {
            get
            {
                return isActive;
            }
        }
        private UnityObjectPool hitZonePool;
        private UnityObjectPool bonusBubblePool;
        private UnityObjectPool hitFeedbackBubblePool;
        private float baseHitZoneZPosition;

        public ComboHitSequenceController(UnityObjectPool hitZonePool, UnityObjectPool bonusBubblePool, UnityObjectPool hitFeedbackBubblePool, float baseHitZoneZPosition)
        {
            this.hitZonePool = hitZonePool;
            this.bonusBubblePool = bonusBubblePool;
            this.hitFeedbackBubblePool = hitFeedbackBubblePool;
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
                Vector2 nextComboHitZoneToDisplay = hitSequence.GetNextHitZoneToDisplay();
                GameObject comboHitZone = (GameObject)hitZonePool.GetNext();
                ComboHitZoneController comboHitZoneController = comboHitZone.GetComponent<ComboHitZoneController>();
                comboHitZoneController.OnHitZoneClicked = OnHitZoneClickedCallback;
                comboHitZoneController.Show(nextComboHitZoneToDisplay, baseHitZoneZPosition * hitSequence.HitZones.Count - hitSequence.NextHitZoneIndex);
                hitZones.Add(comboHitZoneController);
            }
            catch (PoolExhaustedException)
            {
                // Intentionally blank
            }
        }

        private void OnHitZoneClickedCallback(ComboHitZoneController hitZoneController)
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

        private Color GetBonusTextColor(int bonusMultiplier)
        {
            if (bonusMultiplier <= GREEN_TEXT_COLOR_MULTIPLIER)
            {
                return new Color(0, 148f / 255f, 0);
            }
            else if (bonusMultiplier <= BLUE_TEXT_COLOR_MULTIPLIER)
            {
                return new Color(11f / 255f, 0, 148f / 255f);
            }
            else if (bonusMultiplier <= RED_TEXT_COLOR_MULTIPLIER)
            {
                return new Color(1, 0, 0);
            }
            else if (bonusMultiplier <= ORANGE_TEXT_COLOR_MULTIPLIER)
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