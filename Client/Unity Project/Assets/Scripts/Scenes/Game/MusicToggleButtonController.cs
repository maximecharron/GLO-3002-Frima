using Assets.Scripts.Services;
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
        public GameSceneController gameSceneController;

        public void OnButtonClick()
        {
            gameSceneController.AudioEnabled = !gameSceneController.AudioEnabled;
            Image image = this.GetComponent<Image>();
            image.sprite = gameSceneController.AudioEnabled ? MusicOnImage : MusicOffImage;
        }
    }
}
