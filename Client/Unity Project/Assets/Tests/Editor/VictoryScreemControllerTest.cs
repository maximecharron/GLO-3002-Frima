using UnityEngine;
using UnityEditor;
using NUnit.Framework;


namespace Assets.Scripts
{

    public class VictoryScreemControllerTest
    {

        VictoryScreenController victoryScreenController;

        [Test]
        public void basicTestVictoryScreemController()
        {

            //Arrange
            var gameObject = new GameObject();
            gameObject.AddComponent<VictoryScreenController>();
            victoryScreenController = gameObject.GetComponent<VictoryScreenController>();

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
