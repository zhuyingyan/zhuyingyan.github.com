
/**
 * 游戏基本对象
 */
function Obj(){
	this.x=0;
	this.y=0;
	this.r=this.radius=0;
	this.currentAnim=null;
}
/* 更新对象数据 */
Obj.prototype.update=function(){
	
}
/* 重绘该对象 */
Obj.prototype.play=function(ctx,fps){
	this.update();
	this.currentAnim.play(ctx,this.x,this.y,fps);
}


/**
 * 动画帧
 */
 /* 这种方式的构造方法可以在创建对象时，方便的对属性赋值 */
 function Animation(cfg){
	for (var attr in cfg ){
		this[attr]=cfg[attr];
	}
}

Animation.prototype=function(){
	/* 一组帧 */
	this.frames = null;
	/* 帧数 */
	this.frameCount=0;
	/* 绘制的图片 */
	this.img =null;
	/* 当前播放的帧 */
	this.currentFrame =null ;
	/* 当前播放的帧数 */
	this.currentFrameIndex =-1 ;
	/* 当前帧播放的次数 */
	this.currentFramePlayed =-1;
	/* 当前帧播放的方向 */
	this.inversion=false;
	
	/* 播放音频 */
	this.audio=null;
	/* 音频的播放类型，默认只是开始播放一次 */
	this.audioType="once";
	/* 音频是否已被播放 */
	this.audioIsPlay=false;
	/* 音频播放时间，用于循环播放 */
	this.audioTime=0;
	/* 音频已播放时间，用于循环播放 */
	this.audioPlayTime=0;

}

/*初始化*/
Animation.prototype.init=function(){
	this.img = Game.Data.ImgCache[this.img]||this.img;		
	this.frames=this.frames||[];
	this.frameCount = this.frames.length;
	/* 缺省从第0帧播放*/
	this.setFrame(0);
	this.audio = Game.Data.AudioCache[this.audio]||this.audio;
	this.audioIsPlay=false;
	this.audioTime=0;
	this.audioPlayTime=0;
}

 /* 设置当前帧 */
 Animation.prototype.setFrame=function(index){
	this.currentFrameIndex=index;
	this.currentFrame=this.frames[index];
	this.currentFramePlayed=0;
 }
 /* 更新当前帧数据 */
 Animation.prototype.update=function(fps){
	//判断是否可以播放下一帧,
	var deltaTime=1000/fps; 
	if (this.currentFramePlayed>=this.currentFrame[4] ){
		//播放下一帧
		if (this.currentFrameIndex >= this.frameCount-1){
			this.currentFrameIndex=0;
		}else{
			this.currentFrameIndex++;
		}										 
		this.setFrame(this.currentFrameIndex);		
		}
	else{
		//增加当前帧的已播放时间.
		this.currentFramePlayed += deltaTime;
	}
 }
 /* 重绘出当前帧 */
Animation.prototype.draw=function(ctx,x,y){
	var f=this.currentFrame;
	/* 是否要反转 */
	
	

	if(this.scale){ 
		ctx.drawImage (this.img , f[0] , f[1], f[2], f[3] , x-f[2]/2*this.scale, y-f[3]/2*this.scale, f[2]*this.scale, f[3]*this.scale);}
	else{ 
		ctx.drawImage (this.img , f[0] , f[1], f[2], f[3] , x-f[2]/2, y-f[3]/2, f[2], f[3]);
	}
	
	
	
	
}

/* 播放声音 */
Animation.prototype.playAudio=function(fps){

	if(!this.audio){return;};	
	
	if(this.audioType!="loop"&&this.audioIsPlay){return;};
	
	if(this.audioType!="loop"&&!this.audioIsPlay){
		this.audio.play();
		this.audioIsPlay=true;
		
	}else if(this.audioType=="loop"){
		var deltaTime=1000/fps; 
		if(this.audioPlayTime>this.audioTime){
			this.audio.play();
			this.audioPlayTime=0;
		}else{
			this.audioPlayTime+=deltaTime;
		}
	
	}
	
}

/* 播放动画 */
Animation.prototype.play=function(ctx,x,y,fps){
	this.update(fps);
	this.draw(ctx,x,y);
	this.playAudio(fps);
}


