angular.module('CMS.item').controller("item-controller", function ($scope, itemResource)
{

    $scope.items;
    $scope.selectedItem;

    $scope.initializeItems = function ()
    {
        itemResource.getItems(function(result){
            $scope.items = result;
        })
    };

    $scope.itemChanged = function (selectedItem)
    {
        $scope.selectedItem = JSON.parse(selectedItem);
    };

    $scope.updateItem = function (selectedItem)
    {
        $scope.selectedItem = selectedItem;
        itemResource.updateCombo($scope.selectedItem, function onSuccess(data)
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
});
