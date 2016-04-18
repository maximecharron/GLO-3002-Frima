using Assets.Scripts.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;
using UnityEngine.UI;

namespace Assets.Scripts.Scenes.Game
{
    [RequireComponent(typeof(Image))]
    class MusicToggleButtonController : MonoBehaviour
    {
        // Configurable script parameters
        public Sprite MusicOnImage;
        public Sprite MusicOffImage;
        public GameSceneController gameSceneController;

        public void OnButtonClick()
        {
            gameSceneController.AudioMuted = !gameSceneController.AudioMuted;
            Image image = GetComponent<Image>();
            image.sprite = gameSceneController.AudioMuted ? MusicOffImage : MusicOnImage;
        }
    }
}
