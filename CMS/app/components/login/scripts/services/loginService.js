loginApp.factory('loginService', ["loginResource", "$cookies", "$rootScope", function (loginResource, $rootScope) {

    function getUser() {
        return $rootScope.user;
    }

    function setUser(user) {
        $rootScope.user = user;
        $cookies.putObject("user", $rootScope.user);
    }

    return {
        getUser: getUser
    };
}])
