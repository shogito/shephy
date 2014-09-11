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
var round = 0;
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

// modal wrapping service
angular.module('shephyApp').factory('modal', ["$modal", function($modal){
    
    var ckeckedItems = [];
    var open = function(objs, options, checkedItems){
        // ooen()によってモーダルが開いてmodalInctanceが返る
        // promieはmodalincetanceに記述
        
        // opstions
        // { rejectable: t/f ,  // 選択の破棄が可能か
        //   resolvable: t/f ,  // 選択解決ができるか
        //   static: t/f, // 枠外をクリックした時にrejectとなるか
        //   limit: num,  // 最大選択数
        //   needs: num   // 最小選択数  limit = needs = 1で単一選択
        // }
        
        
        return $modal.open({
           templateUrl: 'myModalContent.html',
           controller: ModalInstanceCtrl,
           resolve: {
             objs: function () {
               return objs;
             },
             options: function() {
                 return options;
             },
             checkedItems: function(){
                 return checkedItems;
             }
           }
        });
    }    

    return {open:open};

}]);


var ModalInstanceCtrl = function ($scope, $modalInstance, objs, options, checkedItems) {
  var selected = [];
  var limit = (function(){if(options.limit){return options.limit} else { return 1 }})();
  var needs = (function(){if(options.needs){return options.needs} else { return 1 }})();
  var items = objs;
  $scope.card = options.card;
  $scope.checkedItems = [];
  $scope.items = items;
  $scope.needs = needs;

  $scope.ok = function () {
    alert(selected);
    $modalInstance.close(selected);
  };
  
  $scope.valid = function(){
      if ( $scope.selectedLength >= needs && $scope.selectedLength <= limit ){
          return true;
      } 
      return false;    
  }

  $scope.choice = function($index){
      if (selected.indexOf($index) >= 0){
          selected.splice(selected.indexOf($index),1);
      } else {
          selected.push($index);
      }
      
      if (selected.length > limit){
          selected.splice(0,1);
      }
      
      $scope.selected = [];
      
      for (var i = 0; i < items.length ; i++){
          if ( selected.indexOf(i) >= 0 ){
              $scope.selected.push(true);
          } else {
              $scope.selected.push(false);
          }
          
          $scope.selectedLength = selected.length;
      }
      
            
  }

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
    
    $scope.sheeps = shepherd.getSheepsCount();
    $scope.enemys = enemySheeps[round];
    $scope.hand = shepherd.hand;
    $scope.shepherd = shepherd;
    
    function asPlay(target, shepherd, modal){
        var def = $q.defer();
        
        target.action(target, shepherd, modal, def);
        
        
        return def.promise;

    }
    
    
    // viewへのインターフェイス
    $scope.play = function($index){

        // modal.openでアクセス可能
        var target = shepherd.hand[$index];
        var promise = asPlay(target, shepherd, modal);


        // playしたらチェックフェイズに
        promise.finally(
           function(){ 
              console.log("finaly");            
              
              // 敗北判定
              console.log("haibokuhantei")
              
              if( shepherd.field.length() <= 0){
                  alert("Your Lose!!!");
                  return
              }
              
              // 勝利判定
              console.log("syourihantei")

              if( shepherd.getSheepsCount() >= 1000){
                  alert("Your Win!!!");
                  return
              }
            
            
              
            // ライブラリ戻す。エネミーカウントアップ
              console.log("refresh")
              console.log(shepherd.hand.length, shepherd.deck.length())

            if ( shepherd.hand.length === 0 && shepherd.deck.length() === 0 ){
                console.log("refreshing")
                
                shepherd.deck.put(shepherd.trash);
                shepherd.deck.shuffle();

                shepherd.trash = [];
                round++
                $scope.enemys = enemySheeps[round]
                console.log(enemySheeps[round])
                
                if ($scope.enemys >= 1000){
                    alert("Your Lose!!!");
                    return
                }
            }

              console.log("draw")

            shepherd.drawEventCards();
                        // current sheeps更新  
            $scope.sheeps = shepherd.getSheepsCount();

            
            
        }
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
