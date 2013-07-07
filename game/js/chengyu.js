$(function(){
	var Game={};
	Game.beginPart=function(){
		var btuSingle=$(".btu-single"),
			btuBack=$(".btu-back"),
			mainPage=$("#mainPage"),
			singleLevels=$("#single-levels");
		btuSingle.click(function(){
			console.log("ok");
			mainPage.css("left","-100%");
			singleLevels.css("left","0");
			$.ajax({url:Game.url}).done(function(data){
				Game.idiomData=data;
			});
		});
		btuBack.click(function(){
			console.log("ok");
			mainPage.css("left","0%");
			singleLevels.css("left","100%");
		});
	}
	Game.beginPart();
	Game.levels=[
		{
			"level":1,
			"isOpen":true,
			"col":4,      /*列的个数*/
			"row":2 ,      /*行的个数*/
			"reactDiv":$(".btu-level1")
		},{
			"level":2,
			"isOpen":true,
			"col":4,      /*列的个数*/
			"row":3,       /*行的个数*/
			"reactDiv":$(".btu-level2")
		},{
			"level":3,
			"isOpen":true,
			"col":4,      /*列的个数*/
			"row":4,       /*行的个数*/
			"reactDiv":$(".btu-level3")
		},{
			"level":4,
			"isOpen":true,
			"col":4,      /*列的个数*/
			"row":5,       /*行的个数*/
			"reactDiv":$(".btu-level4")
		},{
			"level":5,
			"isOpen":false,
			"col":4,      /*列的个数*/
			"row":6,       /*行的个数*/
			"reactDiv":$(".btu-level-close1")
		},{
			"level":6,
			"isOpen":true,
			"col":4,      /*列的个数*/
			"row":7,       /*行的个数*/
			"reactDiv":$(".btu-level-close2")
		}
	];
	function Player(){
		this.level=0;
		this.score=5;
		this.finishedLevel=[];  /*已经完成了的关卡*/
	}
	function Word(name,worldId){
		this.name=name||"";
		this.worldId=worldId||0;
	}
	Word.prototype.sayId=function(){
		return this.worldId||0;
	}
	function shuffle(){     /*排序用*/
		return 0.5-Math.random();
	}
	function removeArray(array,n){
		array.splice(n,1);
	}
	Game.single={};
	Game.url="idiom/chengyu.json";
	Game.single.currentLevel=0;  /*当前关卡*/
	Game.idiomsList=[];
	Game.wordsList=[];
	Game.getIdioms=function(num){
		var length,data=Game.idiomData;
			data.sort(shuffle);	
			Game.idiomsList=[],
			str="",
			theIdiom={};
		for(var i=0;i<num/4;i++)
		{	
				var ran=parseInt(length*Math.random());
				Game.idiomsList.push(data.splice(ran,1));
		}
		length=Game.idiomsList.length;
		for(var j=0;j<length;j++){
			for(var z=0;z<4;z++){
				theIdiom=Game.idiomsList[j];
				//console.log(theIdiom[0].idiom);
				str=theIdiom[0].idiom.slice(z,z+1);
				var wordNew=new Word(str,theIdiom[0].idiomId);
				Game.wordsList.push(wordNew);
				Game.wordsList.sort(shuffle);
			}
		}
		return Game.wordsList;
	}
	Game.single.constructDom=function(num){  /*根据所在的关卡，建立相应数量的dom*/
		var idiomsList,wordsList;
		wordList=Game.getIdioms(num);
		$(".idiom-word:first-child").text(wordList[0].name).attr("data-num",0);
		for(var i=0;i<num-1;i++){
			var that=$(".idiom-word:first-child").clone().text(wordList[i+1].name).attr("data-num",i+1).appendTo("#idiom");
		}
		$("#idiom").children().each(function(index){
			$(this).css({
				"left":($(this).width()+12)*(index%4),
				"top":($(this).height()+12)*Math.floor(index/4)
			});
		});
	}
	Game.single.startLevel=function(){
		var levelsList=$(".levels-list"),
			mainGame=$("#game"),
			levels=Game.levels,
			worldNum=0;
		levelsList.click(function(event){
			var target=event.target;
			for(var level in levels){
				var le=levels[level];
					levelDiv=le.reactDiv[0],
					sureLevel=le.level,
					row=le.row,
					col=le.col;
				if(target==levelDiv){
					Game.single.currentLevel=sureLevel;
					Game.single.constructDom(row*col);
					
				}
			}
			mainGame.show();
		});
	};
	Game.single.startLevel();
	Game.single.clickWord=[];
	function isAnIdiom(array){
		var a=[],len=array.length;
		for(var i=0;i<len;i++){
			if(array[i]){
				console.log(array[i].sayId());
				a.push(array[i].sayId());
			}
		}
		console.log(a);
		if(a[0]==a[1]&&a[0]==a[2]&&a[0]==a[3]&&a[1]==a[2]&&a[1]==a[3]&&a[2]==a[3]){
			return true;
		}
		else{
			return false;
		}
	}
	Game.single.clickEvent=function(){
		var addClassName="active",theNum,n=0;
		$("#idiom").click(function(event){
			var target=$(event.target);
			theNum=target.data("num");
			if(target.hasClass(addClassName)){
				target.removeClass(addClassName);
				delete Game.single.clickWord[theNum];
				n--;
			}
			else{
				n++;
				target.addClass(addClassName);
				Game.single.clickWord[theNum]=Game.wordsList[theNum];
			}
			console.log(Game.single.clickWord);
			var wordListChild=$("#idiom").children();
			if(n==4){
				n=0;
				setTimeout(function(){
					if(isAnIdiom(Game.single.clickWord)){
						wordListChild.each(function(){
							if($(this).hasClass(addClassName)){
								$(this).remove();
							}
						});
					}
					else{
						wordListChild.each(function(){
							if($(this).hasClass(addClassName)){
								$(this).removeClass(addClassName);
							}
						});
					}
					Game.single.clickWord=[];
				},500);
			}
			
		});
	}	
	Game.single.clickEvent();
});