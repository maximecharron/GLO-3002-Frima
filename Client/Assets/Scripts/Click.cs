using UnityEngine;
using UnityEngine.UI;
using System.Collections;
using System;
using System.Text.RegularExpressions;

public class Click : MonoBehaviour {

    public Text HPDisplay;
    public long currentHP;
    public long maxHP = 10000000000;
    private Slider slider;
    public WebSocket w;

    void Start()
    {
        currentHP = maxHP;
        slider = GameObject.Find("HPSlider").GetComponent<Slider>();
        w = new WebSocket(new Uri("ws://frima-server-1.herokuapp.com"));
        StartCoroutine(w.Connect());
    }

    void Update()
    {
        string reply = w.RecvString();
        if (reply != null)
        {
            string hp = Regex.Match(reply, @"\d+").Value;
            currentHP = Int64.Parse(hp);
        }
        HPDisplay.text = currentHP + " HP";
        slider.value = (currentHP * 100) / maxHP;
    }


    public void Clicked()
    {
        if (currentHP != 0)
        {
            w.SendString("Meurt");
        }
    }

}
