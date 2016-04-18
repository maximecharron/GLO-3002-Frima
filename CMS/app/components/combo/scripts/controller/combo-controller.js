angular.module('CMS.combo').controller("combo-controller", function ($scope, comboResource)
{
    $scope.combos;
    $scope.selectedCombo;
    $scope.remove = false;
    $scope.triggerZone = false;

    $scope.reset = function ()
    {
        clear();
    };

    $scope.newCombo = function ()
    {
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

    $scope.editTriggerZone = function (boolean)
    {
        $scope.triggerZone = boolean;
    };

    $scope.initializeCombos = function ()
    {
        //TODO: API Call
        $scope.combos = [
            {
                name: "Name",
                triggerFrequency: 1,
                bonusMultiplier: 4,
                triggerZone: {x: 0, y: 0.1, w: 0.2, h: 0.2},
                maxFirstHitWaitTime: 2,
                maxWaitTimeBetweenHits: 1,
                hitZones: [
                    {
                        x: 0.4,
                        y: -0.4
                    },
                    {
                        x: 0.3,
                        y: 0.3
                    },
                    {
                        x: 0.2,
                        y: 0.2
                    }
                ]
            },
            {
                name: "Name2",
                triggerFrequency: 1,
                bonusMultiplier: 4,
                triggerZone: {x: 0, y: -0.1, w: 0.4, h: 0.2},
                maxFirstHitWaitTime: 2,
                maxWaitTimeBetweenHits: 1,
                hitZones: [
                    {
                        x: 0.1,
                        y: 0.1
                    },
                    {
                        x: 0.2,
                        y: 0.2
                    },
                    {
                        x: 0.4,
                        y: 0.4
                    }
                ]
            }
        ]
    };

    $scope.comboChanged = function (newSelectedCombo)
    {
        $scope.selectedCombo = JSON.parse(newSelectedCombo);
        init();

    };

    $scope.updateCombo = function (selectedCombo)
    {
        $scope.selectedCombo = selectedCombo;
        $scope.selectedCombo.triggerZone = triggerZoneCoordinates;
        $scope.selectedCombo.hitZones = transformedCoordinates;
        //TODO: Add resource call
        console.log($scope.selectedCombo);
    };

    $scope.deleteCombo = function (selectedCombo)
    {
        $scope.combos.forEach(function (combo, index)
        {
            if (combo.name == $scope.selectedCombo.name){
                $scope.combos.splice(index, 1);
            }
        });
        $scope.selectedCombo = null;

        //TODO: remove from array and add resource call
        console.log(selectedCombo);
    };


    //Drawing functions
    var context;
    var canvas;
    var x, y;
    var d = 10;
    var width;
    var height;
    var colors = ["black", "#ff0000", "#00ff00", "#0000ff", "#ff9900", "#ff00ff"];
    var colorIndex = 0;
    var ratio;
    var triggerZoneCoordinates = {};
    var transformedCoordinates = [];
    var hitZonesPositions = [];
    var triggerZonePosition = {};
    var rect = {};
    var drag = false;
    var firstInit = true;
    var counter = 1;

    function init()
    {
        canvas = document.getElementById('game');
        context = canvas.getContext('2d');
        width = canvas.width;
        height = canvas.height;
        ratio = 1 / width;
        if (firstInit)
        {
            context.translate(width / 2, height / 2);
            firstInit = false;
        }
        clear(function ()
        {
            $scope.triggerZone = false;
            if ($scope.selectedCombo)
            {
                hitZonesPositions = [];
                transformedCoordinates = [];
                $scope.selectedCombo.hitZones.forEach(function (hitZone)
                {
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
                    w: translateCoordinatesToPixel($scope.selectedCombo.triggerZone.w),
                    h: translateCoordinatesToPixel($scope.selectedCombo.triggerZone.h)
                };
                triggerZoneCoordinates = {
                    x: $scope.selectedCombo.triggerZone.x,
                    y: $scope.selectedCombo.triggerZone.y,
                    w: $scope.selectedCombo.triggerZone.w,
                    h: $scope.selectedCombo.triggerZone.h
                };
                redraw(true);
            }
            canvas.addEventListener("click", onClick, false);
            canvas.addEventListener('mousedown', mouseDown, false);
            canvas.addEventListener('mouseup', mouseUp, false);
            canvas.addEventListener('mousemove', mouseMove, false);
        });
    }

    function redraw(triggerZone)
    {
        if (triggerZone)
        {
            rect.startX = triggerZonePosition.x;
            rect.startY = triggerZonePosition.y;
            rect.w = triggerZonePosition.w;
            rect.h = triggerZonePosition.h;
            drawTriggerZone();
        }
        colorIndex = 0;
        counter = 1;
        hitZonesPositions.forEach(function (position)
        {
            x = position.x;
            y = position.y;
            drawCircle();
        });

    }

    function drawCircle()
    {
        context.beginPath();
        context.fillStyle = "#ffffff";
        context.strokeStyle = colors[colorIndex];
        context.arc(x, y, d, 0, Math.PI * 2, true);
        context.lineWidth = 2;
        context.closePath();
        context.fill();
        context.stroke();
        context.font = "14px Arial";
        if (colorIndex > 6)
        {
            colorIndex = 0;
        }
        context.fillStyle = colors[colorIndex];
        colorIndex++;
        context.fillText(counter, x - 4, y + 4);
        counter++;
    }

    function clearTriggerZone(callback)
    {
        clear(function ()
        {
            redraw(false);
            callback();
        })
    }

    function clear(callback)
    {
        var image = new Image();
        image.onload = function ()
        {
            context.fillStyle = "#ffffff";
            context.fillRect(-width / 2, -height / 2, width, height);
            context.fillStyle = "#888888";
            context.strokeRect(-width / 2, -height / 2, width, height);

            context.drawImage(image, -width / 2, -height / 2);
            if (callback)
            {
                callback();
            }
        };
        image.src = "http://s9.postimg.org/gvarjklin/Boss_Sprite_Frame.png";
    }

    function mouseDown(e)
    {
        var offsetX = width / 2, offsetY = height / 2;
        var element = this;
        if (element.offsetParent)
        {
            do {
                offsetX += element.offsetLeft;
                offsetY += element.offsetTop;
            } while ((element = element.offsetParent));
        }
        rect.startX = e.pageX - offsetX;
        rect.startY = e.pageY - offsetY;
        drag = true;
    }

    function mouseUp()
    {
        drag = false;
    }

    function drawTriggerZone()
    {
        colorIndex = 0;
        context.strokeStyle = "black";
        context.strokeRect(rect.startX, rect.startY, rect.w, rect.h);
        recordAndTranslateTriggerZoneCoordinates();
    }

    function mouseMove(e)
    {
        if (drag && $scope.triggerZone)
        {
            var offsetX = width / 2;
            var offsetY = height / 2;
            var element = this;
            if (element.offsetParent)
            {
                do {
                    offsetX += element.offsetLeft;
                    offsetY += element.offsetTop;
                } while ((element = element.offsetParent));
            }
            rect.w = (e.pageX - offsetX) - rect.startX;
            rect.h = (e.pageY - offsetY) - rect.startY;
            triggerZonePosition.w = rect.w;
            triggerZonePosition.h = rect.h;
            triggerZonePosition.x = rect.startX;
            triggerZonePosition.y = rect.startY;
            clearTriggerZone(function ()
            {
                drawTriggerZone();
            });
        }
    }

    function recordAndTranslateCoordinates()
    {
        var transformedX, transformedY;
        hitZonesPositions.push({x: x, y: y});
        transformedX = x * ratio;
        transformedY = -y * ratio;
        transformedCoordinates.push({x: transformedX, y: transformedY});
    }

    function translateCoordinatesToPixel(coordinates)
    {
        return coordinates / ratio;
    }

    function recordAndTranslateTriggerZoneCoordinates()
    {
        var transformedX, transformedY, transformedHeight, transformedWidth;
        transformedX = x * ratio;
        transformedY = -y * ratio;
        transformedHeight = rect.h * ratio;
        transformedWidth = rect.w * ratio;
        triggerZoneCoordinates = {x: transformedX, y: transformedY, width: transformedWidth, height: transformedHeight};
    }

    function onClick(e)
    {
        var element = canvas;
        var offsetX = width / 2, offsetY = height / 2;

        if (element.offsetParent)
        {
            do {
                offsetX += element.offsetLeft;
                offsetY += element.offsetTop;
            } while ((element = element.offsetParent));
        }

        x = e.pageX - offsetX;
        y = e.pageY - offsetY;

        if (!$scope.triggerZone && !$scope.remove)
        {
            drawCircle();
            recordAndTranslateCoordinates();
        } else if ($scope.remove)
        {
            hitZonesPositions.forEach(function (position, hitZoneIndex)
            {
                if (isInsideCircle(position))
                {
                    transformedCoordinates.forEach(function (point, transformedCoordinatesIndex)
                    {
                        if (position.x == translateCoordinatesToPixel(point.x) && position.y == -translateCoordinatesToPixel(point.y))
                        {
                            hitZonesPositions.splice(hitZoneIndex, 1);
                            transformedCoordinates.splice(transformedCoordinatesIndex, 1);
                            clear(function ()
                            {
                                redraw(true);
                            })
                        }
                    });
                }
            })
        }
    }

    function isInsideCircle(position)
    {
        return (position.x - d / 2 <= x && x <= position.x + d / 2) && (position.y - d / 2 <= y && y <= position.y + d / 2)
    }

    $scope.initializeCombos();
});
