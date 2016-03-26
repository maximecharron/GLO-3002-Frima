using UnityEngine;
using System.Collections;
using Assets.Scripts.Utils.UnityObjectPool;

namespace Assets.Scripts.Scenes.Game.Combos
{
    public class ComboHitController : MonoBehaviour
    {

        //Configurable script parameters
        public GameObject ComboHitZone;
        public int ComboHitZonePoolSize = 5;

        private UnityObjectPool comboHitZonePool;

        void Start()
        {
            this.ComboHitZone.SetActive(false);
            this.comboHitZonePool = new UnityObjectPool(ComboHitZone, ComboHitZonePoolSize);
            this.comboHitZonePool.OnCheckIsAvailable = CheckComboHitZonePoolItemAvailable;
        }

        private bool CheckComboHitZonePoolItemAvailable(UnityEngine.Object unityObject)
        {
            ComboHitZoneController comboHitZoneController = ((GameObject)unityObject).GetComponent<ComboHitZoneController>();
            return !comboHitZoneController.Active;
        }
    }
}