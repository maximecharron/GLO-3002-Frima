using UnityEngine;
using System.Collections;

namespace Assets.Scripts.Scenes.Game.Hype
{
    public class HypeHitExplosionController : MonoBehaviour {
        public void Explode()
        {
            ParticleSystem[] particleSystems = this.GetComponentsInChildren<ParticleSystem>();
            foreach (ParticleSystem particleSystem in particleSystems)
            {
                particleSystem.Play();
            }
        }
    }
}