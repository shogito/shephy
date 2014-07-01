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
            function(card,player){ var stat = player.draw(); player.discard(player.hand.indexOf(card)); return stat}
        ));
 
    cards.push(
        genEventCard('search', 
            function(card,player,modal){ 
                modal.open(player.deck.openAll()).result.then(
                    function(rsl){
                        player.hand.push(player.deck.uniqObjDraw(rsl));
                        player.discard(player.hand.indexOf(card));
                    },
                    function(){
                        player.discard(player.hand.indexOf(card))
                        player.drawEventCards();
                    }
                );
             }
        ));



   cards.push(
        genEventCard('huyaseyo', 
            function(card, player, modal){ 
                 if(player.field.length() >= 7 ){
                     player.discard(player.hand.indexOf(card));
                     return ;
                 }

                 var stat = player.field.put(player.crowd[1].draw()) ;
                 player.discard(player.hand.indexOf(card)); return stat}
                 
    ));



    cards.push(
        genEventCard('umeyo', 
            function(card,player,modal){ 
                 if(player.field.length() >= 7 ){
                     player.discard(player.hand.indexOf(card));
                     return ;
                 }

                modal.open(player.field.openAll()).result.then(
                    function(rsl){
                        var crowd = rsl.crowd;
                        var stat = player.field.put(player.crowd[crowd].draw());
                        player.discard(player.hand.indexOf(card));
                        // return stat;
                    },
                    function(){
                        player.discard(player.hand.indexOf(card))
                        // player.drawEventCards();
                    }
                );
             }
        ));

    cards.push(
        genEventCard('rakurai', 
            function(card,player,modal){ 

                var greatest = player.getGreatestSheep();

                var mv = player.field.uniqObjDraw(greatest);
                player.crowd[mv.crowd].put(mv);

                player.discard(player.hand.indexOf(card))
                // player.drawEventCards();
             }
        ));

    cards.push(
        genEventCard('rakurai', 
            function(card,player,modal){ 

                var greatest = player.getGreatestSheep();

                var mv = player.field.uniqObjDraw(greatest);
                player.crowd[mv.crowd].put(mv);

                player.discard(player.hand.indexOf(card))
                // player.drawEventCards();
             }
        ));

    cards.push(
        genEventCard('ookami', 
            function(card,player,modal){ 

                var greatest = player.getGreatestSheep();
                var crowd = greatest.crowd - 1

                var mv = player.field.uniqObjDraw(greatest);
                player.crowd[mv.crowd].put(mv);
                
                if( crowd >= 0 ){
                    player.field.put(player.crowd[crowd].draw());
                }

                player.discard(player.hand.indexOf(card))
                // player.drawEventCards();
             }
     ));



    cards.push(
        genEventCard('gousei', 
            function(card,player,modal){ 
                modal.open(player.field.openAll(),"true").result.then(
                    function(rsl){
                        var rank =[1,3,10,30,100,300,1000];
                         var sum = 0;
                         var target = [];
                         for (var i=0; i < rsl.length; i++){
                             if (rsl[i]){
                                 target.push(player.field.open(i + 1,1)[0]);
                                 
                                 sum += player.field.open(i+1 ,1)[0].rank;
                             }
                         }
                         
                       
                         var size = 0;
                         for (var j=0 ; j < rank.length; j++){
                             if (rank[j] <= sum){
                                 size = j;
                             console.log(rank[j]);
                             console.log(j);
                             }
                         }
                         
                         if (size >= 1){
                         modal.open( rank.slice(0,size+1)).result.then(
                             function(result){
                                 player.field.put(player.crowd[rank.indexOf(result)].draw())
                                 for (var i=0; i < target.length; i++){
                                     // target.lengtからindexOfでフィールドからクラウドに戻す
                                     var mv = target[i];
                                     var mv = player.field.uniqObjDraw(mv);
                                     player.crowd[mv.crowd].put(mv);
                                 }
                                 
                                 
                             }
                         )
                         }
                         player.discard(player.hand.indexOf(card));
                         // player.drawEventCards();
 
                      },
                    function(){
                        player.discard(player.hand.indexOf(card))
                        // player.drawEventCards();
                    }
                );
             }
        ));
        

    cards.push(
        genEventCard('mitiyo', 
            function(card,player,modal){ 
                modal.open(player.crowd[0].openAll(),"true").result.then(
                    function(rsl){
                         var target = [];
                         for (var i=0; i < rsl.length; i++){
                              target.push(player.crowd[0].open(i + 1,1)[0]);                              
                         }
                         
                         console.log(target);
                         
                         for (var i=0; i < target.length; i++){
                             if(player.field.length() >= 7 ){
                                 player.discard(player.hand.indexOf(card));
                                 return ;
                             }
                             // target.lengtからindexOfでフィールドからクラウドに戻す
                             var mv = target[i];
                             var mv = player.crowd[0].uniqObjDraw(mv);
                             player.field.put(mv);
                         
                         }
                                                  
                         player.discard(player.hand.indexOf(card));
                        // return stat;
                    },
                    function(){
                        player.discard(player.hand.indexOf(card))
                        player.drawEventCards();
                    }
        )}));


        
   cards.push(
        genEventCard('huyaseyo', 
            function(card, player){ 
                 if(player.field.length() >= 7 ){
                     player.discard(player.hand.indexOf(card));
                     return ;
                 }

                 var stat = player.field.put(player.crowd[1].draw()) ;
                 player.discard(player.hand.indexOf(card)); return stat}
    ));

   cards.push(
        genEventCard('huyaseyo', 
            function(card, player){ 
                 if(player.field.length() >= 7 ){
                     player.discard(player.hand.indexOf(card));
                     return ;
                 }

                 var stat = player.field.put(player.crowd[1].draw()) ;
                 player.discard(player.hand.indexOf(card)); return stat}
    ));

   cards.push(
        genEventCard('huyaseyo', 
            function(card, player){ 
                 if(player.field.length() >= 7 ){
                     player.discard(player.hand.indexOf(card));
                     return ;
                 }

                 var stat = player.field.put(player.crowd[1].draw()) ;
                 player.discard(player.hand.indexOf(card)); return stat}
    ));

   cards.push(
        genEventCard('huyaseyo', 
            function(card, player){ 
                 if(player.field.length() >= 7 ){
                     player.discard(player.hand.indexOf(card));
                     return ;
                 }

                 var stat = player.field.put(player.crowd[1].draw()) ;
                 player.discard(player.hand.indexOf(card)); return stat}
    ));

   cards.push(
        genEventCard('huyaseyo', 
            function(card, player){ 
                 if(player.field.length() >= 7 ){
                     player.discard(player.hand.indexOf(card));
                     return ;
                 }

                 var stat = player.field.put(player.crowd[1].draw()) ;
                 player.discard(player.hand.indexOf(card)); return stat}
    ));

   cards.push(
        genEventCard('huyaseyo', 
            function(card, player){ 
                 if(player.field.length() >= 7 ){
                     player.discard(player.hand.indexOf(card));
                     return ;
                 }

                 var stat = player.field.put(player.crowd[1].draw()) ;
                 player.discard(player.hand.indexOf(card)); return stat}
    ));

   cards.push(
        genEventCard('huyaseyo', 
            function(card, player){ 
                 if(player.field.length() >= 7 ){
                     player.discard(player.hand.indexOf(card));
                     return ;
                 }

                 var stat = player.field.put(player.crowd[1].draw()) ;
                 player.discard(player.hand.indexOf(card)); return stat}
    ));


       
        


    
    return cards
}