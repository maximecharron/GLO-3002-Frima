using UnityEngine;
using System.Collections;
using Assets.Scripts.Utils.UnityObjectPool;
using System.Collections.Generic;
using Assets.Scripts.Extensions;

namespace Assets.Scripts.Scenes.Game.Combos
{
    public class ComboHitController : MonoBehaviour
    {

        //Configurable script parameters
        public GameObject ComboHitZone;
        public int ComboHitZonePoolSize = 5;

        private List<ComboHitSequence> comboHitSequences = new List<ComboHitSequence>();
        private ComboHitSequence activeComboHitSequence = null;
        private UnityObjectPool comboHitZonePool;

        void Start()
        {
            this.ComboHitZone.SetActive(false);
            this.comboHitZonePool = new UnityObjectPool(ComboHitZone, ComboHitZonePoolSize);
            this.comboHitZonePool.OnCheckIsAvailable = IsComboHitZonePoolItemAvailableCallback;
            createHitSequences();
        }

        private void createHitSequences()
        {
            ComboHitSequence hitSequence1 = new ComboHitSequence();
            hitSequence1.TriggerZone = new Rect(-0.5f, -0.5f, 0, 0);
            hitSequence1.TriggerFrequency = 0.5f;
            hitSequence1.MaxFirstHitWaitTime = 2;
            hitSequence1.MaxWaitTimeBetweenHits = 0.5f;
            hitSequence1.HitZoneSizeScale = 1f;
            hitSequence1.BonusMultiplier = 2;
            hitSequence1.HitZones = new List<Vector2>() { new Vector2(-0.5f, 0), new Vector2(0.5f, 0) };
            hitSequence1.OnHitSequenceAchieved = OnHitSequenceAchievedCallback;
            comboHitSequences.Add(hitSequence1);
        }

        void Update()
        {
            if (activeComboHitSequence != null && !activeComboHitSequence.IsAlive())
            {
                activeComboHitSequence = null;
            }
            if (activeComboHitSequence != null)
            {
                ShowActiveSequenceHitZones();
            }
        }

        public void Hit(Vector2 hitPosition)
        {
            if (activeComboHitSequence == null)
            {
                List<ComboHitSequence> eligibleComboHitSeqences = TryGetNextComboHitSequence(hitPosition);
                if (eligibleComboHitSeqences.Count > 0) {
                    activeComboHitSequence = eligibleComboHitSeqences.RandomItem();
                    activeComboHitSequence.Reset();
                }
            }
            else
            {
                activeComboHitSequence.Hit(hitPosition);
            }
        }

        public List<ComboHitSequence> TryGetNextComboHitSequence(Vector2 hitPosition)
        {
            List<ComboHitSequence> eligibleComboHitSeqences = new List<ComboHitSequence>();
            foreach (ComboHitSequence comboHitSequence in comboHitSequences)
            {
                if (comboHitSequence.IsActivable(hitPosition))
                {
                    eligibleComboHitSeqences.Add(comboHitSequence);
                }
            }
            return eligibleComboHitSeqences;
        }

        private bool IsComboHitZonePoolItemAvailableCallback(UnityEngine.Object unityObject)
        {
            ComboHitZoneController comboHitZoneController = ((GameObject)unityObject).GetComponent<ComboHitZoneController>();
            return !comboHitZoneController.Active;
        }

        private void ShowActiveSequenceHitZones()
        {
            if (!activeComboHitSequence.EndOfDisplaySequence && activeComboHitSequence.NextHitZoneReadyToDisplay)
            {
                Vector2 nextComboHitZoneToDisplay = activeComboHitSequence.GetNextHitZoneToDisplay();
                GameObject comboHitZone = (GameObject)comboHitZonePool.GetNext();
                ComboHitZoneController comboHitZoneController = comboHitZone.GetComponent<ComboHitZoneController>();
                comboHitZoneController.Show(nextComboHitZoneToDisplay);
            }
        }

        private void OnHitSequenceAchievedCallback(ComboHitSequence hitSequence)
        {

        }
    }
}