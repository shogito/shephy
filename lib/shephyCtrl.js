"use strict"

// _.jsをサービス化
var underscore = angular.module('underscore',[]);
underscore.factory('_', function(){
    return window._;
});







// Shephy Environment
var sheepsField = [];
var sheepsCrowdDeck = [];
var eventDeck = [];
var enemySheeps = [1,10,100,1000];
var shepherd = {};

// Shephy Phase Object
var instPhase // sheepsDeck, sheepsField, deck, player初期化
var mainPhase // げーむが終わるまで再帰処理
  var drawPhase // player.draw();
  var playPhase // player.action(); 
  var checkPhase // enemySheepsチェック, hand/deck枚数チェック -> ライブラリシャッフルとgrowEnemy, sheepsFieldチェック,
var resultPhase // 羊スコアを表示

// func:羊むれ生成
var genSheepsCrowd = function(){
    var deck = [];
    var sheepsCrowd = [1,3,10,30,100,300,1000];
    
    function genSheepCard(id,rank,crowd){    
        return {
            id:id,
            rank:rank,
            crowd:crowd,
        }
    }

    for (var rank in sheepsCrowd){
        var _deck = [];
        for (var id in _.range(7)){
            _deck.push(genSheepCard(id, sheepsCrowd[rank], rank));
        }
        deck.push(new piler(_deck));
    }
    return deck;
}    


var appShephy = angular.module('shephyApp',['underscore','ngAnimate','ui.bootstrap']);

// 各ゲームオブジェクトをサービス化
angular.module('shephyApp').factory('sheepsCrowdDeck',genSheepsCrowd);
angular.module('shephyApp').factory('sheepsField',function(){return new piler([])});
angular.module('shephyApp').factory('eventDeck',function(){return new piler(genEventCards())});
// DI
angular.module('shephyApp').factory('shepherd',["sheepsCrowdDeck","sheepsField","eventDeck",
    function(sheepsCrowdDeck,sheepsField,eventDeck){
        return new player(eventDeck, [], [], sheepsCrowdDeck, sheepsField);
    }]);

// modalラッパ
angular.module('shephyApp').factory('modal', ["$modal", function($modal){
    var selected = "";
    // multiの真偽値によってチェックボックスと単一選択を切り替え
    var open = function(objs, multi){
        // ooen()によってモーダルが開いてmodalInctanceが返る
        // promieはmodalincetanceに記述
        return $modal.open({
           templateUrl: 'myModalContent.html',
           controller: ModalInstanceCtrl,
           resolve: {
             objs: function () {
               return objs;
             },
             multi: function() {
                 return multi;
             }
           }
        });
    }    

    return {open:open};

}]);


var ModalInstanceCtrl = function ($scope, $modalInstance, objs, multi) {
  $scope.multi = multi;
  $scope.checkedItems = [];
  $scope.items = objs;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    if(objs.length <= 0){
        $modalInstance.dismiss('cant select');
        return
    };
    
    if($scope.multi){
        $modalInstance.close($scope.checkedItems);  
        return
    }
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  
};

appShephy.controller('ShephyCtrl', ['$scope','$q','shepherd','modal', function($scope,$q,shepherd,modal){
// 初期shuffleしてdraw
// ctrは基本player経由でゲームオブジェクト触る。メディエイターパターン？
   
    shepherd.deck.shuffle();
    shepherd.drawEventCards();
    shepherd.field.put(shepherd.crowd[0].draw());
    
    $scope.sheeps = 0;
    $scope.enemys = 0;
    $scope.hand = shepherd.hand;
    $scope.shepherd = shepherd;
    
    function asPlay(target, shepherd, modal){
        var deferred = $q.defer();
        
        target.action(target, shepherd, modal, deferred);
        
        deferred.reject();
        
        return deferred.promise;

    }
    
    
    // viewへのインターフェイス
    $scope.play = function($index){
    // modal.openでアクセス可能
        var target = shepherd.hand[$index];
        
        var promise = asPlay(target, shepherd, modal);
        
        // playしたらチェックフェイズに
        promise.finally(
           function(){ shepherd.drawEventCards() ;}
        );
    }    
    
}]);





// あるごりずむ
/*
オブジェクト
・コントローラ
・羊飼い
・アクション

1.コントローラがonclickを受け取る
2.handのうちどれかを探す
3.action = sheperd.hand[inx].actionで探索

// searchに必要なaction
1.action('')
2.サービス：modal(sheperd.deck || sheperd.hand)を開くよう指示
3.ok()でpromiseを受け取る
4.sheperd.search('uketottano')
5.selfをdiscard
6.drawEventを発行
*/