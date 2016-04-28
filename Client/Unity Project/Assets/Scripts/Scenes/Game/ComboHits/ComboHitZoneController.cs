using Assets.Scripts.Extensions;
using Assets.Scripts.Utils;
using UnityEngine;
using UnityEngine.UI;

namespace Assets.Scripts.Scenes.Game.ComboHits
{
    [RequireComponent(typeof(AudioSource))]
    [RequireComponent(typeof(Image))]
    public class ComboHitZoneController : MonoBehaviour
    {
        private static float HIT_SOUND_BASE_PITCH = 1f;
        private static float HIT_SOUND_PITCH_INCREMENT_MULTIPLIER = 0.3f;

        // Configurable script parameters
        public float FadeInDuration;
        public float FadeOutDuration;

        public delegate void HitZoneClickedEventHandler(ComboHitZoneController comboHitZoneController);
        public event HitZoneClickedEventHandler OnHitZoneClicked = delegate { };

        public bool Active
        {
            get { return this.gameObject.activeSelf; }
        }

        public float TotalDuration
        {
            get { return FadeInDuration + FadeOutDuration; }
        }

        public float StartTime { get { return startTime; } }
        private float startTime;

        private bool fadingIn;
        private ComboHitFeedbackBubbleController comboHitFeedbackBubbleController;

        // Use this for initialization
        void Start()
        {
            fadingIn = true;
            comboHitFeedbackBubbleController = GetComponentInChildren<ComboHitFeedbackBubbleController>(true);
        }

        void Update()
        {
            Animate();
        }

        void OnMouseDown()
        {
            OnHitZoneClicked(this);
        }

        private void Animate()
        {
            if (Time.time - startTime > TotalDuration)
            {
                SetAlpha(0);
            }
            else if (Time.time - startTime > FadeInDuration)
            {
                SetAlpha(1 - AnimationUtils.LinearTween(Time.time - startTime - FadeInDuration, FadeOutDuration));
            }
            else
            {
                SetAlpha(AnimationUtils.ExponentialEaseOut(Time.time - startTime, FadeInDuration));
            }
        }

        public void PlayHitSound(float sequenceProgress)
        {
            AudioSource audioSource = GetComponent<AudioSource>();
            audioSource.pitch = HIT_SOUND_BASE_PITCH + sequenceProgress * HIT_SOUND_PITCH_INCREMENT_MULTIPLIER;
            audioSource.Play();
        }

        private void SetAlpha(float alpha)
        {
            Image image = GetComponent<Image>();
            image.color = new Color(image.color.r, image.color.g, image.color.b, alpha);
        }

        public void Show(Vector2 position, float zPosition)
        {

            this.transform.localPosition = position.ToVector3(zPosition);
            startTime = Time.time;
            SetAlpha(0);
            this.gameObject.SetActive(true);
        }

        public void Hide()
        {
            this.gameObject.SetActive(false);
        }
    }
}