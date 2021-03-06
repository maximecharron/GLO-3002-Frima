﻿using Assets.Scripts.Extensions;
using Assets.Scripts.Utils.UnityObjectPool;
using System;
using UnityEngine;

namespace Assets.Scripts.Scenes.Game.Boss
{
    public class BossAttackFeedbackController : MonoBehaviour
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
            this.particleSystemPool = new UnityObjectPool(HitParticleSystem, ParticleSystemPoolSize, IsParticlePoolItemAvailabile);
            this.audioSourcePool = new UnityObjectPool(this.gameObject, typeof(AudioSource), AudioSourcePoolSize, IsAudioSourcePoolItemAvailable);
            this.HitBubble.SetActive(false);
            this.hitBubblePool = new UnityObjectPool(HitBubble, HitBubblePoolSize, IsHitBubblePoolItemAvailable);
        }

        public void ShowAttackFeedback(int hitValue)
        {
            PlayParticles();
            PlayHitSound();
            ShowHitBubble(string.Format("{0}!", hitValue), HIT_BUBBLE_TEXT_COLOR, true);
        }

        public void ShowHitMissFeedback()
        {
            ShowHitBubble("Miss!", HIT_MISS_BUBBLE_TEXT_COLOR, false);
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

        private bool IsParticlePoolItemAvailabile(UnityEngine.Object unityObject)
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

        private bool IsAudioSourcePoolItemAvailable(UnityEngine.Object unityObject)
        {
            return !((AudioSource)unityObject).isPlaying;
        }

        private void ShowHitBubble(string text, Color textColor, bool flyUp)
        {
            try
            {
                GameObject hitBubble = (GameObject)hitBubblePool.GetNext();
                BubbleController bubbleController = hitBubble.GetComponent<BubbleController>();
                bubbleController.Show(Camera.main.GetMousePosition(), text, textColor, flyUp);
            }
            catch (PoolExhaustedException)
            {
                // Intentionally blank
            }
        }

        private bool IsHitBubblePoolItemAvailable(UnityEngine.Object unityObject)
        {
            BubbleController hitBubbleController = ((GameObject)unityObject).GetComponent<BubbleController>();
            return !hitBubbleController.Active;
        }

    }
}
