using Assets.Scripts.CharacterControl;
using Assets.Scripts.Extensions;
using Assets.Scripts.Utils.UnityObjectPool;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.Scenes.Game.Boss
{
    public class BossHitFeedbackController : MonoBehaviour
    {
        private static Color HIT_BUBBLE_TEXT_COLOR = Color.black;
        private static Color HIT_MISS_BUBBLE_TEXT_COLOR = Color.red;

        //Configurable script parameters
        public GameObject HitParticleSystem;
        public int ParticleSystemPoolSize = 5;
        public GameObject HitBubble;
        public int AudioSourcePoolSize = 10;
        public AudioClip[] AudioClips;
        public int HitBubblePoolSize = 5;

        private UnityObjectPool particleSystemPool;
        private UnityObjectPool audioSourcePool;
        private UnityObjectPool hitBubblePool;

        void Start()
        {
            this.particleSystemPool = new UnityObjectPool(HitParticleSystem, ParticleSystemPoolSize);
            this.particleSystemPool.OnCheckIsAvailable = IsParticlePoolItemAvailableCallback;
            this.audioSourcePool = new UnityObjectPool(this.gameObject, typeof(AudioSource), AudioSourcePoolSize);
            this.audioSourcePool.OnCheckIsAvailable = IsAudioSourcePoolItemAvailableCallback;
            this.HitBubble.SetActive(false);
            this.hitBubblePool = new UnityObjectPool(HitBubble, HitBubblePoolSize);
            this.hitBubblePool.OnCheckIsAvailable = IsHitBubblePoolItemAvailableCallback;
        }

        public void Hit(int hitValue)
        {
            PlayParticles();
            PlayHitSound();
            ShowHitBubble(string.Format("{0}!", hitValue), HIT_BUBBLE_TEXT_COLOR);
        }

        public void HitMiss()
        {
            ShowHitBubble("Miss!", HIT_MISS_BUBBLE_TEXT_COLOR);
        }

        private void PlayParticles()
        {
            try
            {
                GameObject gameObject = (GameObject)particleSystemPool.GetNext();
                ParticleSystem particleSystem = gameObject.GetComponent<ParticleSystem>();
                particleSystem.startColor = UnityEngine.Random.ColorHSV();
                particleSystem.transform.position = Camera.main.GetMousePosition().ToVector3(HitParticleSystem.transform.position.z);
                particleSystem.PlayEnable();
            }
            catch (PoolExhaustedException)
            {
                // Intentionally blank
            }
        }

        private bool IsParticlePoolItemAvailableCallback(UnityEngine.Object unityObject)
        {
            ParticleSystem particleSystem = ((GameObject)unityObject).GetComponent<ParticleSystem>();
            return !particleSystem.IsAlive();
        }

        private void PlayHitSound()
        {
            try {
                AudioSource audioSource = (AudioSource)audioSourcePool.GetNext();
                int randomAudioClipIndex = Convert.ToInt32(UnityEngine.Random.Range(0, AudioClips.Length));
                audioSource.PlayAudioClip(AudioClips[randomAudioClipIndex]);
            }
            catch (PoolExhaustedException)
            {
                // Intentionally blank
            }
        }

        private bool IsAudioSourcePoolItemAvailableCallback(UnityEngine.Object unityObject)
        {
            return !((AudioSource)unityObject).isPlaying;
        }

        private void ShowHitBubble(string text, Color textColor)
        {
            try
            {
                GameObject hitBubble = (GameObject)hitBubblePool.GetNext();
                BubbleController bubbleController = hitBubble.GetComponent<BubbleController>();
                bubbleController.Show(Camera.main.GetMousePosition(), text, textColor);
            }
            catch (PoolExhaustedException)
            {
                // Intentionally blank
            }
        }

        private bool IsHitBubblePoolItemAvailableCallback(UnityEngine.Object unityObject)
        {
            BubbleController hitBubbleController = ((GameObject)unityObject).GetComponent<BubbleController>();
            return !hitBubbleController.Active;
        }

        public void HypeAttack()
        {
            
        }

    }
}
