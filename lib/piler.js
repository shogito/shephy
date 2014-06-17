"use strict"
// underscore.js依存
function piler(_pile){
    
    var _initPile = [].concat(_pile);
    var _length = _pile.length;
    var _maxIdx = _pile.length - 1;

    var updateLength = function(){
        _length = _pile.length;
        _maxIdx = _pile.length - 1;
    }
    
    var random = function(_num){
        return Math.floor(Math.random() * _num);
    }
    
    var showIndexes = function(){
        return _pile.length;
    }
    
    var shuffle = function(){
        _pile = _.shuffle(_pile);
    }
    
    var randomDraw = function(){
        _num = random(_maxIdx);        
        if(_length > 0){
            var _drawed = _pile.splice(_num, 1)[0];
            updateLength();
            return _drawed;
        }
        return "empty";
    }

    var draw = function(_num){
        if(_num === undefined){
            _num = 0;
        }       
        if(_length > 0){
            var _drawed = _pile.splice(_num, 1)[0];
            updateLength();
            return _drawed;
        }
        return "empty";
    }
    

    var reset = function(){
        _pile = [].concat(_initPile);
        updateLength();
    }
    
    var open = function(_idx, _num){
        _idx = _idx - 1 || 0;
        _num = arguments[1] || 1;
        
        return _pile.slice(_idx, _idx + _num);
    }

    var reverseOpen = function(_idx, _num){
        _idx = _idx - 1 || 0;
        _num = arguments[1] || 0;
        var _rsl = new Array(_num);
        var _start = _maxIdx - _idx;
        
        for (var _i = 0; _i < _num ; _i++){
            _rsl[_i] = _pile[_start - _i];
        }
        
        return _rsl;
    }
    
    var put = function(_put, _idx){
        _pile = _pile.concat(_put);
        updateLength();
        return _put;
    }
    
    var cut = function(_num){
        var _cut = _pile.splice(0, Math.ceil(_length/2));
        updateLength();
        return piler(_cut);
    }
    
    var concatPile = function(_pileObj){
        _pile = _pile.concat(_pileObj.opennAll());
        updateLength();
//        delete _pileObj;
    }
    
// _で書き換えろ    
    var uniqSearch = function(fn){
        var _rsl;
        for (var _i = 0; _i < _length; _i++){
            if (fn(_pile[_i])){
                return _i;
            }
        }
    }
    
// _で書き換えろ
    var uniqNumberSearch = function(_num){
        var fn = function(x){
            if(x === _num){
                return true;
            }
        }
        return uniqSearch(fn);
    }
    
    return {
        draw: draw,
        randomDraw: randomDraw,
        length: showIndexes,
        shuffle: shuffle,
        reset: reset,
        open: open,
        rOpen: reverseOpen,
        openAll: function() { return open(1, _length);},
        put: put,
        cut: cut,
        concat: concatPile,
//        uniqSearch: uniqSearch,
//        uniqNumberSearch: uniqNumberSearch
    };    
}