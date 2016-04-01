using System;
using UnityEngine;
using System.Collections;
using UnityEngine.UI;


namespace Assets.Scripts.Scenes.Game
{
    public class TimerService : MonoBehaviour
    {
        private string dateStarted = "";

        void Start()
        {
            DontDestroyOnLoad(this.gameObject);
        }

        void Update()
        {

        }

        public void SetBossStartedDate(string dateStarted)
        {
            this.dateStarted = dateStarted;
        }

        public string calculateTimeAlive()
        {
            DateTime date = DateTime.Parse(this.dateStarted);
            return (DateTime.Now - date).TotalMinutes.ToString();
        }
    }
}