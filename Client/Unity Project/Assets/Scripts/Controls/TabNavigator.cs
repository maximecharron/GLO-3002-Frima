using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

namespace Assets.Scripts.Controls
{
    class TabNavigator : MonoBehaviour
    {
        private EventSystem eventSystem;

        void Start()
        {
            eventSystem = EventSystem.current;
        }

        void Update()
        {
            if (Input.GetKeyDown(KeyCode.Tab) && eventSystem.currentSelectedGameObject != null)
            {
                Selectable next = eventSystem.currentSelectedGameObject.GetComponent<Selectable>().FindSelectableOnDown();
                if (next != null)
                {

                    InputField inputfield = next.GetComponent<InputField>();
                    if (inputfield != null) inputfield.OnPointerClick(new PointerEventData(eventSystem));
                    eventSystem.SetSelectedGameObject(next.gameObject, new BaseEventData(eventSystem));
                }
            }
        }
    }
}
