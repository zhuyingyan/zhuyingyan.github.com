(function(){
	var pause=document.getElementById("pause");
	var isPlay=1;
	var isOn=1;
	var myset=1;
	var music=document.getElementById("music");
	var forPause=document.getElementById("forPause");
	var inputs=forPause.getElementsByTagName("input");
	pause.onclick=function(){
		Game.Pause();
		forPause.style.display="block";
		if(isOn&&myset){
			var audio=Game.Data.AudioCache['bgMusic'];
			audio.pause();
		}		
	}
	inputs[0].onclick=function(){
		forPause.style.display="none";
		Game.Continue();
		if(isOn&&myset){
			var audio=Game.Data.AudioCache["bgMusic"];
			audio.play();
		}
	}
	inputs[1].onclick=function(){
		forPause.style.display="none";
		Game.Replay();
		if(isOn&&myset){
			var audio=Game.Data.AudioCache['bgMusic'];
			audio.play();
		}	
	}
	music.onclick=function(){
		if(isOn)
		{
			var audio=Game.Data.AudioCache['bgMusic'];
			audio.pause();
			this.src="img/musicOff.png";
			this.alt="music off";
			Game.isMusicOn=0;
			isOn=0;
		}
		else
		{
			var length=Game.Data.AudioCache.length;
			var audio=Game.Data.AudioCache["bgMusic"];
			audio.play();
			this.src="img/music.png";
			this.alt="music on";
			Game.isMusicOn=1;
			isOn=1;
		}
	}
	function replayFun(id,div)
	{
		id.onclick=function(){
			div.style.display="none";
			Game.Replay();
		}
	}
	var replay=document.getElementById("replaybad");
 	var divbad=document.getElementById("game_badending");
 	replayFun(replay,divbad);
 	var replayhap=document.getElementById("replayhap");
 	var divhap=document.getElementById("game_happyending");
 	replayFun(replayhap,divhap);
 	var music=document.getElementById("music");
 	var again=document.getElementById("again");
 	again.onclick=function(){
 		Game.Replay();
 	};
})();

var score={
	Container:{
		canvas:0,
		context:0,
		width:100,
		height:50
	},
	start:0,
	update:0,
	draw:0
}
score.start=function(){
	score.Container.canvas=document.getElementById("score");
	score.Container.canvas.height=score.Container.height;
	score.Container.canvas.width=score.Container.width;
	score.Container.context=score.Container.canvas.getContext("2d");
	score.draw();
}
score.draw=function(){
	var context=score.Container.context;
	var txt="Score:0";
	context.fillStyle="rgb(255,255,0)";
	context.fillRect(0,0,score.Container.canvas.width,score.Container.canvas.height);
	context.fillStyle="#000";
	context.font='bold 30px sans-serif';
	context.fillText(txt,0,0);
}