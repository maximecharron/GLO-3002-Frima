using UnityEngine;
using System.Collections;

namespace Assets.Scripts.Scenes.Game.Boss
{
    [RequireComponent(typeof(ParticleSystem))]
    [RequireComponent(typeof(AudioSource))]
    public class BossExplosionController : MonoBehaviour {

        // Configurable script parameters
        public float Multiplier = 1;

        public void Explode()
        {
            PlayParticles();
            PlayAudio();
        }

        private void PlayParticles()
        {
            ParticleSystem[] particleSystems = GetComponentsInChildren<ParticleSystem>();
            foreach (ParticleSystem particleSystem in particleSystems)
            {
                particleSystem.startSize *= Multiplier;
                particleSystem.startSpeed *= Multiplier;
                particleSystem.startLifetime *= Mathf.Lerp(Multiplier, 1, 0.5f);
                particleSystem.Clear();
                particleSystem.Play();
            }
        }

        private void PlayAudio()
        {
            AudioSource audioSource = GetComponent<AudioSource>();
            audioSource.Play();
        }
    }
}