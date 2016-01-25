using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class Click : MonoBehaviour {

    public Text HPDisplay;
    public int currentHP;
    public int maxHP = 100;
    public int damagePerClick = 1;
    private Slider slider;

    void Start() {
        currentHP = maxHP;
        slider = GameObject.Find("HPSlider").GetComponent<Slider>();
    }

    void Update(){
        HPDisplay.text = currentHP + "/" + maxHP + " HP";
        slider.value = (currentHP * 100) / maxHP;
    }


    public void Clicked(){
        if (currentHP != 0){
            currentHP -= damagePerClick;
        }
    }

}
