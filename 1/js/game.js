var Game={ 														
	/*游戏容器，canvas区域，canvas信息*/
	Container:{
			canvas:0,
			overCanvas:0,
			context:0,
			width:1024,
			height:690,
			zoffsetLeft:0,
			zoffsetTop:0
	 },
	/*舞台的移动相当于改变精灵的位置,游戏舞台，包括游戏背景，游戏精灵的所有信息*/
	Map:{},        	
	/*游戏帧频*/						
	Fps:30,	
	Data:{			
		/*游戏图片*/										
	        ImgCache:[],
		/*游戏音频*/
		AudioCache:[],
		/*游戏用户数据，得分多少*/									
		Scores:0,										
		beginTime:0,
		Mouse:{
			state:false,
			data:[]	
		},
		CountLoad:{
			totalImage:0,
			loadedImage:0,
			totalMusic:0,
			loadedMusic:0
		}
		
	},
	Start:0,
	Render:0,
	ini:0,
	BeginTime:0,
	Dancer:0,
	Role:null,
	isMusicOn:1,
	t:null,
	Enemy:[
		{
			A:2,
			B:2,
			C:0
		},
		{
			A:2,
			B:4,
			C:0
		},
		{
			A:2,
			B:2,
			C:1
		}
	]
}

Game.init=function(){

	
	
	Game.Data.ImgCache=loadImage([
			{ id : "boss" , src : "./img/boss.png" },
			{ id : "room1-bg" , src : "./img/bgme.jpg" } ,
			{ id : "newPic"  , src : "./img/newPic.png" } ,
			{ id : "new1"  , src : "./img/new1.png" },
			{ id : "enemy" , src : "./img/enemy.png" },
			{ id : "r2" , src : "./img/bg-3.jpg" } ,
			{ id : "newAx" , src : "./img/newAx.png" },
			{ id : "tool" , src : "./img/wuqi_3.png" },
			{ id : "music" , src : "./img/music.png"},
			{ id : "pause" , src : "./img/pause.png"},
			{ id : "archer" , src : "./img/archer.png"},
			{ id : "super" , src : "./img/super.png"} 			
		],
	 function(){
		console.log("picture Ok!");
		//Game.Start();	
	 });
Game.Data.AudioCache=loadMusic([
			
	],function(){
		var audio=Game.Data.AudioCache["bgMusic"];
		audio.play();
		audio.loop="loop";
	});	

	

}

Game.Start=function(){
	
	/*初始化canvas*/
	var container=document.getElementById("container");
	Game.Container.canvas=document.getElementById("canvas");
	Game.Container.canvas.height=Game.Container.height;
	Game.Container.canvas.width=Game.Container.width;
	Game.Container.zoffsetLeft=container.offsetLeft;
	Game.Container.zoffsetTop=container.offsetTop;
	Game.Container.context=Game.Container.canvas.getContext("2d");
	Game.Container.overCanvas=document.getElementById("canvas-over");
	Game.Container.overCanvas.height=Game.Container.height;
	Game.Container.overCanvas.width=Game.Container.width;
	Game.EventManager.target=Game.Container.overCanvas;
	
	Game.Data.beginTime=(new Date).getTime();
	
	Game.Map=new Map();
	Game.Map.init();
	Game.Role=Game.Map.role;

	Game.t=setInterval(function(){		
		window.Game.Map.refresh();	
	},1000/this.Fps);

	
}

Game.Pause=function(){	
	if(Game.t==null) return;
	clearInterval(Game.t);
	Game.t=null;
	/* do sth */
}

Game.Continue=function(){
	if(Game.t == null){
		clearInterval(Game.t);
	}
	Game.t=setInterval(function(){		
		window.Game.Map.refresh();	
	},1000/this.Fps);
}

Game.Replay=function(){
	Game.Pause();
	Game.Enemy=[
		{
			A:2,
			B:2,
			C:0
		},
		{
			A:2,
			B:4,
			C:0
		},
		{
			A:2,
			B:2,
			C:1
		}
	];
	Game.EventManager.triggerMyEvent(Game.Map,"clear");	
	Game.EventManager.triggerMyEvent(Game.Map,"began");	
	Game.Continue();
}

Game.gameOver=function(){

};
Game.gameWin=function(){
	
};
