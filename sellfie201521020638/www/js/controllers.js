angular.module('starter.controllers', [])


.controller('AppCtrl', function($scope,$rootScope,$ionicHistory,$ionicSideMenuDelegate,$state,cartService,categoryService,Search) {
  $scope.search = Search;
  $scope.doSearch = function() {
    cordova.plugins.Keyboard.close();
    $ionicSideMenuDelegate.toggleLeft();
    $ionicHistory.nextViewOptions({disableBack: true});
    $state.go('app.search', {}, {reload: true});
  }
  $rootScope.isLoggedIn = false;
  $scope.loginData = {};
  $scope.cartProducts = cartService.cartProducts;
  categoryService.loadMenuCategories()
  .then(function (menuCategories) {
    $scope.menucategories = menuCategories;
  });
})


.controller('ForgotPasswordController', function($scope,$rootScope,$state) {
  $scope.user = {};
  $scope.error = {};
  $scope.state = { success: false };
  $scope.reset = function() {
    $rootScope.show();
    Parse.User.requestPasswordReset($scope.user.email, {
      success: function() {
        $rootScope.hide();
        $scope.state.success = true;
      },
      error: function(error) {
        $rootScope.hide();
        $scope.error.message = error.message;
      }
    });
  };
  $scope.login = function() {
    $state.go('app.login');
  };
})


.controller('SearchController', function($scope,productService,Search) {
  $scope.Title = "Searching for " + Search.query;
  $scope.products = [];
  productService.searchProducts(Search.query)
  .then(function (results) {
    $scope.products = results;
  });
})


.controller('CatalogController', function($scope,productService) {
  $scope.Title = "All Products";
  $scope.products = [];
  productService.initProducts();
  productService.loadAllProducts()
  .then(function (results) {
    $scope.products = results;
  });
})


.controller('CategoryController', function($scope,productService,categoryService,$stateParams) {
  categoryService.getCatName($stateParams.categoryId)
  .then(function (name) {
    $scope.Title = name;
  });
  $scope.products = [];
  productService.loadProducts($stateParams.categoryId)
  .then(function (results) {
    $scope.products = results;
    $scope.currentcatid = $stateParams.categoryId;
  });
})


.controller('CheckoutController', function($scope,cartService) {
    $scope.cartProducts = cartService.cartProducts;
})


.controller('PostController', function($scope,cartService) {
    //$scope.cartProducts = cartService.cartProducts;
})


.controller('myPageController', function($scope,cartService) {
    $scope.cartProducts = cartService.cartProducts;
})

.controller('userInfoController', function($scope,cartService) {
    $scope.cartProducts = cartService.cartProducts;
})

.controller('salesController', function($scope,cartService) {
    $scope.cartProducts = cartService.cartProducts;
})

.controller("IndexCtrl", ['$rootScope', "$scope", "$stateParams", "$q", "$location", "$window", '$timeout', 
			function($rootScope, $scope, $stateParams, $q, $location, $window, $timeout){
			
        }
]);

