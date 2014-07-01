"use strict"
function player(deck, trash, removed, crowd, field){
    this.field = field;
    this.trash = trash;
    this.deck = deck;
    this.hand = [];
    this.removed = removed;
    this.crowd = crowd;
    
    // pilerオブジェクトのラッパ
    this.draw = function(){
        var _drawed = this.deck.draw();
        if(_drawed === "empty"){
            // 返り値がemptyならそのままemptyをreturnする
            return _drawed;
        }
        this.hand.push(_drawed);
    }

    // handが5かpileが0になるまで引く
    // shephyルール
    this.drawEventCards = function(){
        if (this.hand.length >= 5 || this.deck.length() <=0 ){
            return {hand:this.hand.length, deck:this.deck.length()};
        }
        this.draw()
        // 再帰実行
        this.drawEventCards()
    }
    
    this.show = function(){
        return this.hand;
    }
    
    this.change = function(idx){
        if (this.hand.length > idx && 0 <= idx){
            this.trash.push(this.hand.splice(idx,1)[0]);
            this.hand.push(this.deck.draw());
        }
    }
    
    this.discard = function(idx){
        if(this.hand.length > 0){
            this.trash.push(this.hand.splice(idx,1)[0])
        }
    }
    
    this.removeCard = function(idx){
        if(this.hand.length > 0){
            this.removed.push(this.hand.splice(idx,1)[0])
        }
    }

    this.getGreatestSheep = function(){
        return _.max(this.field.openAll(), function(size){
            return size.rank;
        })
    }
    
    this.getSheepsCount = function(){
        return _.reduce(this.field.openAll(),function(memo,num){ return memo + num.rank},0);
    }

    this.getSameSheeps = function(rank){
        return _.where(this.field.openAll(),{rank:rank}) ;
    }

}