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

        public ComboHitSequenceController(UnityObjectPool hitZonePool, UnityObjectPool bonusBubblePool)
        {
            this.hitZonePool = hitZonePool;
            this.bonusBubblePool = bonusBubblePool;
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
                comboHitZoneController.Show(nextComboHitZoneToDisplay);
                hitZones.Add(comboHitZoneController);
            }
            catch (PoolExhaustedException)
            {
                // Intentionally blank
            }
        }

        private void OnHitZoneClickedCallback(ComboHitZoneController hitZoneController)
        {
            if (hitSequence.NextHitZoneIndex == hitZones.IndexOf(hitZoneController))
            {
                if (hitSequence.EndOfSequence)
                {
                    ProcessSequenceAchieved();
                    return;
                }
                else {
                    hitSequence.MoveNext();
                }
            }
            OnHitZoneClicked(hitZoneController);
        }

        private void ProcessSequenceAchieved()
        {
            ShowBonusBubble();
            OnSequenceAchieved(hitSequence);
            TerminateSequence();
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
    }
}