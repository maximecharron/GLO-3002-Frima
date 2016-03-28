using Assets.Scripts.CharacterControl;
using Assets.Scripts.Extensions;
using Assets.Scripts.Utils.UnityObjectPool;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.Scenes.Game
{
    public class BossHitFeedbackController : MonoBehaviour
    {
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
            ShowHitBubble(hitValue);
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

        private void ShowHitBubble(int hitValue)
        {
            try
            {
                GameObject hitBubble = (GameObject)hitBubblePool.GetNext();
                BubbleController hitBubbleController = hitBubble.GetComponent<BubbleController>();
                hitBubbleController.Show(Camera.main.GetMousePosition(), hitValue + "!");
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

    }
}
