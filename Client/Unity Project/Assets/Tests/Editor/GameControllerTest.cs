using UnityEngine;
using UnityEditor;
using NUnit.Framework;


namespace Assets.Scripts
{
    public class GameControllerTest
    {
        GameController gameController;

        [Test]
        public void basicTest()
        {
            
            //Arrange
            var gameObject = new GameObject();
            gameObject.AddComponent<GameController>();
            gameController = gameObject.GetComponent<GameController>();

            //Act
            //Try to rename the GameObject
            var newGameObjectName = "My game object";
            gameObject.name = newGameObjectName;

            //Assert
            //The object has a new name
            Assert.AreEqual(newGameObjectName, gameObject.name);
        }
    }
}