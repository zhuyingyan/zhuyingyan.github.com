
Array.prototype.del = function(o) 
{ 
	var index=this.indexOf(o);
	if (index<0) return false; 
	this.splice(index, 1);
} 

/* 加载图片 */
function loadImage(imgList,callback){
	var imgs={};
	var totalCount=imgList.length;
	Game.Data.CountLoad.loadedImage=0;
	Game.Data.CountLoad.totalImage=imgList.length;
	var loadedCount=0;
	for (var i=0;i<totalCount;i++){
		var img=imgList[i];
		var image=imgs[img.id]=new Image();
		image.src=img.src||img.url;
		image.onload=function(event){
			loadedCount++;	
			Game.Data.CountLoad.loadedImage=loadedCount;		
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

/* 加载音乐 */
function loadMusic(musicList,callback)
{
	var musics={};
	var musicsCount=musicList.length;
	Game.Data.CountLoad.loadedMusic=musicList.length;;
	var loadedCount=0;
	for (var i=0;i<musicsCount;i++){
		var mus=musicList[i];
		var audio=musics[mus.id]=new Audio();
		audio.src=mus.src||mus.url;
		audio.addEventListener("canplaythrough",audioLoaded,false);
	}
	function audioLoaded()
	{
		loadedCount++;		
		Game.Data.CountLoad.totalMusic=loadedCount;
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

function checkPointInObj(obj,e){
	/* 地图坐标转换 */
	var zleft=Game.Container.zoffsetLeft;
	var ztop=Game.Container.zoffsetTop;
	var x = e.clientX - (obj.x+zleft);
	var y = e.clientY - (obj.y+ztop);
	if(x*x+y*y < obj.r*obj.r)
		return true;
	else return false;
}

function checkHit(r,w){
	var x=r.x - w.x;
	var y=r.y - w.y;
	var R=(r.r + w.r)/2.0;
	if(R*R > x*x + y*y)
		return true;
	else
		return false;
}

function getVelocityX (x1,y1,x2,y2,g,vy){
	var absX = Math.abs(x1-x2);
	var absY = y2-y1;
	var a = absY;
	var b = vy*absX;
	var c = -g/2.0*absX*absX;
	var t = Math.sqrt(b*b - 4*a*c );
	var vx = (-b - t)/(2*a);
	return vx;
}

function drawLine(x,y,vx,vy,g){	
	var s=x,t=0;
	var canvas=document.getElementById("canvas-over");
	var cxt=canvas.getContext("2d");
	cxt.clearRect(0, 0, Game.Container.width, Game.Container.height);
	if(vx == 0) return;
	while(true){
		t=vy*(s - x)/vx + g/2.0*((s - x)/vx)*((s - x)/vx);
		
		if(t >= Game.Container.height) break;			
			cxt.fillStyle="rgba(255,255,255,0.5)";
			cxt.beginPath();
			cxt.arc(s,t+y,3,0,Math.PI*2,true);
			cxt.closePath();
			cxt.fill();
			s+=20;
	}
}

function clearLine(){
	var canvas=document.getElementById("canvas-over");
	var cxt=canvas.getContext("2d");
	cxt.clearRect(0, 0, Game.Container.width, Game.Container.height);
}

function toSecond(id){
	var oneChangeTwo=document.getElementById(id);
	oneChangeTwo.className="show";
	var div=oneChangeTwo.getElementsByTagName("div")[0];	
	setTimeout(function(){
		oneChangeTwo.className="show show2";
	},500);
	setTimeout(function(){
		div.className="addClass";
	},1000);
	setTimeout(function(){
		Game.Continue();
		oneChangeTwo.className="show";
	},4000);
	setTimeout(function(){
		
		oneChangeTwo.className="";
	},4500);
}
function toOne(id){
	var oneChangeTwo=document.getElementById(id);
	oneChangeTwo.className="show show2";
	var div=oneChangeTwo.getElementsByTagName("div")[0];	
	setTimeout(function(){
		div.className="addClass";
	},1000);
	setTimeout(function(){
		
		oneChangeTwo.className="show";
	},4000);
	setTimeout(function(){
		
		oneChangeTwo.className="";
		Game.Continue();
	},4500);
}

