using UnityEngine;
using UnityEngine.UI;
using System.Collections;
using System;
using System.Text.RegularExpressions;

public class Click : MonoBehaviour {

    public Text HPDisplay;
    public long currentHP;
    public long maxHP;
    public WebSocket webSocket;
    private Slider hpSlider;
    private Button bossButton;
    private bool firstHP = true;
    private string serverAddress = "wss://frima-server-1.herokuapp.com";

    void Start(){
        bossButton = GameObject.Find("Click").GetComponent<Button>();
        bossButton.interactable = false;
        hpSlider = GameObject.Find("HPSlider").GetComponent<Slider>();
        hpSlider.value = 0;
        webSocket = new WebSocket(new Uri(serverAddress));
        StartCoroutine(webSocket.Connect());
        InvokeRepeating("KeepConnectionAlive", 1f, 30f);
        InvokeRepeating("UpdateLife", 2f, 0.02f);     
    }

    void UpdateLife(){
        string reply = webSocket.RecvString();
        if (reply != null){
            if (firstHP == true){
                maxHP = Int64.Parse(reply);
                currentHP = maxHP;
                firstHP = false;
                bossButton.interactable = true;
            }
            else{
                currentHP = Int64.Parse(reply);
            }
            HPDisplay.text = currentHP + " HP";
            hpSlider.value = (currentHP * 100) / maxHP;
        }
    }

    public void Clicked(){
        if (currentHP != 0){
            webSocket.SendString("Attack");
        }
    }

    void KeepConnectionAlive(){
        webSocket.SendString("Poke");
    }

}
