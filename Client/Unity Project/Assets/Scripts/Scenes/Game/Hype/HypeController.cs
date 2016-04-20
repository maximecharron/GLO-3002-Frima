using System;
using UnityEngine;
using System.Collections;
using Assets.Scripts.Scenes.Game.Combos;
using Assets.Scripts.Scenes.Game.Stamina;
using UnityEngine.UI;
using Assets.Scripts.Services;
using Assets.Scripts.Scenes.Game.LootItems;
using Assets.Scripts.Services.LootItems;

namespace Assets.Scripts.Scenes.Game.Hype
{
    public class HypeController : MonoBehaviour
    {
        private const float HYPE_INCREASE_ON_HIT = 3f;
        private const float BASE_HYPE_AUTO_DECREASE_VALUE = 0.5f;
        private const float HYPE_AUTO_DECREASE_FREQUENCY_SECONDS = 0.05f;
        private const float HYPE_POWER_AVAILABLE_TIME_SECONDS = 1.5f;

        //Configurable script parameters
        public ComboController ComboController;
        public LootItemController LootItemController;
        public HypeSliderController HypeSliderController;
        public HypeAttackButtonController HypeAttackButtonController;
        public Button adrenalineShotButton;
        public Text remainingAdrenalineShotCountLabel;

        public delegate void HypeAttackEventHandler(int attackValue);
        public event HypeAttackEventHandler OnHypeAttack = delegate { };

        private PlayerPropertyService playerPropertyService;
        private LootItemService lootItemService;
        private GameControlService gameControlService;
        private AdrenalineShot currentAdrenalineShot;
        private float lastHypeAutoDecreaseTimeDelta = 0;
        private float lastMaxHypeReachTimeDelta = 0;
        private bool MaxHypeReached = false;

        void Start()
        {
            playerPropertyService = FindObjectOfType<PlayerPropertyService>();
            gameControlService = FindObjectOfType<GameControlService>();
            lootItemService = FindObjectOfType<LootItemService>();
            ComboController.OnComboHitSequenceCompleted += ComboHitSequenceCompletedEventHandler;
            LootItemController.OnLootItemUsed += LootItemUsedEventHandler;
            LootItemController.OnLootItemEffectExpired += LootItemEffectExpiredEventHandler;
            HypeAttackButtonController.OnButtonClicked += HypeAttackTargetClickedEventHandler;
            UpdateRemainingAdrenalineShotCountText();
        }

        void ComboHitSequenceCompletedEventHandler(ComboHitSequence hitSequence)
        {
            IncreaseHype(hitSequence.BonusMultiplier);
        }

        void Update()
        {
            lastHypeAutoDecreaseTimeDelta += Time.deltaTime;
            lastMaxHypeReachTimeDelta += Time.deltaTime;
            if (HypeSliderController.Value == HypeSliderController.MaxValue && !MaxHypeReached)
            {
                EnableMaxHype();
            }
            else if (lastHypeAutoDecreaseTimeDelta >= HYPE_AUTO_DECREASE_FREQUENCY_SECONDS)
            {
                AutoDecreaseHype();
                lastHypeAutoDecreaseTimeDelta = 0;
            }
        }

        private void AutoDecreaseHype()
        {
            if (!MaxHypeReached || (MaxHypeReached && lastMaxHypeReachTimeDelta > HYPE_POWER_AVAILABLE_TIME_SECONDS))
            {
                float adrenalineShotPowerValue = currentAdrenalineShot != null ? currentAdrenalineShot.HypePowerValue : 1;
                HypeSliderController.Value = Math.Max(0, HypeSliderController.Value - (BASE_HYPE_AUTO_DECREASE_VALUE / playerPropertyService.HypePowerLevel / adrenalineShotPowerValue));
                DisableMaxHype();
            }
        }

        private void EnableMaxHype()
        {
            lastMaxHypeReachTimeDelta = 0;
            MaxHypeReached = true;
            HypeSliderController.SliderFlashEnabled = true;
            HypeAttackButtonController.Show();
        }

        private void DisableMaxHype()
        {
            MaxHypeReached = false;
            HypeSliderController.SliderFlashEnabled = false;
            HypeAttackButtonController.Hide();
        }

        public void IncreaseHype(float multiplier = 1)
        {
            HypeSliderController.Value += Math.Min(HypeSliderController.MaxValue, HYPE_INCREASE_ON_HIT * multiplier);
        }

        public void OnAdrenalineShotButtonClick()
        {
            LootItemController.PickItem(lootItem => lootItem.ItemSubType == LootItemSubType.ADRENALINE_SHOT, "Adrenaline Shots");
        }

        private void LootItemUsedEventHandler(LootItem lootItem)
        {
            if (lootItem.ItemSubType == LootItemSubType.ADRENALINE_SHOT)
            {
                currentAdrenalineShot = (AdrenalineShot)lootItem;
                UpdateRemainingAdrenalineShotCountText();
            }
            adrenalineShotButton.interactable = false;
        }

        private void LootItemEffectExpiredEventHandler(LootItem lootItem)
        {
            currentAdrenalineShot = null;
            adrenalineShotButton.interactable = true;
        }

        private void HypeAttackTargetClickedEventHandler()
        {
            HypeSliderController.Value = 0;
            DisableMaxHype();
            OnHypeAttack(gameControlService.HypeAttackDamage);
        }

        private void UpdateRemainingAdrenalineShotCountText()
        {
            int adrenalineShotCount = lootItemService.GetAvailableItemCount(lootItem => lootItem.ItemSubType == LootItemSubType.ADRENALINE_SHOT);
            remainingAdrenalineShotCountLabel.text = String.Format("x{0}", adrenalineShotCount);
        }
    }

}