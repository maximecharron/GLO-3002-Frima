angular.module('CMS.item').controller("item-controller", function ($scope, itemResource)
{

    $scope.items;
    $scope.selectedItem;
    $scope.newItem = false;

    $scope.initializeItems = function ()
    {
        itemResource.getItems(function(result){
            $scope.items = result;
        })
    };

    $scope.newItem = function ()
    {
        $scope.selectedItem = {
            name: "",
            type: 0,
            subType: 0,
            quantity: 0,
            staminaRegeneration: 0,
            hypeGeneration: 0,
            effectDuration: 0
        };
        $scope.newItem = true;
    };

    $scope.itemChanged = function (selectedItem)
    {
        $scope.selectedItem = selectedItem;
        $scope.newItem = false;
    };

    $scope.updateItem = function (selectedItem)
    {
        $scope.selectedItem = selectedItem;
        itemResource.updateItem($scope.selectedItem, function onSuccess(data)
        {
            $scope.selectedItem = data;
            $scope.updateSuccess = true;
        }, function onError(data)
        {
            $scope.updateError = true;
        });
    };

    $scope.deleteItem = function (selectedItem)
    {
        $scope.items.forEach(function (item, index)
        {
            if (item.name == $scope.selectedItem.name){
                $scope.items.splice(index, 1);
            }
        });
        $scope.selectedItem = null;

        itemResource.deleteItem(function(){
            $scope.deleteSuccess = true;
        })
    };
    $scope.initializeItems();
});
