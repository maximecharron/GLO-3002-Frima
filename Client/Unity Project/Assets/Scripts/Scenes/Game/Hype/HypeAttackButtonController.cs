using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;
using UnityEngine.UI;

namespace Assets.Scripts.Scenes.Game.Hype
{
    public class HypeAttackButtonController : MonoBehaviour
    {
        private static Color originalColor = new Color(1f, 1f, 1f);
        private static Color flashColor = new Color(1f, 0f, 0f);
        private const float FLASH_INTERVAL_SECONDS = 0.1f;

        public delegate void HypeAttackButtonClickedEventHandler();
        public event HypeAttackButtonClickedEventHandler OnButtonClicked = delegate { };

        private DateTime lastFlashTime = DateTime.MinValue;

        void Start()
        {
            this.gameObject.SetActive(false);
        }

        void Update()
        {
            FlashButton();
        }

        public void OnMouseDown()
        {
            OnButtonClicked();
        }

        public void Hide()
        {
            this.gameObject.SetActive(false);
        }

        public void Show()
        {
            this.gameObject.SetActive(true);
        }

        private void FlashButton()
        {
            if (DateTime.Now.Subtract(lastFlashTime).TotalSeconds > FLASH_INTERVAL_SECONDS)
            {
                lastFlashTime = DateTime.Now;
                AlternateButtonColor();
            }
        }

        private void AlternateButtonColor()
        {
            Image image = GetComponent<Image>();
            if (image.color.Equals(flashColor))
            {
                image.color = originalColor;
            }
            else
            {
                image.color = flashColor;
            }
        }

    }
}
