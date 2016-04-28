using UnityEngine;

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
