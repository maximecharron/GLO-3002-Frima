angular.module('CMS.item').controller("item-controller", function ($scope, itemResource)
{

    $scope.items;
    $scope.selectedItem;
    $scope.newItemCreated = false;
    $scope.isUpdating = false;
    $scope.isLoading = true;


    $scope.initializeItems = function ()
    {
        $scope.isLoading = true;
        itemResource.getItems(function (result)
        {
            $scope.isLoading = false;
            $scope.items = result;
        })
    };

    $scope.newItem = function ()
    {
        $scope.newItemCreated = true;
        $scope.selectedItem = {
            name: "",
            type: 0,
            subType: 0,
            quantity: 0,
            staminaRegeneration: 0,
            hypeGeneration: 0,
            effectDuration: 0
        };
    };

    $scope.itemChanged = function (selectedItem)
    {
        $scope.newItemCreated = false;
        $scope.selectedItem = selectedItem;
    };

    $scope.updateItem = function (selectedItem)
    {
        $scope.isUpdating = true;
        $scope.selectedItem = selectedItem;
        if ($scope.newItemCreated)
        {
            itemResource.newItem($scope.selectedItem, function onSuccess(data)
            {
                $scope.selectedItem = data;
                $scope.newItemCreated =false;
                $scope.updateSuccess = true;
                $scope.isUpdating = false;
            }, function onError(data)
            {
                $scope.updateError = true;
            });
        } else
        {
            itemResource.updateItem($scope.selectedItem, function onSuccess(data)
            {
                $scope.selectedItem = data;
                $scope.updateSuccess = true;
                $scope.isUpdating = false;
            }, function onError(data)
            {
                $scope.isUpdating = false;
                $scope.updateError = true;
            });
        }
    };

    $scope.deleteItem = function (selectedItem)
    {
        $scope.isUpdating = true;
        $scope.items.forEach(function (item, index)
        {
            if (item.name == $scope.selectedItem.name)
            {
                $scope.items.splice(index, 1);
            }
        });

        itemResource.deleteItem({
            "id": $scope.selectedItem.id
        }, function ()
        {
            $scope.isUpdating = false;
            $scope.deleteSuccess = true;
        });
        $scope.selectedItem = null;
    };
    $scope.initializeItems();
});
