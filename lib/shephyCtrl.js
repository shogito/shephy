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


var instPhaseObj = function(){
    // 1.羊デッキ初期化
    sheepsCrowdDeck = genSheepsCrowd();
    // 2.羊平原初期化
    // 継承で新しクラス作ったほうがいいかも
    sheepsField = new piler([]);
    // 3.イベントデッキ初期化
    eventDeck = new piler(genEventCards());
    eventDeck.shuffle();
    // 4.ひつじ飼い初期化
    shepherd = new player( eventDeck, [], [], sheepsCrowdDeck, sheepsField );
    // shehpyObjをリターン
    shepherd.drawEventCards();
    return {shepherd:shepherd, crowd:sheepsCrowdDeck, event:eventDeck, field: sheepsField}
}

var shephyObj = instPhaseObj();

var appShephy = angular.module('shephyApp',['underscore','ngAnimate','ui.bootstrap']);
appShephy.controller('ShephyCtrl', ['$scope', function($scope){
    $scope.shephyObj = shephyObj;
    $scope.hand = shephyObj.shepherd.hand;
    
    $scope.name = "hello";
    $scope.play = function($index){
        shepherd.play($index);
        // drawいれちゃう
        shepherd.drawEventCards();
    }
    
}]);