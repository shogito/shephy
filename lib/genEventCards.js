"use strict"
function genEventCards(){
    var cards = [];
    
    function genEventCard(name, action){
        return {
            name: name,
            action: action
        }
    }

    // testデータ
    cards.push(
        genEventCard('draw', 
            function(card){ var stat = this.draw(); this.discard(this.hand.indexOf(card)); return stat}
        ));
    cards.push(
        genEventCard('draw', 
            function(card){ var stat = this.draw(); this.discard(this.hand.indexOf(card)); return stat}
        ));
    cards.push(
        genEventCard('draw', 
            function(card){ var stat = this.draw(); this.discard(this.hand.indexOf(card)); return stat}
        ));
    cards.push(
        genEventCard('draw', 
            function(card){ var stat = this.draw(); this.discard(this.hand.indexOf(card)); return stat}
        ));
    cards.push(
        genEventCard('draw', 
            function(card){ var stat = this.draw(); this.discard(this.hand.indexOf(card)); return stat}
        ));
    cards.push(
        genEventCard('draw', 
            function(card){ var stat = this.draw(); this.discard(this.hand.indexOf(card)); return stat}
        ));
    cards.push(
        genEventCard('draw', 
            function(card){ var stat = this.draw(); this.discard(this.hand.indexOf(card)); return stat}
        ));
    cards.push(
        genEventCard('draw', 
            function(card){ var stat = this.draw(); this.discard(this.hand.indexOf(card)); return stat}
        ));
    cards.push(
        genEventCard('draw', 
            function(card){ var stat = this.draw(); this.discard(this.hand.indexOf(card)); return stat}
        ));
    cards.push(
        genEventCard('huyaseyo', 
            function(card){ var stat = this.field.put(this.crowd[1].draw()) ; this.discard(this.hand.indexOf(card)); return stat}
        ));
    cards.push(
        genEventCard('huyaseyo', 
            function(card){ var stat = this.field.put(this.crowd[1].draw()) ; this.discard(this.hand.indexOf(card)); return stat}
        ));
       cards.push(
        genEventCard('huyaseyo', 
            function(card){ var stat = this.field.put(this.crowd[1].draw()) ; this.discard(this.hand.indexOf(card)); return stat}
        ));
       cards.push(
        genEventCard('huyaseyo', 
            function(card){ var stat = this.field.put(this.crowd[1].draw()) ; this.discard(this.hand.indexOf(card)); return stat}
        ));
       cards.push(
        genEventCard('huyaseyo', 
            function(card){ var stat = this.field.put(this.crowd[1].draw()) ; this.discard(this.hand.indexOf(card)); return stat}
        ));
       cards.push(
        genEventCard('huyaseyo', 
            function(card){ var stat = this.field.put(this.crowd[1].draw()) ; this.discard(this.hand.indexOf(card)); return stat}
        ));
   


    
    return cards
}