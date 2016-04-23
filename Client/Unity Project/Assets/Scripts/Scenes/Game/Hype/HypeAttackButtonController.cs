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
        public delegate void HypeAttackButtonClickedEventHandler();
        public event HypeAttackButtonClickedEventHandler OnButtonClicked = delegate { };

        void Start()
        {
            this.gameObject.SetActive(false);
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
    }
}
