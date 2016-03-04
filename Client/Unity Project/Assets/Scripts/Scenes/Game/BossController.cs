using UnityEngine;
using UnityEngine.UI;
using System.Collections;

using System;
namespace Assets.Scripts.Scenes.Game
{
    public class BossController : MonoBehaviour {

        public Text healthPointValue;
        public Slider hpSlider;
        private int maxHP = 100;
        private int currentHP;

        // Use this for initialization
        void Start() {
            healthPointValue.text = maxHP.ToString();
            hpSlider.value = 100;
            currentHP = maxHP;
        }

        // Update is called once per frame
        void Update() {
            hpSlider.value = (currentHP * 100) / maxHP;
        }

        void OnMouseDown()
        {
            if(currentHP != 0) {
                currentHP -= 1;
                healthPointValue.text = currentHP.ToString();
            }
        }
    }
}