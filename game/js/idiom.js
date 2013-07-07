$(function(){
	/******  Game   *******/
	var Game={
		levels:[
		{
			"level":1,
			"isOpen":true,
			"col":4,      /*列的个数*/
			"row":2 ,      /*行的个数*/
			"reactDiv":$(".btu-level1"),
			"time":300000      //完成时间  ms为单位
		},{
			"level":2,
			"isOpen":true,
			"col":4,      /*列的个数*/
			"row":3,       /*行的个数*/
			"reactDiv":$(".btu-level2"),
			"time":250000
		},{
			"level":3,
			"isOpen":true,
			"col":4,      /*列的个数*/
			"row":4,       /*行的个数*/
			"reactDiv":$(".btu-level3"),
			"time":200000
		},{
			"level":4,
			"isOpen":true,
			"col":4,      /*列的个数*/
			"row":5,       /*行的个数*/
			"reactDiv":$(".btu-level4"),
			"time":200000
		},{
			"level":5,
			"isOpen":false,
			"col":4,      /*列的个数*/
			"row":6,       /*行的个数*/
			"reactDiv":$(".btu-level-close1"),
			"time":300000
		},{
			"level":6,
			"isOpen":true,
			"col":4,      /*列的个数*/
			"row":7,       /*行的个数*/
			"reactDiv":$(".btu-level-close2"),
			"time":300000
		}
	],
	canvas:$("#gameCanvas"),    //获取canvas的dom
	cWidth:0,                   //canvas的宽度
	cHeight:0,                  //canvas的高度
	currentLevel:0,             //当前所在关卡
	wordRectWidth:70,           //字块的宽度
	wordRectHeight:70,          //字块的高度
	ctx:null,                   //canvas上下文
	idiomData:[],                //json文件的data数据
	url:"idiom/chengyu.json",     //json文件的url
	idiomsList:[],                //当前关卡选中的成语
	wordsList:[],
	//选中的成语拆分成Word类的集合
	currentIdiomsCount:0,           //现在关卡的成语个数
	single:null,                    //单人玩家 Play类
	scoreCount:null,                   //计时Score类
	heartsList:[],                    //放心用的
	idiomDataNoChange:[],             //不变的data数据，每次用它复原idiomData
	dataSource:{
		imgCache:[],        //照片缓存
		countLoad:{
			totalImage:0,
			loadedImage:0
		}
	}
	};
	Game.canvas[0].height=document.documentElement.clientHeight;               //设置canvas的高度跟窗口同高
	Game.canvas[0].width=document.documentElement.clientWidth;                //设置canvas的高度跟窗口同宽
	Game.cWidth=Game.canvas[0].width;   
	Game.cHeight=Game.canvas[0].height;
	Game.ctx=Game.canvas[0].getContext("2d");
	
	/*************/
	
	/****** 通用函数 *******/
	function shuffle(){     /*排序用*/
		return 0.5-Math.random();
	}
	function inWhichRect(x,y,wordArray){   //判断在哪个方块，wordArray是Word类数组
		var h=Game.wordRectHeight,w=Game.wordRectWidth,wx,wy,len;
		len=wordArray.length;
		for(var i=0;i<len;i++){
			wx=wordArray[i].x;
			wy=wordArray[i].y;
			if(x>=wx&&x<=wx+w&&wy<=y&&y<=wy+h){
				return i;
			}
		}
		if(i==len){
			return null;
		}
	}
	function removeWord(wordArray,word)  //除掉word集合中的某一个word类
	{
		var len=wordArray.len,n;
		for(var i=0;i<len;i++){
			if(wordArray[i].name==word.name&&wordArray[i].idiomId==word.idiomId){
				n=i;
			}
		}
		wordArray.splice(n,1);
		return wordArray;
	}
	function isAnIdiom(array){           //判断是否是成语
		var a=[],len=array.length;
		for(var i=0;i<len;i++){
			if(array[i]){
				a.push(array[i].sayId());
			}
		}
		if(a[0]==a[1]&&a[0]==a[2]&&a[0]==a[3]&&a[1]==a[2]&&a[1]==a[3]&&a[2]==a[3]){
			return true;
		}
		else{
			return false;
		}
	}
	
	function loadImage(srcList,callback){
		var imgs={};
		Game.dataSource.countLoad.totalImage=srcList.length;
		var totalCount=Game.dataSource.countLoad.totalImage;
		var loadedCount=Game.dataSource.countLoad.loadedImage;
		for (var i=0;i<totalCount;i++){
			var img=srcList[i];
			var image=imgs[img.id]=new Image();
			image.src=img.src||img.url;
			image.onload=function(event){
				loadedCount++;
				Game.dataSource.countLoad.loadedImage=loadedCount;
			}		
		}
		if (typeof callback=="function"){
			var Me=this;
			function check(){
				if (loadedCount>=totalCount){
					callback.apply(Me,arguments);
				}else{		
					setTimeout(check,100);
				}	
			}
			check();
		}
		return imgs;
	}
	//需要加载的资源
	function initSource(){
		Game.dataSource.imgCache=loadImage([{id:"icon",src:"./img/icon.png"},{id:"no-use",src:"./img/glyphicons-halflings.png"}]);
	}
	/*************/
	
	/******  Word类   *******/
	function Word(name,idiomId,x,y){
		this.name=name||"";         //成语中的字
		this.idiomId=idiomId||0;    //字所属的成语的ID
		this.x=x||0;                //字方块在canvas的x坐标
		this.y=y||0;                //字方块在canvas的y坐标
		this.isClick=false;         //字是否在被选中状态
	}
	Word.prototype.width=Game.wordRectWidth;   //方块的宽度
	Word.prototype.height=Game.wordRectHeight; //方块的高度
	Word.prototype.color="rgb(234,138,28)";      //方块中字颜色
	Word.prototype.bg="rgb(255,251,177)";        //方块的背景颜色
	Word.prototype.setClick=function(bool){        //设置方块被选中
		this.isClick=bool;
		return this;
	}
	Word.prototype.draw=function(){       //绘制
		var ctx=Game.ctx;
		if(!this.isClick){               //没有选中
			ctx.clearRect(this.x-5,this.y-5,this.width+10,this.height+10);
			//ctx.shadowOffsetX=0;
			//ctx.shadowOffsetY=0;
			//ctx.shadowBlur=0;
			ctx.fillStyle=this.bg;
			ctx.fillRect(this.x,this.y,this.width,this.height);
			ctx.fillStyle=this.color;
			ctx.font='bold 18px 微软雅黑';
			ctx.fillText(this.name,this.x+20,this.y+40);
		}
		else{                              //有选中
			ctx.clearRect(this.x,this.y,this.width,this.height);
			//ctx.shadowOffsetX=2;
			//ctx.shadowOffsetY=2;
			//ctx.shadowColor='rgba(205,201,107,.7)';
			//ctx.shadowBlur=3;
			ctx.fillStyle=this.bg;
			ctx.strokeStyle="blue";
			ctx.fillRect(this.x,this.y,this.width,this.height);	
			ctx.strokeRect(this.x,this.y,this.width,this.height);
			ctx.fillStyle=this.color;
			ctx.font='bold 18px 微软雅黑';
			ctx.fillText(this.name,this.x+20,this.y+40);
		}
	}
	Word.prototype.clear=function(){      //擦掉
		var ctx=Game.ctx;
		ctx.clearRect(this.x-5,this.y-5,this.width+10,this.height+10);
	}
	Word.prototype.setX=function(x){      //设置X轴位置
		this.x=x;
		return this;
	}
	Word.prototype.setY=function(y){      //设置y轴位置
		this.y=y;
		return this;
	}
	Word.prototype.sayId=function(y){      //返回该字所在成语的Id号
		return this.idiomId;
	}
	/*************/
	
	/******  Player类   *******/
	function Player(){
		this.score=5;           //玩家的生命值 5颗心
		this.winLevels=[];      //玩家已经通过的关卡
	}
	Player.prototype.setWinLevel=function(level){
		this.winLevels[level]=true;
	}
	/*************/
	
	/*****  Score类  ********/
	function Score(totalTime){
		this.totalTime=totalTime;
	}
	Score.prototype.updateTime=30;
	Score.prototype.sWidth=Game.cWidth;
	Score.prototype.sHeight=50;
	Score.prototype.smallWidth=Game.cWidth;
	Score.prototype.n=0;
	Score.prototype.drawScore=function(){
		var subtraction=this.sWidth*30/this.totalTime,
			ctx=Game.ctx;
		//ctx.shadowOffsetX=0;
		//ctx.shadowOffsetY=0;
		//ctx.shadowBlur=0;
		if(this.smallWidth>this.sWidth/2){
			ctx.clearRect(0,0,this.sWidth,this.sHeight);
			ctx.fillStyle="rgb(255,255,255)";
			ctx.fillRect(0,0,this.sWidth,this.sHeight);
			ctx.fillStyle="rgb(76,176,52)";
			ctx.fillRect(0,0,this.smallWidth,this.sHeight);
		}
		else if(this.smallWidth>this.sWidth/4){
			ctx.clearRect(0,0,this.sWidth,this.sHeight);
			ctx.fillStyle="rgb(255,255,255)";
			ctx.fillRect(0,0,this.sWidth,this.sHeight);
			ctx.fillStyle="rgb(234,138,28)";
			ctx.fillRect(0,0,this.smallWidth,this.sHeight);
		}
		else{
			this.n++;
			if(this.n>40){
				ctx.clearRect(0,0,this.sWidth,this.sHeight);
				
				ctx.fillStyle="rgb(255,0,0)";
				ctx.fillRect(0,0,this.sWidth,this.sHeight);
				ctx.fillStyle="rgb(255,255,255)";
				ctx.fillRect(0,0,this.smallWidth,this.sHeight);
				if(this.n==80){
					this.n=0;
				}
			}
			else{
				ctx.clearRect(0,0,this.sWidth,this.sHeight);
				ctx.fillStyle="rgb(255,255,255)";
				ctx.fillRect(0,0,this.sWidth,this.sHeight);
				ctx.fillStyle="rgb(255,0,0)";
				ctx.fillRect(0,0,this.smallWidth,this.sHeight);
			}
		}
		this.smallWidth=this.smallWidth-subtraction;
	}
	/*************/
	
	/******   Heart类  ********/
	function Heart(x,y){
		this.x=x;
		this.y=y;
		this.isBroken=false;
	}
	Heart.prototype.img=Game.dataSource.imgCache["icon"];
	Heart.prototype.heartSite=[0,0,21,27];
	Heart.prototype.heartBrokenSite=[21,0,21,27];
	Heart.prototype.initDrawHreat=function(){
		this.img=Game.dataSource.imgCache["icon"];
		var ctx=Game.ctx,site=this.heartSite;
		ctx.drawImage(this.img,site[0],site[1],site[2],site[3],this.x,this.y,site[2],site[3]);
	}
	Heart.prototype.brokenDraw=function(){
		var ctx=Game.ctx,
			site=this.heartBrokenSite;
		this.img=Game.dataSource.imgCache["icon"];
		ctx.clearRect(this.x,this.y,site[2],site[3]);
		ctx.drawImage(this.img,site[0],site[1],site[2],site[3],this.x,this.y,site[2],site[3]);
	}
	/**************************/
	
	/*******  Game续  ***********/
	Game.beginPart=function(){          //从主页进入关卡，读取idiom的json存储文件
		var btuSingle=$(".btu-single"),
			btuBack=$(".btu-back"),
			mainPage=$("#mainPage"),
			singleLevels=$("#single-levels");
		btuSingle.click(function(){
			mainPage.css("left","-100%");
			singleLevels.css("left","0");
			$.ajax({url:Game.url}).done(function(data){
				Game.idiomData=data;
			});
			Game.single=new Player();
		});
		btuBack.click(function(){
			mainPage.css("left","0%");
			singleLevels.css("left","100%");
		});
	}
	Game.beginPart();
	Game.getIdioms=function(num){        //根据所在关卡获得相应的数量的成语，并把它们拆分成Word类
		var length,data=Game.idiomData,	
			str="",
			theIdiom={};
		data.sort(shuffle);	
		for(var i=0;i<num/4;i++)
		{	
				var ran=parseInt(length*Math.random());
				Game.idiomsList.push(data.splice(ran,1));
		}
		length=Game.idiomsList.length;
		for(var j=0;j<length;j++){
			for(var z=0;z<4;z++){		
				theIdiom=Game.idiomsList[j];
				str=theIdiom[0].idiom.slice(z,z+1);
				var wordNew=new Word(str,theIdiom[0].idiomId,0,0);
				Game.wordsList.push(wordNew);
				Game.wordsList.sort(shuffle);
			}
		}
		console.log(Game.idiomData);
		//console.log(Game.wordsList);
		return Game.wordsList;
	}
	Game.timeCount=function(){	
		Game.scoreCount.drawScore();
		if(Game.scoreCount.smallWidth<=0){
			//失败弹窗 停止计时
			//clearInterval(Game.timeCount);
			$("#fail").show();
		}
		else{
			Game.timeOutFun=setTimeout(Game.timeCount,30);
		}
	}
	Game.showCanvas=function(){
		var levelsList=$(".levels-list"),
			mainGame=Game.canvas,
			levels=Game.levels,
			wordArray=[],
			wWidth=Game.wordRectWidth,
			wHeight=Game.wordRectHeight;
		levelsList.click(function(event){
			var target=event.target,len;
			for(var level in levels){
				var le=levels[level];
					levelDiv=le.reactDiv[0],
					sureLevel=le.level,
					row=le.row,
					col=le.col;
				if(target==levelDiv){
					Game.currentLevel=sureLevel;
					Game.currentIdiomsCount=row;
					if(le.isOpen){
						wordArray=Game.getIdioms(row*col);
					}
				}
			}
			initSource();
			//这里加载资源
			$("#load").show();
			
			$("#load").bind("loadDone",function(){
				$("#pause").show();   //暂停按钮也出来
				len=wordArray.length;
				Game.clearP();
				for(var i=0;i<len;i++)
				{
					var x=(wWidth+12)*(i%4)+12,
						y=(wHeight+12)*Math.floor(i/4)+100;
					wordArray[i].setX(x).setY(y).draw();
				}
				if(Game.levels[Game.currentLevel-1].isOpen){
					mainGame.show();
					//开始计时
					Game.scoreCount=new Score(Game.levels[Game.currentLevel-1].time);
					Game.timeOutFun=setTimeout(Game.timeCount,30);
					for(var j=0;j<Game.single.score;j++){
						var heart=new Heart(21*j,60);  //21是图片心的宽度
						heart.initDrawHreat();
						Game.heartsList.push(heart);
					}
				}
			}
			);
			setTimeout(function(){
				if(Game.dataSource.countLoad.loadedImage<Game.dataSource.countLoad.totalImage){
					setTimeout(arguments.callee,50);
				}
				else{
					$("#load").hide();
					$("#load").trigger("loadDone");
				}
			},50);
			
			event.preventDefault();
		});
	}
	Game.showCanvas();
	Game.clickEvent=function(){
		var canvas=Game.canvas,clickWords=[],wordsList=Game.wordsList;
		//console.log(Game.wordsList);
		canvas.click(function(event){
			var i,word,totScore;
			i=inWhichRect(event.pageX,event.pageY,wordsList);
			word=wordsList[i]||0;
			//console.log(word);
			if(word){
				if(word.isClick){
					word.setClick(false).draw();
					clickWords=removeWord(clickWords,word);
				}
				else{
					word.setClick(true).draw();
					clickWords.push(word);
				}
			}
			if(clickWords.length==4){
				setTimeout(function(){
					if(isAnIdiom(clickWords)){
					for(var i=0;i<4;i++){
						clickWords[i].clear();
					}
					Game.currentIdiomsCount--;
					if(Game.currentIdiomsCount==0){
						//弹窗，选择下一关还是返回，思考清楚哪些数据
						clearTimeout(Game.timeOutFun);
						$("#success").show();
					}				
				}
				else{
					for(var i=0;i<4;i++){
						clickWords[i].setClick(false).draw();
					}
					//减一颗心  判断是否已经没有剩余的心
					Game.single.score--;
					totScore=Game.single.score;
					if(totScore==0){
						//fail
						$("#fail").show();
						clearTimeout(Game.timeOutFun);
						Game.single.score=5;
						for(var j=0;j<Game.single.score;j++){
							var heart=new Heart(21*j,60);  //21是图片心的宽度
							heart.initDrawHreat();
							Game.heartsList.push(heart);
						}
					}
					else{
						Game.heartsList.pop().brokenDraw();
					}
					
				}
				clickWords=[];
				},500);
				
			}
			event.preventDefault();
		});
	}
	Game.clickEvent();
	Game.showNext=function(){
		var row,col,le=Game.levels[Game.currentLevel-1],
			wordArray=[],len,wWidth=Game.wordRectWidth,
			wHeight=Game.wordRectHeight;
		row=le.row;
		col=le.col;
		if(le.isOpen){
			
			
			wordArray=Game.getIdioms(row*col);
			Game.currentIdiomsCount=row;
			//加载其他例如音频等不用图片了
			//console.log(le.isOpen);
			//console.log(wordArray);
			len=wordArray.length;
			
			for(var i=0;i<len;i++)
			{
				var x=(wWidth+12)*(i%4)+12,
					y=(wHeight+12)*Math.floor(i/4)+100;
				//console.log(x+" "+y);
				wordArray[i].setX(x).setY(y).draw();
			}
			
			//开始计时
			Game.scoreCount=new Score(Game.levels[Game.currentLevel-1].time);
			Game.timeOutFun=setTimeout(Game.timeCount,30);
			for(var j=0;j<Game.single.score;j++){
				var heart=new Heart(21*j,60);  //21是图片心的宽度
				heart.initDrawHreat();
				Game.heartsList.push(heart);
			}
		}
		else{
			console.log(le);
			var levelsList=$(".levels-list");
			levelsList.unbind('click');
			Game.canvas.hide();
			Game.currentLevel=0;
			Game.showCanvas();
		}
	}
	Game.clearP=function(){
		var ctx=Game.ctx;
		ctx.clearRect(0,100,Game.cWidth,Game.cHeight-100);
	}
	Game.backToLevel=function(){
		$(".to-back").each(function(){
			var that=$(this),levelsList=$(".levels-list");
			
			$(this).click(function(){
				$("#pause").hide();  //暂停按钮消失
				var atlast=Game.wordsList;
				that.parent().hide();
				Game.canvas.hide();
				Game.currentLevel=0;
				Game.idiomsList=[];
				Game.wordsList=[];
				Game.currentIdiomsCount=0;
				Game.heartsList=[];			
				levelsList.unbind('click');
				
				Game.showCanvas();
				Game.canvas.unbind('click');
				Game.clickEvent();
			});
		});
		$(".nextLevel").click(function(){
			$(this).parent().hide();
			
			Game.currentLevel=Game.currentLevel+1;
			Game.idiomsList=[];
			Game.wordsList=[];
			Game.currentIdiomsCount=0;
			Game.heartsList=[];
			//levelsList.unbind('click');
			Game.ctx.clearRect(0,0,Game.cWidth,Game.cHeight);
			Game.showNext();
			Game.canvas.unbind('click');
			Game.clickEvent();
		});
		$(".again").click(function(){
			$(this).parent().hide();		
			Game.currentLevel=Game.currentLevel;
			Game.idiomsList=[];
			Game.wordsList=[];
			Game.currentIdiomsCount=0;
			Game.heartsList=[];
			//levelsList.unbind('click');
			Game.ctx.clearRect(0,0,Game.cWidth,Game.cHeight);
			Game.showNext();
			Game.canvas.unbind('click');
			Game.clickEvent();
		});
	}
	Game.backToLevel();
	Game.pause=function(){
		$("#pause").click(function(){
			$("#pauseUse").show();
			clearTimeout(Game.timeOutFun);
		});
		$("#pauseUse").click(function(){
			Game.timeOutFun=setTimeout(Game.timeCount,30);
			$(this).hide();
		});
	}
	Game.pause();
	/****************/
});