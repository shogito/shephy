"use strict"
function genEventCards(){
    var cards = [];
    
    function genEventCard(name, description, img, action, returnFormat){
        return {
            name: name,
            description: description, 
            action: action,
            img: img,
            returnFormat: returnFormat  // [index,index] or [obj,obj]
        }
    }

    // testデータ
/*    cards.push(
        genEventCard('draw', 
            function(card,player){ var stat = player.draw(); player.discard(player.hand.indexOf(card)); return stat}
        ));
*/ 
    cards.push(
        genEventCard('search', 'さがします', 'img',
            function(card,player,modal,def){ 
                modal.open(player.deck.openAll(),{"limit":1,"needs":1,"card":card, "player":player}).result.then(
                    function(rsl){
                        rsl = rsl;
                        player.hand.push(player.deck.uniqObjDraw(rsl));
                        player.discard(player.hand.indexOf(card));
                        def.resolve('search');

                    },
                    function(){
                        player.discard(player.hand.indexOf(card))
                        player.drawEventCards();
                        def.reject('search');
                    }
                );
             }
        ));



   cards.push(
        genEventCard('huyaseyo', '3をフィールドに置く', 'img',
            function(card, player, modal, def){ 
                 if(player.field.length() >= 7 ){
                     player.discard(player.hand.indexOf(card));
                     def.reject('huyaseyo');
                     return ;
                 }

                 var stat = player.field.put(player.crowd[1].draw()) ;
                 player.discard(player.hand.indexOf(card));
                 console.log(def);
                 def.resolve('huyaseyo');
            }
    ));



    cards.push(
        genEventCard('umeyo', 'フィールドにある羊のコピーをフィールドに置く', 'img',
            function(card,player,modal,def){ 
                 if(player.field.length() >= 7 ){
                     player.discard(player.hand.indexOf(card));
                     def.reject('umeyo');
                     return ;
                 }

                modal.open(player.field.openAll(),{"limit":1,"needs":1,"card":card, "player":player}).result.then(
                    function(rsl){
                        var crowd = player.field.open(rsl[0]+1);
                        var stat = player.field.put(player.crowd[crowd].draw());
                        player.discard(player.hand.indexOf(card));
                        def.resolve('umeyo');
                        // return stat;
                    },
                    function(){
                        player.discard(player.hand.indexOf(card))
                        def.reject('umeyo');
                        // player.drawEventCards();
                    }
                );
             }
        ));

    cards.push(
        genEventCard('inu', '手札から１枚捨てます。', 'img',
            function(card,player,modal, def){ 

                modal.open(player.hand,{"limit":1,"needs":1,"card":card, "player":player}).result.then(
                    function(target){
                        player.discard(player.hand.indexOf(target));
                        player.discard(player.hand.indexOf(card));
                        def.resolve('inu');
                        // return stat;
                    },
                    function(){
                        player.discard(player.hand.indexOf(card))
                        def.reject('inu');
                        // player.drawEventCards();
                    }
                );
             }
        ));

/* 3mai 選ばせるのがめんどくさい考えれ
        cards.push(
            genEventCard('meteor', 
                function(card,player,modal, def){ 
    
                    modal.open(player.filed.openAll,true).result.then(
                        function(target){
    
                    for (var i = 0; i < len; i++){
                        var mv = player.field.draw();
                        player.crowd[mv.crowd].put(mv);
                    }
    
    
                            player.discard(player.hand.indexOf(target));
                            player.discard(player.hand.indexOf(card));
                            def.resolve('inu');
                            // return stat;
                        },
                        function(){
                            player.discard(player.hand.indexOf(card))
                            def.reject('inu');
                            // player.drawEventCards();
                        }
                    );
                 }
            ));
*/

    cards.push(
        genEventCard('taisakuhituzi',  '手札から１枚除外します。', 'img',
            function(card,player,modal, def){ 

                modal.open(player.hand,{"limit":1,"needs":1,"card":card, "player":player}).result.then(
                    function(target){
                        player.removeCard(player.hand.indexOf(target));
                        player.discard(player.hand.indexOf(card));
                        def.resolve('remove');
                        // return stat;
                    },
                    function(){
                        player.discard(player.hand.indexOf(card))
                        def.reject('remove');
                        // player.drawEventCards();
                    }
                );
             }
        ));



    cards.push(
        genEventCard('rakurai', 'フィールドの一番大きな羊を戻します。', 'img',
            function(card,player,modal, def){ 

                var greatest = player.getGreatestSheep();

                var mv = player.field.uniqObjDraw(greatest);
                player.crowd[mv.crowd].put(mv);

                player.discard(player.hand.indexOf(card))
                def.resolve('rakurai');
                // player.drawEventCards();
             }
        ));





        
        cards.push(
        genEventCard('shephyron', 'フィールドの羊をすべて戻します。', 'img',
            function(card,player,modal, def){ 

                var len = player.field.length();

                for (var i = 0; i < len; i++){
                    var mv = player.field.draw();
                    player.crowd[mv.crowd].put(mv);
                }

                player.discard(player.hand.indexOf(card))
                def.resolve('shephyron');
                // player.drawEventCards();
             }
        ));    


    cards.push(
        genEventCard('ookami', 'フィールド上の最大の羊をランクダウンさせます', 'img',
            function(card,player,modal,def){ 

                var greatest = player.getGreatestSheep();
                var crowd = greatest.crowd - 1

                var mv = player.field.uniqObjDraw(greatest);
                player.crowd[mv.crowd].put(mv);
                
                if( crowd >= 0 ){
                    player.field.put(player.crowd[crowd].draw());
                }

                player.discard(player.hand.indexOf(card))
                def.resolve('ookami');
             }
     ));



    cards.push(
        genEventCard('gousei', 'ごうせい', 'img',
            function(card,player,modal,def){ 
                modal.open(player.field.openAll(),{"limit":7,"needs":0,"card":card, "player":player}).result.then(
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
                         def.resolve('gousei');
                         // player.drawEventCards();
 
                      },
                    function(){
                        player.discard(player.hand.indexOf(card))
                        def.reject('gousei');
                        // player.drawEventCards();
                    }
                );
             }
        ));
        

    cards.push(
        genEventCard('mitiyo', '望む数の１をフィールドに置きます(最大7まで)', 'img',
            function(card,player,modal,def){ 
                modal.open(player.crowd[0].openAll()
                    ,{"limit":7,"needs":0, "card":card, "player":player}).result.then(
                    function(rsl){
                         console.log(rsl);
                         var target = [];
                         for (var i=0; i < rsl.length; i++){
                              target.push(player.crowd[0].open(i + 1,1)[0]);                              
                         }
                                                  
                         for (var i=0; i < target.length; i++){
                             if(player.field.length() >= 7 ){
                                 player.discard(player.hand.indexOf(card));
                                 def.reject('mitiyo')
                                 return ;
                             }
                             // target.lengtからindexOfでフィールドからクラウドに戻す
                             var mv = target[i];
                             var mv = player.crowd[0].uniqObjDraw(mv);
                             player.field.put(mv);
                         
                         }
                                                  
                         player.discard(player.hand.indexOf(card));
                         def.resolve('mityo');
                        // return stat;
                    },
                    function(){
                        player.discard(player.hand.indexOf(card))
                        def.reject('mityo');
                    }
        )}));


        
       
        


    
    return cards
}