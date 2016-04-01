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
            Int32 bossCreationDate = Int32.Parse(this.dateStarted.Replace("0000", "0"));
            Int32 now = (Int32)(DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
            return ((now - bossCreationDate)/60).ToString();
        }
    }
}