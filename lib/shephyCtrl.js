"use strict"

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

// 羊むれ生成
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

appShephy.controller('ShephyCtrl', ['$scope','shepherd', function($scope, shepherd){
// 初期shuffleしてdraw
    shepherd.deck.shuffle();
    shepherd.drawEventCards();
    
    $scope.hand = shepherd.hand;
    
    $scope.name = "hello";
    $scope.play = function($index){
        shepherd.play($index);
        // drawいれちゃう
        shepherd.drawEventCards();
    }
    
}]);