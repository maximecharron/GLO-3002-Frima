angular.module('CMS.login').factory('loginService', ["loginResource", "$cookies", "$rootScope", function (loginResource, $cookies, $rootScope) {

    function setUser(user) {
        $rootScope.user = user;
        $cookies.putObject("user", $rootScope.user);
    }

    function getUser() {
        return $rootScope.user;
    }

    function clearUser() {
        $rootScope.user = null;
        $cookies.remove('user');
    }

    return {
        setUser: setUser,
        clearUser: clearUser,
        getUser: getUser
    };
}]);