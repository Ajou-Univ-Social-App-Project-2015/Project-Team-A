angular.module('starter.directives', [])

.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    }
})              // 추가

.directive('tabSlideBox', [ '$timeout', '$window', '$ionicSlideBoxDelegate', '$ionicScrollDelegate',
	function($timeout, $window, $ionicSlideBoxDelegate, $ionicScrollDelegate) {
		'use strict';

		return {
			restrict : 'A, E, C',
			link : function(scope, element, attrs, ngModel) {
				
				var ta = element[0], $ta = element;
				$ta.addClass("tabbed-slidebox");
				if(attrs.tabsPosition === "bottom"){
					$ta.addClass("btm");
				}
				
				//Handle multiple slide/scroll boxes
				var handle = ta.querySelector('.slider').getAttribute('delegate-handle');
				
				var ionicSlideBoxDelegate = $ionicSlideBoxDelegate;
				if(handle){
					ionicSlideBoxDelegate = ionicSlideBoxDelegate.$getByHandle(handle);
				}
				
				var ionicScrollDelegate = $ionicScrollDelegate;
				if(handle){
					ionicScrollDelegate = ionicScrollDelegate.$getByHandle(handle);
				}
				
				function renderScrollableTabs(){
					var iconsDiv = angular.element(ta.querySelector(".tsb-icons")), icons = iconsDiv.find("a"), wrap = iconsDiv[0].querySelector(".tsb-ic-wrp"), totalTabs = icons.length;
					var scrollDiv = wrap.querySelector(".scroll");
					
					angular.forEach(icons, function(value, key){
					     var a = angular.element(value);
					     a.on('click', function(){
					    	 ionicSlideBoxDelegate.slide(key);
					     });

						if(a.attr('icon-off')) {
							a.attr("class", a.attr('icon-off'));
						}
					});
					
					var initialIndex = attrs.tab;
					//Initializing the middle tab
					if(typeof attrs.tab === 'undefined' || (totalTabs <= initialIndex) || initialIndex < 0){
						initialIndex = Math.floor(icons.length/2);
					}
					
					//If initial element is 0, set position of the tab to 0th tab 
					if(initialIndex == 0){
						setPosition(0);
					}
					
					$timeout(function() {
						ionicSlideBoxDelegate.slide(initialIndex);
					}, 0);
				}
				function setPosition(index){
					var iconsDiv = angular.element(ta.querySelector(".tsb-icons")), icons = iconsDiv.find("a"), wrap = iconsDiv[0].querySelector(".tsb-ic-wrp"), totalTabs = icons.length;
					var scrollDiv = wrap.querySelector(".scroll");
					
					var middle = iconsDiv[0].offsetWidth/2;
					var curEl = angular.element(icons[index]);
					var prvEl = angular.element(iconsDiv[0].querySelector(".active"));
					if(curEl && curEl.length){
					var curElWidth = curEl[0].offsetWidth, curElLeft = curEl[0].offsetLeft;

					if(prvEl.attr('icon-off')) {
						prvEl.attr("class", prvEl.attr('icon-off'));
					}else{
						prvEl.removeClass("active");
					}
					if(curEl.attr('icon-on')) {
						curEl.attr("class", curEl.attr('icon-on'));
					}
					curEl.addClass("active");
					
					var leftStr = (middle  - (curElLeft) -  curElWidth/2 + 5);
					//If tabs are not scrollable
					if(!scrollDiv){
						var leftStr = (middle  - (curElLeft) -  curElWidth/2 + 5) + "px";
						wrap.style.webkitTransform =  "translate3d("+leftStr+",0,0)" ;
					}else{
						//If scrollable tabs
						var wrapWidth = wrap.offsetWidth;
						var currentX = Math.abs(getX(scrollDiv.style.webkitTransform));
						var leftOffset = 100;
						var elementOffset = 40;
						//If tabs are reaching right end or left end
						if(((currentX + wrapWidth) < (curElLeft + curElWidth + elementOffset)) || (currentX > (curElLeft - leftOffset))){
							if(leftStr > 0){
								leftStr = 0;
							}
							//Use this scrollTo, so when scrolling tab manually will not flicker
							ionicScrollDelegate.scrollTo(Math.abs(leftStr), 0, true);
						}
					}
					}
				};
				function getX(matrix) {
					matrix = matrix.replace("translate3d(","");
					matrix = matrix.replace("translate(","");
					return (parseInt(matrix));
				}
				var events = scope.events;
				events.on('slideChange', function(data){
					setPosition(data.index);
				});
				events.on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
					renderScrollableTabs();
				});
				
				renderScrollableTabs();
			},
			controller : function($scope, $attrs, $element) {
				$scope.events = new SimplePubSub();
				
				$scope.slideHasChanged = function(index){
					$scope.events.trigger("slideChange", {"index" : index});
					$timeout(function(){if($scope.onSlideMove) $scope.onSlideMove({"index" : eval(index)});},100);
				};
				
				$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
					$scope.events.trigger("ngRepeatFinished", {"event" : ngRepeatFinishedEvent});
				});
			}
		};

	} 
])                                     // 추가


.directive('ionCatalog', function($location,$state,$ionicHistory,cartService){
  var link = function(scope, element, attr) {
    scope.addToCart = function(product){
      cartService.addToCart(product);
    };
    scope.goToCategory = function(categoryId) {
      $ionicHistory.nextViewOptions({disableBack: true});
      $location.path("/app/category/"+ categoryId);
    };
  };
  return {
    restrict: 'AEC',
    templateUrl: 'templates/partials/catalog-item.html',
    link: link,
    scope: {
      products: '=',
      currentcatid: '='
    }
  };
})

.directive('fancySelect', function($ionicModal) {
  var link = function(scope, element, attrs) {
    scope.$watch('product.myOptions', function(){
      if (typeof scope.product.myOptions !== 'undefined' && scope.product.myOptions[(scope.optionnumber-1)] !== 'undefined') {
        scope.myoption = scope.product.myOptions[(scope.optionnumber-1)];
      }
    });
    $ionicModal.fromTemplateUrl(
      'templates/partials/fancy-select-items.html',{
      'scope': scope
    }).then(function(modal) {
      scope.modal = modal;
    });
    scope.showItems = function (event) {
      event.preventDefault();
      scope.modal.show();
    }
    scope.hideItems = function () {
      scope.modal.hide();
    }
    scope.$on('$destroy', function() {
      scope.modal.remove();
    });
    scope.validateOption = function (option) {
      scope.myoption = option;
      scope.product.myOptions[(scope.optionnumber-1)] = option;
      scope.product.myPrice = scope.product.Price;
      scope.product.myOptions.forEach(function(option) {
        scope.product.myPrice = scope.product.myPrice + option.get("deltaPrice");
      });
      scope.hideItems();
    }
  };
  return {
    restrict : 'E',
    templateUrl: 'templates/partials/fancy-select.html',
    scope: {
      'product' : '=',
      'optionnumber' : '='
    },
    link: link
  };
})

.directive('ionCart', function(cartService) {
  var link = function(scope, element, attr) {
    scope.$watch('cartproducts', function(){
      cartService.updateTotal();
      scope.total = cartService.total;
      scope.emptyProducts = scope.cartproducts.length ? false : true;
    }, true);
    scope.addProduct = function(product) {
      cartService.addOneProduct(product);
    };
    scope.removeProduct = function(product){
      product.Quantity <= 1 ? cartService.removeProduct(product) : cartService.removeOneProduct(product);
    };
  };
  return {
    restrict: 'AEC',
    templateUrl: 'templates/partials/cart-item.html',
    link: link,
    scope: {
      cartproducts: '='
    }
  };
})

.directive('userInfo', function($state,$rootScope,$location,$ionicHistory,$ionicModal,Settings,cartService,userService,orderService,CheckoutValidation){
    var link = function(scope, element, attr) {
        scope.$watch( function(){
            scope.userinfo = userService.userInfo;
            scope.isLoggedIn = $rootScope.isLoggedIn;
        });
    };
    return {
    restrict: 'AEC',
    templateUrl: 'templates/user-info.html',
    scope: {
      userinfo: '='
    },
    link: link
  };
})

.directive('sales', function($state,$rootScope,$location,$ionicHistory,$ionicModal,Settings,cartService,userService,orderService,CheckoutValidation){
    var link = function(scope, element, attr) {
        scope.$watch( function(){
            scope.userinfo = userService.userInfo;
            scope.isLoggedIn = $rootScope.isLoggedIn;
        });
    };
    return {
    restrict: 'AEC',
    templateUrl: 'templates/sales.html',
    scope: {
      userinfo: '='
    },
    link: link
  };
})

.directive('ionMypage', function(cartService) {
  var link = function(scope, element, attr) {
    scope.$watch('cartproducts', function(){
      cartService.updateTotal();
      scope.total = cartService.total;
      scope.emptyProducts = scope.cartproducts.length ? false : true;
    }, true);
    scope.addProduct = function(product) {
      cartService.addOneProduct(product);
    };
    scope.removeProduct = function(product){
      product.Quantity <= 1 ? cartService.removeProduct(product) : cartService.removeOneProduct(product);
    };
  };
  return {
    restrict: 'AEC',
    templateUrl: 'templates/partials/cart-item.html',
    link: link,
    scope: {
      cartproducts: '='
    }
  };
})

.directive('ionCartFooter', function($state,$rootScope) {
  var link = function(scope, element, attr) {
    $rootScope.$watch('isLoggedIn', function(){
      if ($rootScope.isLoggedIn) {
        element.html("<div class='title cart-footer'>결제</div>");
      }
      else {
        element.html("<div class='title cart-footer'>회원가입 / 결제</div>");
      }
    }, true);
    element.addClass('bar bar-footer bar-positive');
    element.on('click', function(e){
      $state.go('app.checkout');
    });
    element.on('touchstart', function(){
      element.css({opacity: 0.8});
    });
    element.on('touchend', function(){
      element.css({opacity: 1});
    });
  };
  return {
    restrict: 'AEC',
    templateUrl: 'templates/partials/cart-footer.html',
    link: link
  };
})

.directive('ionCartSubFooter', function($state,$rootScope,$location,$ionicHistory,$ionicModal,userService) {
  var link = function(scope, element, attr) {
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: scope
    }).then(function(modal) {
      scope.modal = modal;
    });
    scope.logout = function() {
      Parse.User.logOut();
      userService.userInfo = {};
      $rootScope.isLoggedIn = false;
      $ionicHistory.nextViewOptions({disableBack: true});
      $state.go('app.catalog',{clear:true});
    };
    scope.forgot = function() {
      scope.closeLogin();
      $state.go('app.forgot');
    };
    scope.closeLogin = function() {
      scope.modal.hide();
    };
    scope.doLogin = function() {
      userService.login(scope.loginData)
      .then(function(result) {
        // Subscribe to receive a notification for this specific user (testing purpose):
        
        parsePlugin.subscribe(result.get("firstName"), function() {
          console.log("RegisterCtrl ::: parsePlugin.subscribe : " + result.get("firstName"));
        }, function(error) {
          console.error('RegisterCtrl ::: parsePlugin.subscribe ::: error: ' + JSON.stringify(error));
        });

        userService.userInfo = result.toJSON();
        $rootScope.isLoggedIn = true;
        scope.closeLogin();
        $state.go('app.checkout',{},{reload:true});
      }, function (error) {
        scope.error = error;
      });
    };
    $rootScope.$watch('isLoggedIn', function(){
      if ($rootScope.isLoggedIn) {
        element.html("<div class='title cart-sub-footer'>로그아웃</div>");
      }
      else {
        element.html("<div class='title cart-sub-footer'>로그인</div>");
      }
    }, true);
    element.addClass('bar bar-subfooter bar-dark');
    element.on('click', function(e){
      if ($rootScope.isLoggedIn) {
        scope.logout();
      }
      else {
        scope.modal.show();
      }
    });
    element.on('touchstart', function(){
      element.css({opacity: 0.8});
    });
    element.on('touchend', function(){
      element.css({opacity: 1});
    });
  };
  return {
    restrict: 'AEC',
    templateUrl: 'templates/partials/cart-subfooter.html',
    link: link
  };
})

.directive('ionPost', function($rootScope,cartService,userService,postService) {
    var link = function(scope, element, attr) {
        scope.$watch(function(){
            scope.userinfo = userService.userInfo;
            scope.productinfo = postService.productInfo;          
            scope.isLoggedIn = $rootScope.isLoggedIn;
            scope.total = cartService.total;
        });
    };
    return {
        restrict: 'AEC',
        templateUrl: 'templates/partials/post-form.html',
        scope: {
            userinfo: '=',
            productinfo: '='
        },
        link: link
    };
})

.directive('ionPostFooter', function($rootScope,$location,$ionicHistory,$ionicPlatform,Settings,userService,postService,CheckoutValidation) {
  var link = function(scope, element, attr) {
    scope.$watch(function(){
      scope.userinfo = userService.userInfo;      
      scope.productinfo = postService.productInfo;
    });
    element.addClass('bar bar-footer bar-positive');
    element.on('click', function(){
      var ionErrorDiv = document.getElementsByClassName('post-form-error');
      angular.element(ionErrorDiv).html('').css({color:'#ED303C',opacity:1});      
      if ($rootScope.isLoggedIn) {
          postService.post(scope.productinfo);           
      }
    });
    element.on('touchstart', function(){
      element.css({opacity: 0.8});
    });
    element.on('touchend', function(){
      element.css({opacity: 1});
    });
  };
  return {
    restrict: 'AEC',
    templateUrl: 'templates/partials/post-footer.html',
    link: link
  };
})

.directive('ionCheckout', function($rootScope,cartService,userService) {
  var link = function(scope, element, attr) {
    scope.$watch(function(){
      scope.userinfo = userService.userInfo;
      scope.isLoggedIn = $rootScope.isLoggedIn;
      scope.total = cartService.total;
    });
  };
  return {
    restrict: 'AEC',
    templateUrl: 'templates/partials/checkout-form.html',
    scope: {
      userinfo: '='
    },
    link: link
  };
})

.directive('ionCheckoutFooter', function($rootScope,$location,$ionicHistory,$ionicPlatform,Settings,cartService,userService,orderService,CheckoutValidation) {
  var link = function(scope, element, attr) {
    scope.$watch(function(){
      scope.userinfo = userService.userInfo;
      scope.total = cartService.total;
    });
    element.addClass('bar bar-footer bar-positive');
    element.on('click', function(){
      var ionErrorDiv = document.getElementsByClassName('checkout-form-error');
      angular.element(ionErrorDiv).html('').css({color:'#ED303C',opacity:1});
      if ($rootScope.isLoggedIn) {
        if (CheckoutValidation.checkLoggedInputs(scope.userinfo)) {
          userService.save(scope.userinfo);
          orderService.newOrder(cartService.cartProducts,cartService.total)
          /*
          .then(function (ordersaved) {
            orderService.currentOrder = ordersaved;
            cartService.getPaypalItems().then(function (results) {
              var payment = paypalApp.createPayment(scope.total, "Order ID: "+ordersaved.id);
              payment.invoiceNumber = ordersaved.id;
              payment.items = results;
              PayPalMobile.renderSinglePaymentUI(payment, paypalApp.onSuccessfulPayment, paypalApp.onUserCanceled);
            });
          });
          */
        }
        else {
          var ionErrorDiv = document.getElementsByClassName('checkout-form-error');
          angular.element(ionErrorDiv).html('<br>You have invalid or missing fields.<br><br>').css({color:'#ED303C',opacity:1});
        }
      }
      else {
        if (CheckoutValidation.checkAll(scope.userinfo)) {
          userService.register(scope.userinfo)
          .then(function (result) {
            $rootScope.isLoggedIn = true;
            // Subscribe to receive a notification for this specific user (testing purpose):
            parsePlugin.subscribe(result.get("firstName"), function() {
              console.log("RegisterCtrl ::: parsePlugin.subscribe : " + result.get("firstName"));
            }, function(error) {
              console.error('RegisterCtrl ::: parsePlugin.subscribe ::: error: ' + JSON.stringify(error));
            });
            orderService.newOrder(cartService.cartProducts,cartService.total)
           
            /*
            .then(function (ordersaved) {
              orderService.currentOrder = ordersaved;
              cartService.getPaypalItems().then(function (results) {
                var payment = paypalApp.createPayment(scope.total, "Order ID: "+ordersaved.id);
                payment.invoiceNumber = ordersaved.id;
                payment.items = results;
                PayPalMobile.renderSinglePaymentUI(payment, paypalApp.onSuccessfulPayment, paypalApp.onUserCanceled);
              });
            });
          */
          }, function(error) {
            console.error("REGISTER ERROR: " + error);
            var ionErrorDiv = document.getElementsByClassName('checkout-form-error');
            angular.element(ionErrorDiv).html('<br>'+error+'<br><br>').css({color:'#ED303C',opacity:1});
          });
        }
        else {
          var ionErrorDiv = document.getElementsByClassName('checkout-form-error');
          angular.element(ionErrorDiv).html('<br>You have invalid or missing fields.<br><br>').css({color:'#ED303C',opacity:1});
        }
      }
    });
    element.on('touchstart', function(){
      element.css({opacity: 0.8});
    });
    element.on('touchend', function(){
      element.css({opacity: 1});
    });
  };
  return {
    restrict: 'AEC',
    templateUrl: 'templates/partials/checkout-footer.html',
    link: link
  };
})

.directive('productName', function($timeout,CheckoutValidation) {
    var link = function(scope, element, attr) {
        var iconTitle = element.children()[1].children[1];
        var iconPrice = element.children()[2].children[1];
        var iconCategory = element.children()[3].children[1];
        var iconDescription =  element.children()[4].children[1];
        scope.onTitleBlur = function(){
            angular.element(iconTitle).addClass('ion-loading-d');
            $timeout(function(){
                if (!CheckoutValidation.validateName(scope.productinfo.Title)) {
                    angular.element(iconTitle).removeClass('ion-loading-d');
                    angular.element(iconTitle).addClass('ion-close-round').css({color: '#ED303C'});
                    return;
                } else {
                    angular.element(iconTitle).removeClass('ion-loading-d');
                    angular.element(iconTitle).addClass('ion-checkmark-round').css({color: '#1fda9a'});
                }
            }, 300);
        };
        scope.onTitleFocus = function(){
            angular.element(iconTitle).removeClass('ion-checkmark-round ion-close-round').css({color: '#333'});
        };
        scope.onPriceBlur = function(){
            angular.element(iconPrice).addClass('ion-loading-d');
            $timeout(function(){
                if (!CheckoutValidation.validateName(scope.productinfo.Price)) {
                    angular.element(iconPrice).removeClass('ion-loading-d');
                    angular.element(iconPrice).addClass('ion-close-round').css({color: '#ED303C'});
                    return;
                } else {
                    angular.element(iconPrice).removeClass('ion-loading-d');
                    angular.element(iconPrice).addClass('ion-checkmark-round').css({color: '#1fda9a'});
                }
            }, 300);
        };
        scope.onPriceFocus = function(){
            angular.element(iconPrice).removeClass('ion-checkmark-round ion-close-round').css({color: '#333'});
        };
        scope.onCategoryBlur = function(){
            angular.element(iconCategory).addClass('ion-loading-d');
            $timeout(function(){
                if (!CheckoutValidation.validateName(scope.productinfo.Category)) {
                    angular.element(iconCategory).removeClass('ion-loading-d');
                    angular.element(iconCategory).addClass('ion-close-round').css({color: '#ED303C'});
                    return;
                } else {
                    angular.element(iconCategory).removeClass('ion-loading-d');
                    angular.element(iconCategory).addClass('ion-checkmark-round').css({color: '#1fda9a'});
                }
            }, 300);

        };
        scope.onCategoryFocus = function(){
            angular.element(iconCategory).removeClass('ion-checkmark-round ion-close-round').css({color: '#333'});
        };
        scope.onDescriptionsBlur = function(){
            angular.element(iconDescription).addClass('ion-loading-d');
            $timeout(function(){
                if (!CheckoutValidation.validateName(scope.productinfo.Descriptions)) {
                    angular.element(iconDescription).removeClass('ion-loading-d');
                    angular.element(iconDescription).addClass('ion-close-round').css({color: '#ED303C'});
                    return;
                } else {
                    angular.element(iconDescription).removeClass('ion-loading-d');
                    angular.element(iconDescription).addClass('ion-checkmark-round').css({color: '#1fda9a'});
                }
            }, 300);

        };
        scope.onDescriptionsFocus = function(){
            angular.element(iconDescription).removeClass('ion-checkmark-round ion-close-round').css({color: '#333'});
        };
        
        scope.getPhoto = function () {
            var options = {
                'buttonLabels': ['사진 촬영', '갤러리에서 선택'],
                'addCancelButtonWithLabel': 'Cancel'
            };
            window.plugins.actionsheet.show(options, callback);
        };

        function callback(buttonIndex) {
            console.log(buttonIndex);
            if (buttonIndex === 1) {

                var picOptions = {
                    // destinationType: navigator.camera.DestinationType.FILE_URI,
                    destinationType: navigator.camera.DestinationType.DATA_URL,
                    quality: 75,
                    targetWidth: 500,
                    targetHeight: 500,
                    allowEdit: true,
                    saveToPhotoAlbum: false
                };
                navigator.camera.getPicture(function (result) {
                  // Do any magic you need
                    // q.resolve(result);
                    console.log(result);
                    scope.productinfo.lastPhoto = result;
                    scope.productinfo.newPhoto = true;
                }, function (err) {
                    console.log(err);
                    scope.productinfo.newPhoto = false;
                    alert(err);
                    // q.reject(err);
                }, picOptions);                
            } else if (buttonIndex === 2) {

                var picOptions = {
                    // destinationType: navigator.camera.DestinationType.FILE_URI,
                    destinationType: navigator.camera.DestinationType.DATA_URL,
                    quality: 75,
                    targetWidth: 500,
                    targetHeight: 500,
                    sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
                };
                navigator.camera.getPicture(function (result) {
                    // Do any magic you need
                    // q.resolve(result);
                    console.log(result);
                    scope.productinfo.lastPhoto = result;
                    scope.productinfo.newPhoto = true;
                }, function (err) {
                    console.log(err);
                    scope.productinfo.newPhoto = false;
                    alert(err);
                    // q.reject(err);
                }, picOptions);               
            }
        }
    };
    return {
        restrict: 'AE',
        scope: {
            userinfo: '=',
            productinfo: '='
        },
        link: link,
        templateUrl: 'templates/partials/product-name.html'
    };
})
/*
.directive('checkoutProductName', function($timeout,CheckoutValidation) {
    var link = function(scope, element, attr) {
        var iconfn = element.children()[1].children[1];
        var iconln = element.children()[2].children[1];
        var iconThird = element.children()[3].children[1];
        scope.onFirstNameBlur = function(){
            angular.element(iconfn).addClass('ion-loading-d');
            $timeout(function(){
                if (!CheckoutValidation.validateName(scope.userinfo.firstName)) {
                    angular.element(iconfn).removeClass('ion-loading-d');
                    angular.element(iconfn).addClass('ion-close-round').css({color: '#ED303C'});
                    return;
                } else {
                    angular.element(iconfn).removeClass('ion-loading-d');
                    angular.element(iconfn).addClass('ion-checkmark-round').css({color: '#1fda9a'});
                }
            }, 300);
        };
        scope.onFirstNameFocus = function(){
            angular.element(iconfn).removeClass('ion-checkmark-round ion-close-round').css({color: '#333'});
        };
        scope.onLastNameBlur = function(){
            angular.element(iconln).addClass('ion-loading-d');
            $timeout(function(){
                if (!CheckoutValidation.validateName(scope.userinfo.lastName)) {
                    angular.element(iconln).removeClass('ion-loading-d');
                    angular.element(iconln).addClass('ion-close-round').css({color: '#ED303C'});
                    return;
                } else {
                    angular.element(iconln).removeClass('ion-loading-d');
                    angular.element(iconln).addClass('ion-checkmark-round').css({color: '#1fda9a'});
                }
            }, 300);
        };
        scope.onLastNameFocus = function(){
            angular.element(iconln).removeClass('ion-checkmark-round ion-close-round').css({color: '#333'});
        };
        scope.onThirdThingBlur = function(){
            angular.element(iconThird).addClass('ion-loading-d');
            $timeout(function(){
                if (!CheckoutValidation.validateName(scope.userinfo.thirdThing)) {
                    angular.element(iconThird).removeClass('ion-loading-d');
                    angular.element(iconThird).addClass('ion-close-round').css({color: '#ED303C'});
                    return;
                } else {
                    angular.element(iconThird).removeClass('ion-loading-d');
                    angular.element(iconThird).addClass('ion-checkmark-round').css({color: '#1fda9a'});
                }
            }, 300);

        };
        scope.onThirdThingFocus = function(){
            angular.element(iconThird).removeClass('ion-checkmark-round ion-close-round').css({color: '#333'});
        };
    };
    return {
        restrict: 'AE',
        scope: {
            userinfo: '=',
        },
        link: link,
        templateUrl: 'templates/partials/checkout-product-name.html'
    };
})
*/
.directive('checkoutName', function($timeout,CheckoutValidation) {
    var link = function(scope, element, attr) {
      var iconfn = element.children()[1].children[1];
      var iconln = element.children()[2].children[1];
      scope.onFirstNameBlur = function(){
        angular.element(iconfn).addClass('ion-loading-d');
        $timeout(function(){
          if (!CheckoutValidation.validateName(scope.userinfo.firstName)) {
            angular.element(iconfn).removeClass('ion-loading-d');
            angular.element(iconfn).addClass('ion-close-round').css({color: '#ED303C'});
            return;
          } else {
            angular.element(iconfn).removeClass('ion-loading-d');
            angular.element(iconfn).addClass('ion-checkmark-round').css({color: '#1fda9a'});
          }
        }, 300);
      };
      scope.onFirstNameFocus = function(){
        angular.element(iconfn).removeClass('ion-checkmark-round ion-close-round').css({color: '#333'});
      };
      scope.onLastNameBlur = function(){
        angular.element(iconln).addClass('ion-loading-d');
        $timeout(function(){
          if (!CheckoutValidation.validateName(scope.userinfo.lastName)) {
            angular.element(iconln).removeClass('ion-loading-d');
            angular.element(iconln).addClass('ion-close-round').css({color: '#ED303C'});
            return;
          } else {
            angular.element(iconln).removeClass('ion-loading-d');
            angular.element(iconln).addClass('ion-checkmark-round').css({color: '#1fda9a'});
          }
        }, 300);
      };
      scope.onLastNameFocus = function(){
        angular.element(iconln).removeClass('ion-checkmark-round ion-close-round').css({color: '#333'});
      };
    };
    return {
      restrict: 'AE',
      scope: {
        userinfo: '=',
      },
      link: link,
      templateUrl: 'templates/partials/checkout-name.html'
    };
})

.directive('checkoutAccount', function($timeout,CheckoutValidation) {
    var link = function(scope, element, attr) {
      var icone = element.children()[1].children[1];
      var iconp = element.children()[2].children[1];
      scope.onEmailBlur = function(){
        angular.element(icone).addClass('ion-loading-d');
        $timeout(function(){
          if (!CheckoutValidation.validateEmail(scope.userinfo.email)) {
            angular.element(icone).removeClass('ion-loading-d');
            angular.element(icone).addClass('ion-close-round').css({color: '#ED303C'});
            return;
          } else {
            angular.element(icone).removeClass('ion-loading-d');
            angular.element(icone).addClass('ion-checkmark-round').css({color: '#1fda9a'});
          }
        }, 300);
      };
      scope.onEmailFocus = function(){
        angular.element(icone).removeClass('ion-checkmark-round ion-close-round').css({color: '#333'});
      };
      scope.onPasswordBlur = function(){
        angular.element(iconp).addClass('ion-loading-d');
        $timeout(function(){
          if (!CheckoutValidation.validateName(scope.userinfo.password)) {
            angular.element(iconp).removeClass('ion-loading-d');
            angular.element(iconp).addClass('ion-close-round').css({color: '#ED303C'});
            return;
          } else {
            angular.element(iconp).removeClass('ion-loading-d');
            angular.element(iconp).addClass('ion-checkmark-round').css({color: '#1fda9a'});
          }
        }, 300);
      };
      scope.onPasswordFocus = function(){
        angular.element(iconp).removeClass('ion-checkmark-round ion-close-round').css({color: '#333'});
      };
    };
    return {
      restrict: 'AE',
      scope: {
        userinfo: '=',
      },
      link: link,
      templateUrl: 'templates/partials/checkout-account.html'
    };
})
/*
.directive('checkoutAddress', function($timeout,CheckoutValidation) {
    var link = function(scope, element, attr) {
      var icona = element.children()[1].children[1];
      var iconc = element.children()[3].children[1];
      var icons = element.children()[4].children[1];
      var iconz = element.children()[5].children[1];
      scope.onAddressBlur = function(){
        angular.element(icona).addClass('ion-loading-d');
        $timeout(function(){
          if (!CheckoutValidation.validateName(scope.userinfo.addressLineOne)) {
            angular.element(icona).removeClass('ion-loading-d');
            angular.element(icona).addClass('ion-close-round').css({color: '#ED303C'});
            return;
          } else {
            angular.element(icona).removeClass('ion-loading-d');
            angular.element(icona).addClass('ion-checkmark-round').css({color: '#1fda9a'});
          }
        }, 300);
      };
      scope.onAddressFocus = function(){
        angular.element(icona).removeClass('ion-checkmark-round ion-close-round').css({color: '#333'});
      };
      scope.onCityBlur = function(){
        angular.element(iconc).addClass('ion-loading-d');
        $timeout(function(){
          if (!CheckoutValidation.validateName(scope.userinfo.city)) {
            angular.element(iconc).removeClass('ion-loading-d');
            angular.element(iconc).addClass('ion-close-round').css({color: '#ED303C'});
            return;
          } else {
            angular.element(iconc).removeClass('ion-loading-d');
            angular.element(iconc).addClass('ion-checkmark-round').css({color: '#1fda9a'});
          }
        }, 300);
      };
      scope.onCityFocus = function(){
        angular.element(iconc).removeClass('ion-checkmark-round ion-close-round').css({color: '#333'});
      };
      scope.onStateBlur = function(){
        angular.element(icons).addClass('ion-loading-d');
        $timeout(function(){
          if (!CheckoutValidation.validateName(scope.userinfo.state)) {
            angular.element(icons).removeClass('ion-loading-d');
            angular.element(icons).addClass('ion-close-round').css({color: '#ED303C'});
            return;
          } else {
            angular.element(icons).removeClass('ion-loading-d');
            angular.element(icons).addClass('ion-checkmark-round').css({color: '#1fda9a'});
          }
        }, 300);
      };
      scope.onStateFocus = function(){
        angular.element(icons).removeClass('ion-checkmark-round ion-close-round').css({color: '#333'});
      };
      scope.onZipBlur = function(){
        angular.element(iconz).addClass('ion-loading-d');
        $timeout(function(){
          if (!CheckoutValidation.validateZipcode(scope.userinfo.zipcode)) {
            angular.element(iconz).removeClass('ion-loading-d');
            angular.element(iconz).addClass('ion-close-round').css({color: '#ED303C'});
            return;
          } else {
            angular.element(iconz).removeClass('ion-loading-d');
            angular.element(iconz).addClass('ion-checkmark-round').css({color: '#1fda9a'});
          }
        }, 300);
      };
      scope.onZipFocus = function(){
        angular.element(iconz).removeClass('ion-checkmark-round ion-close-round').css({color: '#333'});
      };
      scope.onCountryBlur = function(){
        angular.element(icons).addClass('ion-loading-d');
        $timeout(function(){
          if (!CheckoutValidation.validateName(scope.userinfo.country)) {
            angular.element(icons).removeClass('ion-loading-d');
            angular.element(icons).addClass('ion-close-round').css({color: '#ED303C'});
            return;
          } else {
            angular.element(icons).removeClass('ion-loading-d');
            angular.element(icons).addClass('ion-checkmark-round').css({color: '#1fda9a'});
          }
        }, 300);
      };
      scope.onCountryFocus = function(){
        angular.element(icons).removeClass('ion-checkmark-round ion-close-round').css({color: '#333'});
      };
    };
    return {
      restrict: 'AE',
      scope: {
        userinfo: '=',
      },
      link: link,
      templateUrl: 'templates/partials/checkout-address.html'
    };
})
*/

.directive('input', function($timeout){
     return {
         restrict: 'E',
         scope: {
             'returnClose': '=',
             'onReturn': '&'
        },
        link: function(scope, element, attr){
            element.bind('keydown', function(e){
                if(e.which == 13){
                    if(scope.returnClose){
                        //console.log('return-close true: closing keyboard');
                        element[0].blur();
                    }
                    if(scope.onReturn){
                        $timeout(function(){
                            scope.onReturn();
                        });
                    }
                }
            });
        }
    }
})

.directive('ionProductImage', function($timeout, $ionicModal, $ionicSlideBoxDelegate, cartService) {
    var link = function(scope, element, attr) {
      scope.closeModal = function() {
        scope.modal.hide();
        scope.modal.remove();
      };
      element.on('click', function(){
        $ionicModal.fromTemplateUrl('templates/partials/cart-image-modal.html', {
          animation: 'slide-left-right',
          scope: scope
        })
        .then(function(modal){
          scope.modal = modal;
          scope.modal.show();
          $timeout( function() {
            $ionicSlideBoxDelegate.update();
          });
        });
      });
    };
    return {
      restrict: 'A',
      link: link,
      scope: '='
    };
});
