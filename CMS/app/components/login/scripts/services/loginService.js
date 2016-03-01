loginApp.factory('loginService', ["loginResource", "$rootScope", function (loginResource, $rootScope) {

  function getUser() {
      return $rootScope.user;
  }

  return {
      getUser: getUser
  };
}])
