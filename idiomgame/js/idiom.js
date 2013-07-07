$(function(){
	/******  Game   *******/
	var Game={
		levels:[
		{
			"level":1,
			"isOpen":true,
			"col":4,      /*列的个数*/
			"row":4 ,      /*行的个数*/
			"reactDiv":$(".btu-level1"),
			"time":300000      //完成时间  ms为单位
		},{
			"level":2,
			"isOpen":true,
			"col":4,      /*列的个数*/
			"row":4,       /*行的个数*/
			"reactDiv":$(".btu-level2"),
			"time":250000
		},{
			"level":3,
			"isOpen":true,
			"col":4,      /*列的个数*/
			"row":4,       /*行的个数*/
			"reactDiv":$(".btu-level3"),
			"time":200000
		}
	],
	canvas:$("#gameCanvas"),    //获取canvas的dom
	cWidth:0,                   //canvas的宽度
	cHeight:0,                  //canvas的高度
	currentLevel:0,             //当前所在关卡
	wordRectWidth:70,           //字块的宽度
	wordRectHeight:70,          //字块的高度
	ctx:null,                   //canvas上下文
	audioData:[],                //json文件的data数据
	url:"idiom/audio.json",     //json文件的url
	audiosList:[],                //当前已经加载完成的音频
	audiosLevelList:[],                //当前关选中的音频
	currentIdiomsCount:0,           //现在关卡的成语个数
	single:null,                    //单人玩家 Play类
	scoreCount:null,                   //计时Score类
	soundsList:[],                     //放sound类
	heartsList:[],                    //放心用的 
	myTime:0,
	timeOut:500,
	dataSource:{
		imgCache:[],        //照片缓存
		musicCache:[],
		countLoad:{
			totalImage:0,
			loadedImage:0,
			totalMusic:0,
			loadedMusic:0
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
	function isSameSound(array,level){           //判断是否是成语
		var a=[],len=array.length;
		switch(level){
			case 3:	
			case 1:
				console.log(array[0].idiomId+" "+array[1].idiomId);
				if(array[0].idiomId==array[1].idiomId){
					return true;
				}
				else{
					return false;
				}
				break;
			
			case 2:
				if(array[0].idiomId==array[1].idiomId&&array[0].name==array[1].name){
					return true;
				}
				else{
					return false;
				}
				break;
			
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
		Game.dataSource.imgCache=loadImage([{id:"icon",src:"./img/icon.png"}]);
		Game.dataSource.musicCache=loadMusic(Game.audioData);
	}
	//加载音频
	function loadMusic(musicList,callback)
	{
		var musics={};
		var musicsCount=musicList.length;
		Game.dataSource.countLoad.totalMusic=musicList.length*2;
		var loadedCount=Game.dataSource.countLoad.loadedMusic;
		for (var i=0;i<musicsCount;i++){
			var mus=musicList[i],sex=["M","F"];
			for(var j=0;j<2;j++){
				var audio,str=mus.cardId;//new Audio(); 
				if(j==0){
					audio=musics[str+"M"]=new Audio();
					audio.src=mus.cardM;
				}
				else{
					audio=musics[str+"F"]=new Audio();
					audio.src=mus.cardF;
				}
				audio.addEventListener("canplaythrough",audioLoaded,false);
			}
			
		}
		function audioLoaded()
		{
			loadedCount++;
			Game.dataSource.countLoad.loadedMusic=loadedCount;
		}
		if (typeof callback=="function"){
			var Me=this;
			function check(){
				if (loadedCount>=musicsCount){
					callback.apply(Me,arguments);
				}else{		
					setTimeout(check,100);
				}	
			}
			check();
		}
		return musics;
	}
	function cloneList(a,b){   //数组a的内容克隆到数组b
		var n=0;
		for(var i in a){
			b[i]=a[i];
			//n++;
		}
	}
	function countObj(obj)  //计算object数目
	{
		var n=0;
		for(var i in obj){
			n++;
		}
		return n;
	}
	/*************/
	
	/******  Word类   *******/
	function Sound(name,idiomId,audioObj,x,y){
		this.name=name||"";         //成语中的字
		this.idiomId=idiomId||0;    //字所属的成语的ID
		this.x=x||0;                //字方块在canvas的x坐标
		this.y=y||0;                //字方块在canvas的y坐标
		this.isClick=false;         //字是否在被选中状态
		this.audioObj=audioObj||null;         //用来放Audio类
	}
	Sound.prototype.width=Game.wordRectWidth;   //方块的宽度
	Sound.prototype.height=Game.wordRectHeight; //方块的高度
	Sound.prototype.color="rgb(234,138,28)";      //方块中字颜色
	Sound.prototype.bg="rgb(255,251,177)";        //方块的背景颜色
	Sound.prototype.setClick=function(bool){        //设置方块被选中
		this.isClick=bool;
		return this;
	}
	Sound.prototype.draw=function(){       //绘制
		var ctx=Game.ctx;
		if(!this.isClick){               //没有选中
			ctx.clearRect(this.x-5,this.y-5,this.width+10,this.height+10);
			ctx.fillStyle=this.bg;
			ctx.fillRect(this.x,this.y,this.width,this.height);
			ctx.fillStyle=this.color;
			ctx.font='bold 18px 微软雅黑';
			ctx.fillText(this.name,this.x+20,this.y+40);
		}
		else{                              //有选中
			ctx.clearRect(this.x,this.y,this.width,this.height);
			ctx.fillStyle=this.bg;
			ctx.strokeStyle="blue";
			ctx.fillRect(this.x,this.y,this.width,this.height);	
			ctx.strokeRect(this.x,this.y,this.width,this.height);
			ctx.fillStyle=this.color;
			ctx.font='bold 18px 微软雅黑';
			ctx.fillText(this.name,this.x+20,this.y+40);
		}
	}
	Sound.prototype.clear=function(){      //擦掉
		var ctx=Game.ctx;
		ctx.clearRect(this.x-5,this.y-5,this.width+10,this.height+10);
	}
	Sound.prototype.setX=function(x){      //设置X轴位置
		this.x=x;
		return this;
	}
	Sound.prototype.setY=function(y){      //设置y轴位置
		this.y=y;
		return this;
	}
	Sound.prototype.sayId=function(y){      //返回该字所在成语的Id号
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
			singleLevels=$("#single-levels"),
			btuMultiple=$(".btu-multiple");
		btuSingle.click(function(){
			mainPage.css("left","-100%");
			singleLevels.css("left","0");
			if(Game.audioData.length==0){
				$.ajax({url:Game.url}).done(function(data){
					Game.audioData=data;
					console.log(data.length);
				});
			}
			Game.single=new Player();
		});
		btuMultiple.click(function(){
			//mainPage.css("left","-100%");
			//singleLevels.css("left","0");
			if(Game.audioData.length==0){
				$.ajax({url:Game.url}).done(function(data){
					Game.audioData=data;
					console.log(data.length);
				});
			}
			$("#login").show();
			Game.multiple();
			Game.single=new Player();
		});
		btuBack.click(function(){
			mainPage.css("left","0%");
			singleLevels.css("left","100%");
		});
	}
	Game.beginPart();
	Game.getIdioms=function(lev){        //根据所在关卡获得相关的8个音频数据
		cloneList(Game.dataSource.musicCache,Game.audiosList);
		var length,data=Game.audiosList, 	
			str="",
			theIdiom={},ran,ran2,sex=["M","F"],choose;
		console.log(Game.audiosList);
		
		length=countObj(data);
		console.log(lev);
		switch(lev){
			case 1:
				ran=parseInt(Math.random()*2);
				for(var i=0;i<8;i++){
					ran2=parseInt(length*Math.random()/2)+1;
					choose=data[ran2+sex[ran]];
					if(choose){
						theIdiom[ran2+sex[ran]]=data[ran2+sex[ran]];
						delete data[ran2+sex[ran]];
						
					}
					else{
						i--;
						continue;
					}
				}
				break;
			case 2:
				for(var i=0;i<8;i++){
					ran=parseInt(Math.random()*2);
					ran2=parseInt(length*Math.random()/2)+1;
					choose=data[ran2+sex[ran]];
					if(choose){
						theIdiom[ran2+sex[ran]]=data[ran2+sex[ran]];
						delete data[ran2+sex[ran]];			
					}
					else{
						i--;
						continue;
					}
				}
				break;
			case 3:
				for(var i=0;i<8;i++){
					ran=parseInt(length*Math.random()/2)+1;
					choose=data[ran+sex[0]];
					if(choose){
						theIdiom[ran+sex[0]]=data[ran+sex[0]];
						delete data[ran+sex[0]];
						theIdiom[ran+sex[1]]=data[ran+sex[1]];
						delete data[ran+sex[1]];
					}
					else{
						i--;
						continue;
					}
				}
				break;
		}
		Game.audiosLevelList=theIdiom;
		console.log(Game.audiosLevelList);
		
		var soundsList=[];
		switch(lev){
			case 1:
			case 2:
				for(var j=0 in theIdiom){
					var sound,name,id,tansound;
					name=j.slice(j.length-1);
					id=parseInt(j);
					sound=new Sound(name,id,theIdiom[j]);
					soundsList.push(sound);
					tansound=new Audio();
					tansound.src=theIdiom[j].src;
					console.log(theIdiom[j].src);
					sound=new Sound(name,id,tansound);
					soundsList.push(sound);
				}
				break;
			case 3:
				for(var j=0 in theIdiom){
					var sound,name,id;
					name=j.slice(j.length-1);
					id=parseInt(j);
					sound=new Sound(name,id,theIdiom[j]);
					soundsList.push(sound);
				}
				break;
		}
		
		
		console.log(soundsList);
		cloneList(Game.dataSource.musicCache,Game.audiosList);
		console.log(Game.audiosList);
		return soundsList;
	}
	Game.timeCount=function(){	
		Game.scoreCount.drawScore();
		if(Game.scoreCount.smallWidth<=0){
			//失败弹窗 停止计时
			//clearInterval(Game.timeCount);
			$("#fail .time").html(Game.myTime/1000);
			$("#fail").show();
		}
		else{
			Game.timeOutFun=setTimeout(Game.timeCount,30);
			Game.myTime=Game.myTime+30;
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
					Game.currentIdiomsCount=8;
					
				}
			}
			initSource();
			//这里加载图片资源资源
			
			
			//根据所在关卡加载音频资源
			
			
			$("#load").show();
			$("#load").bind("loadDone",function(){
				$("#pause").show();   //暂停按钮也出来
				Game.clearP();		
				console.log(Game.currentLevel);
				wordArray=Game.getIdioms(Game.currentLevel);
				wordArray.sort(shuffle);
				Game.soundsList=wordArray;
				len=wordArray.length;
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
				//判断资源是否全部已经获取
				console.log(Game.dataSource.countLoad.loadedImage+" "+Game.dataSource.countLoad.loadedMusic+" "+Game.dataSource.countLoad.totalImage+" "+Game.dataSource.countLoad.totalMusic);
				Game.timeOut=Game.timeOut-50;
				console.log(Game.timeOut);
				if(Game.dataSource.countLoad.loadedImage+Game.dataSource.countLoad.loadedMusic<Game.dataSource.countLoad.totalImage+Game.dataSource.countLoad.totalMusic&&Game.timeOut>0){
						setTimeout(arguments.callee,50);
						
				}
				else{
					console.log("worng");
					//cloneList(Game.dataSource.musicCache,Game.audiosList);
					$("#load").hide();
					$("#load").trigger("loadDone");
					
					
					
				}
				
			},50);
			
			
		});
	}
	Game.showCanvas();
	Game.clickEvent=function(){
		var canvas=Game.canvas,clickWords=[];
		
		canvas.click(function(event){
			var i,word,totScore;
			var soundsList=Game.soundsList;
			console.log(Game.soundsList);
			i=inWhichRect(event.pageX,event.pageY,soundsList);
			
			word=soundsList[i]||0;
			//word.audioObj.play();
			
			if(word){
				if(word.isClick){
					console.log(word);
					word.setClick(false).draw();
					clickWords=removeWord(clickWords,word);
				}
				else{
					var oosoud=new Audio();
					oosoud.src=word.audioObj.src;
					oosoud.play();
					word.setClick(true).draw();
					clickWords.push(word);
				}
			}
			//这里下面需要修改  根据所在关卡对于不同判断
			if(clickWords.length==2){
				setTimeout(function(){
						if(isSameSound(clickWords,Game.currentLevel)){
							for(var i=0;i<2;i++){
								clickWords[i].clear();
							}
							Game.currentIdiomsCount--;
							if(Game.currentIdiomsCount==0){
								//弹窗，选择下一关还是返回，思考清楚哪些数据
								clearTimeout(Game.timeOutFun);
								$("#success .time").html(Game.myTime/1000);
								$("#success").show();
							}				
						}
						else{
							for(var i=0;i<2;i++){
								clickWords[i].setClick(false).draw();
							}
							//减一颗心  判断是否已经没有剩余的心
							Game.single.score--;
							totScore=Game.single.score;
							if(totScore==0){
								//fail
								$("#fail .time").html(Game.myTime/1000);
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
		});
	}
	Game.clickEvent();
	Game.showNext=function(){
		var row,col,le=Game.levels[Game.currentLevel-1],
			wordArray=[],len,wWidth=Game.wordRectWidth,
			wHeight=Game.wordRectHeight;
			console.log(Game.audiosList);
		row=le.row;
		col=le.col;
		if(le.isOpen){
			wordArray=Game.getIdioms(le.level);
			Game.soundsList=wordArray.sort(shuffle);
			console.log(wordArray);
			Game.currentIdiomsCount=8;
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
	Game.clearP=function(){         //如果成语还有剩下的擦掉 放于showCanvas()中，showNext()不需要
		var ctx=Game.ctx;
		ctx.clearRect(0,100,Game.cWidth,Game.cHeight-100);
	}
	Game.backToLevel=function(){
		$(".to-back").each(function(){
			var that=$(this),levelsList=$(".levels-list");
			
			$(this).click(function(){
				$("#pause").hide();  //暂停按钮消失
				that.parent().hide();
				Game.canvas.hide();
				Game.currentLevel=0;
				Game.idiomsList=[];
				Game.soundsList=[];
				Game.currentIdiomsCount=0;
				Game.heartsList=[];
				Game.myTime=0;
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
			Game.soundsList=[];
			Game.currentIdiomsCount=0;
			Game.heartsList=[];
			Game.myTime=0;
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
			Game.soundsList=[];
			Game.currentIdiomsCount=0;
			Game.heartsList=[];
			Game.myTime=0;
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
	Game.multiple=function(){    //双人登陆
		//var io = require('socket.io-client');
		var socket = io.connect('http://localhost:8000/');
		var playing = false;
		
		socket.on('connect', function(){
			$("#btu-login").click(function(){
				var usename=$("#usename").val();
				console.log(usename);
				if(usename){
					socket.emit('enter', usename);   //进入用户列表
					
				}
			});
			socket.on('after-enter', function(data){
				if(data == 'success'){
					$("#login").hide();
				};
				socket.emit('start');

			});

			socket.on('start-playing', function(targetname){
				///
				console.log('-----------------')
				if(playing == false){
					playing = true;
					setTimeout(function(){   //模拟的
						if(playing) {
							socket.emit("complete");
							console.log('win');
						}
					}, 5000);
				}
			});

			socket.on('completed', function(){
				///
				playing = false;
				console.log('beaten');
			});

			socket.on('disconnect', function(){});
		});
	}
	/****************/
});