angular.module('CMS.combo').controller("combo-controller", function ($scope, comboResource) {
    $scope.combos;
    $scope.selectedCombo;
    $scope.remove = false;
    $scope.triggerZone = false;
    $scope.newComboCreated = false;
    $scope.isUpdating = false;
    $scope.isLoading = true;


    $scope.reset = function () {
        clear();
    };

    $scope.newCombo = function ()
    {
        $scope.newComboCreated = true;
        $scope.selectedCombo = {
            name: "",
            triggerFrequency: 0,
            bonusMultiplier: 0,
            triggerZone: {},
            maxFirstHitWaitTime: 0,
            maxWaitTimeBetweenHits: 0,
            hitZones: []
        };
        init();
    };

    $scope.editTriggerZone = function (boolean) {
        $scope.triggerZone = boolean;
    };

    $scope.initializeCombos = function ()
    {
        comboResource.getCombos(function (result)
        {
            $scope.combos = result;
            $scope.isLoading = false;
        })
    };

    $scope.comboChanged = function ()
    {
        $scope.newComboCreated = false;
        init();
    };

    $scope.updateCombo = function (selectedCombo) {
        $scope.isUpdating = true;
        $scope.selectedCombo = selectedCombo;
        $scope.selectedCombo.triggerZone = triggerZoneCoordinates;
        $scope.selectedCombo.hitZones = transformedCoordinates;
        if ($scope.newComboCreated)
        {
            comboResource.newCombo($scope.selectedCombo, function onSuccess(data)
            {
                $scope.selectedCombo = data;
                $scope.newComboCreated = false;
                $scope.updateSuccess = true;
                $scope.isUpdating = false;
            }, function onError(data)
            {
                $scope.newComboCreated = false;
                $scope.isUpdating = false;
                $scope.updateError = true;
            });
        } else
        {
            comboResource.updateCombo($scope.selectedCombo, function onSuccess(data)
            {
                $scope.selectedCombo = data;
                $scope.updateSuccess = true;
                $scope.isUpdating = false;
            }, function onError(data)
            {
                $scope.isUpdating = false;
                $scope.updateError = true;
            });
        }
    };

    $scope.deleteCombo = function (selectedCombo)
    {
        $scope.combos.forEach(function (combo, index)
        {
            if (combo.name == $scope.selectedCombo.name)
            {
                $scope.combos.splice(index, 1);
            }
        });

        comboResource.deleteCombo({
            "id": $scope.selectedCombo.id
        }, function ()
        {
            $scope.deleteSuccess = true;
        });

        $scope.selectedCombo = null;
    };


    //Drawing functions
    var context;
    var canvas;
    var x, y;
    var d = 10;
    var width;
    var height;
    var color = "black";
    var ratio;
    var triggerZoneCoordinates = {};
    var transformedCoordinates = [];
    var hitZonesPositions = [];
    var triggerZonePosition = {};
    var rect = {};
    var drag = false;
    var firstInit = true;
    var counter = 1;

    function init() {
        canvas = document.getElementById('game');
        context = canvas.getContext('2d');
        width = canvas.width;
        height = canvas.height;
        ratio = 1 / width;
        if (firstInit) {
            context.translate(width / 2, height / 2);
            firstInit = false;
        }
        clear(function () {
            $scope.triggerZone = false;
            if ($scope.selectedCombo) {
                hitZonesPositions = [];
                transformedCoordinates = [];
                $scope.selectedCombo.hitZones.forEach(function (hitZone) {
                    hitZonesPositions.push({
                        x: translateCoordinatesToPixel(hitZone.x),
                        y: -translateCoordinatesToPixel(hitZone.y)
                    });
                    transformedCoordinates.push({
                        x: hitZone.x,
                        y: hitZone.y
                    })
                });
                triggerZonePosition = {
                    x: translateCoordinatesToPixel($scope.selectedCombo.triggerZone.x),
                    y: -translateCoordinatesToPixel($scope.selectedCombo.triggerZone.y),
                    width: translateCoordinatesToPixel($scope.selectedCombo.triggerZone.width),
                    height: translateCoordinatesToPixel($scope.selectedCombo.triggerZone.height)
                };
                triggerZoneCoordinates = {
                    x: $scope.selectedCombo.triggerZone.x,
                    y: $scope.selectedCombo.triggerZone.y,
                    width: $scope.selectedCombo.triggerZone.width,
                    height: $scope.selectedCombo.triggerZone.height
                };
                redraw(true);
            }
            canvas.addEventListener("click", onClick, false);
            canvas.addEventListener('mousedown', mouseDown, false);
            canvas.addEventListener('mouseup', mouseUp, false);
            canvas.addEventListener('mousemove', mouseMove, false);
        });
    }

    function redraw(triggerZone) {
        if (triggerZone) {
            rect.startX = triggerZonePosition.x;
            rect.startY = triggerZonePosition.y;
            rect.width = triggerZonePosition.width;
            rect.height = triggerZonePosition.height;
            drawTriggerZone();
        }
        counter = 1;
        hitZonesPositions.forEach(function (position) {
            x = position.x;
            y = position.y;
            drawCircle();
        });

    }

    function drawCircle() {
        context.beginPath();
        context.fillStyle = "#ffffff";
        context.strokeStyle = color;
        context.arc(x, y, d, 0, Math.PI * 2, true);
        context.lineWidth = 2;
        context.closePath();
        context.fill();
        context.stroke();
        context.font = "14px Arial";
        context.fillStyle = color;
        if (counter < 10) {
            context.fillText(counter, x - 4, y + 4);
        } else {
            context.fillText(counter, x - 8, y + 4);
        }
        counter++;
    }

    function clearTriggerZone(callback) {
        clear(function () {
            redraw(false);
            callback();
        })
    }

    function clear(callback) {
        var image = new Image();
        image.onload = function () {
            context.fillStyle = "#ffffff";
            context.fillRect(-width / 2, -height / 2, width, height);
            context.fillStyle = "#888888";
            context.strokeRect(-width / 2, -height / 2, width, height);

            context.drawImage(image, -width / 2, -height / 2);
            if (callback) {
                callback();
            }
        };
        image.src = "./img/Boss_Sprite_Frame.png";
    }

    function mouseDown(e) {
        var offsetX = width / 2, offsetY = height / 2;
        var element = this;
        if (element.offsetParent) {
            do {
                offsetX += element.offsetLeft;
                offsetY += element.offsetTop;
            } while ((element = element.offsetParent));
        }
        rect.startX = e.pageX - offsetX;
        rect.startY = e.pageY - offsetY;
        drag = true;
    }

    function mouseUp() {
        drag = false;
    }

    function drawTriggerZone() {
        context.strokeStyle = "black";
        context.strokeRect(rect.startX, rect.startY, rect.width, rect.height);
        recordAndTranslateTriggerZoneCoordinates();
    }

    function mouseMove(e) {
        if (drag && $scope.triggerZone) {
            var offsetX = width / 2;
            var offsetY = height / 2;
            var element = this;
            if (element.offsetParent) {
                do {
                    offsetX += element.offsetLeft;
                    offsetY += element.offsetTop;
                } while ((element = element.offsetParent));
            }
            rect.width = (e.pageX - offsetX) - rect.startX;
            rect.height = (e.pageY - offsetY) - rect.startY;
            triggerZonePosition.width = rect.width;
            triggerZonePosition.height = rect.height;
            triggerZonePosition.x = rect.startX;
            triggerZonePosition.y = rect.startY;
            clearTriggerZone(function () {
                drawTriggerZone();
            });
        }
    }

    function recordAndTranslateCoordinates() {
        var transformedX, transformedY;
        hitZonesPositions.push({x: x, y: y});
        transformedX = x * ratio;
        transformedY = -y * ratio;
        transformedCoordinates.push({x: transformedX, y: transformedY});
    }

    function translateCoordinatesToPixel(coordinates) {
        return coordinates / ratio;
    }

    function recordAndTranslateTriggerZoneCoordinates() {
        var transformedX, transformedY, transformedHeight, transformedWidth;
        transformedX = rect.startX * ratio;
        transformedY = -rect.startY * ratio;
        transformedHeight = rect.height * ratio;
        transformedWidth = rect.width * ratio;
        triggerZoneCoordinates = {x: transformedX, y: transformedY, width: transformedWidth, height: transformedHeight};
    }

    function onClick(e) {
        var element = canvas;
        var offsetX = width / 2, offsetY = height / 2;

        if (element.offsetParent) {
            do {
                offsetX += element.offsetLeft;
                offsetY += element.offsetTop;
            } while ((element = element.offsetParent));
        }

        x = e.pageX - offsetX;
        y = e.pageY - offsetY;

        if (!$scope.triggerZone && !$scope.remove) {
            drawCircle();
            recordAndTranslateCoordinates();
        } else if ($scope.remove) {
            hitZonesPositions.forEach(function (position, hitZoneIndex) {
                if (isInsideCircle(position)) {
                    transformedCoordinates.forEach(function (point, transformedCoordinatesIndex) {
                        if (position.x == translateCoordinatesToPixel(point.x) && position.y == -translateCoordinatesToPixel(point.y)) {
                            hitZonesPositions.splice(hitZoneIndex, 1);
                            transformedCoordinates.splice(transformedCoordinatesIndex, 1);
                            clear(function () {
                                redraw(true);
                            })
                        }
                    });
                }
            })
        }
    }

    function isInsideCircle(position) {
        return (position.x - d / 2 <= x && x <= position.x + d / 2) && (position.y - d / 2 <= y && y <= position.y + d / 2)
    }

    $scope.initializeCombos();
});
