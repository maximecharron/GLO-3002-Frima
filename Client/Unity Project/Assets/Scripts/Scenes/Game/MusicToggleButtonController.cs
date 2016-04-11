using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;
using UnityEngine.UI;

namespace Assets.Scripts.Scenes.Game
{
    class MusicToggleButtonController : MonoBehaviour
    {
        // Configurable script parameters
        public Sprite MusicOnImage;
        public Sprite MusicOffImage;

        public void OnButtonClick()
        {
            GameController gameController = FindObjectOfType<GameController>();
            AudioSource audioSource = gameController.GetComponent<AudioSource>();
            audioSource.enabled = !audioSource.enabled;
            Image image = this.GetComponent<Image>();
            image.sprite = audioSource.enabled ? MusicOnImage : MusicOffImage;
        }
    }
}
