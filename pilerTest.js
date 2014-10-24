describe("_のロード確認", function(){
	it("_のロード確認", function(){
		expect(_).toBeDefined;
	})
})

describe("pilerの初期化テスト",function(){
    it("配列オブジェクト",function(){
    	var p = piler([1,2,3,4,5])
    	expect(p).toBeDefined()
    })

    it("文字列", function(){
        var func = function(){
        	piler("");
        }
    	expect(func).toThrow('error: argument is not an Array');
    })

    it("オブジェクト", function(){
    	var func = function(){
    		piler({});
    	}
    	expect(func).toThrow('error: argument is not an Array');
    })
})

describe("piler.lengthのテスト", function(){
    beforeEach(function(){        
        this.p = [1,2,3,4,5];
        this.pile = piler(this.p);
    })
    // pのlengthとpileのlengthは等しい
    it("length参照テスト1",function(){
    	expect(this.pile.length()).toEqual(this.p.length);
    })

    // 更新系実行後のテスト書け

})

describe("openメソッドのテスト",function(){
    beforeEach(function(){
        this.p = [1,2,3,4,5];
        this.pile = piler(this.p);

    })
    // openはpileのlenghtを変動させない(非破壊)
    // 引数なし -> 全て表示する
    it("pile.open(引数なし)",function(){
    	expect(this.pile.open()).toEqual(this.p);
    	expect(this.pile.length()).toEqual(5);
    })
    // 引数一つあり -> 対象のindexのオブジェクトから一番後ろまで[]でwrapしてかえす
    it("pile.open(0)",function(){
    	expect(this.pile.open(2)).toEqual([3,4,5]);
    	expect(this.pile.length()).toEqual(5);   	
    })

    // 引数一つあり(out of range) -> []を返す
    it("pile.open(out of range)",function(){
    	expect(this.pile.open(5)).toEqual([]);
    	expect(this.pile.length()).toEqual(5);   	
    })

    // 引数ふたつで一個だけ -> 第一引数のindexから第二引数個返す
    it("pile.open(2,1)",function(){
    	expect(this.pile.open(2,1)).toEqual([3]);
    	expect(this.pile.length()).toEqual(5);   	
    })

    // 引数ふたつ -> 第一引数から第二引数個分配列で返す
    it("pile.open(2,3)",function(){
    	expect(this.pile.open(2,3)).toEqual([3,4,5]);
    	expect(this.pile.length()).toEqual(5);   	
    })

    // 引数ふたつ(第一引数が最大indexと一緒)
    it("pile.open(this.pile.length() - 1,3)",function(){
    	expect(this.pile.open(this.pile.length() - 1,3)).toEqual([5]);
    	expect(this.pile.length()).toEqual(5);   	
    })

    // 引数ふたつで第一引数がマイナス方向にout of range
    it("pile.open(-1,5)",function(){
    	expect(this.pile.open(-1,5)).toEqual([]);
    	expect(this.pile.length()).toEqual(5);   	
    })

    // 引数ふたつで第一引数がプラス方向にout of range
    it("pile.open(5,5)",function(){
    	expect(this.pile.open(5,5)).toEqual([]);
    	expect(this.pile.length()).toEqual(5);   	
    })

    // 配列数よりも第二引数に渡したindexがout of range
    it("pile.open(5,5)",function(){
    	expect(this.pile.open(2,18)).toEqual([3,4,5]);
    	expect(this.pile.length()).toEqual(5);   	
    })

    // 
    it("pile.open(5,5)",function(){
    	expect(this.pile.open(2,18)).toEqual([3,4,5]);
    	expect(this.pile.length()).toEqual(5);   	
    })


})

describe("drawメソッドテスト。存在しないindexがあれば例外スローする",function(){
    beforeEach(function(){
    	this.p = [1,2,3,4,5];
    	this.pile = piler(this.p);
    })
    it("pile.draw()引数なし。空になるまで引き続ける",function(){
        expect(JSON.stringify(this.pile.draw())).toEqual(JSON.stringify([1]));
        expect(this.pile.length()).toEqual(4);
        expect(JSON.stringify(this.pile.open())).toEqual(JSON.stringify([2,3,4,5]));

        expect(JSON.stringify(this.pile.draw())).toEqual(JSON.stringify([2]));
        expect(this.pile.length()).toEqual(3);
        expect(JSON.stringify(this.pile.open())).toEqual(JSON.stringify([3,4,5]));

        expect(JSON.stringify(this.pile.draw())).toEqual(JSON.stringify([3]));
        expect(this.pile.length()).toEqual(2);
        expect(JSON.stringify(this.pile.open())).toEqual(JSON.stringify([4,5]));

        expect(JSON.stringify(this.pile.draw())).toEqual(JSON.stringify([4]));
        expect(this.pile.length()).toEqual(1);
        expect(JSON.stringify(this.pile.open())).toEqual(JSON.stringify([5]));

        expect(JSON.stringify(this.pile.draw())).toEqual(JSON.stringify([5]));
        expect(this.pile.length()).toEqual(0);
        expect(JSON.stringify(this.pile.open())).toEqual(JSON.stringify([]));
        
        // 例外テスト
        var pile = this.pile
        var func = function(){
            pile.draw();
        }
        expect(func).toThrow('error: index out of Range');
        expect(this.pile.length()).toEqual(0);
        expect(JSON.stringify(this.pile.open())).toEqual(JSON.stringify([]));
    })
    it("pile.draw()引数あり(minimal:0)",function(){
        expect(JSON.stringify(this.pile.draw(0))).toEqual(JSON.stringify([1]));
        expect(this.pile.length()).toEqual(4);
        expect(JSON.stringify(this.pile.open())).toEqual(JSON.stringify([2,3,4,5]));
    })
    it("pile.draw()引数あり(max:4)",function(){
        expect(JSON.stringify(this.pile.draw(4))).toEqual(JSON.stringify([5]));
        expect(this.pile.length()).toEqual(4);
        expect(JSON.stringify(this.pile.open())).toEqual(JSON.stringify([1,2,3,4]));
    })
    it("pile.draw()引数あり(out of index:5)",function(){
        // 例外テスト
        var pile = this.pile
        var func = function(){
            pile.draw(5);
        } 
        expect(func).toThrow("error: index out of Range");
        expect(this.pile.length()).toEqual(5);
        expect(JSON.stringify(this.pile.open())).toEqual(JSON.stringify([1,2,3,4,5]));
    })
    it("pile.draw()引数あり(minus:-1)",function(){
        expect(JSON.stringify(this.pile.draw(-1))).toEqual(JSON.stringify([5]));
        expect(this.pile.length()).toEqual(4);
        expect(JSON.stringify(this.pile.open())).toEqual(JSON.stringify([1,2,3,4]));
    })
})