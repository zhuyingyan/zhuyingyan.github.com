/**
 * 房间基本对象
 */
function Room() {
	this.bg={img:0,x:0,y:0};
	this.objects=[]; 
	this.enemys=[];
	this.armys=[];
	this.weapons=[];
	this.scores=null;
	this.role=null;
	this.x=0;
	this.y=0;
	this.w=0;
	this.h=0;
	this.marginal=350;
	this.range=200;
}

/* 初始化 */
Room.prototype.init=function(){
	this.bg.img=window.Game.Data.ImgCache[this.bg.img];
}

/* 房间刷新 */
Room.prototype.refresh=function(){
	this.update();
	this.play();
}

/* 房间数据更新 */
Room.prototype.update=function(){

}

/* 绘画，播放 */
Room.prototype.play=function(){
	var ctx=Game.Container.context;	
	ctx.drawImage(this.bg.img,this.bg.x,this.bg.y);	
	for(var i=0;i<this.objects.length;i++){
		 this.objects[i].play(ctx,Game.Fps);
	}
}

/* 添加房间对象 */
Room.prototype.addObj=function(obj){
	this.objects.push(obj);
}

Room.prototype.delObj=function(obj){
 	this.objects.del(obj);
}

Room.prototype.addEnemy=function(obj){
	this.enemys.push(obj);
	this.addObj(obj);
}

Room.prototype.delEnemy=function(obj){
	this.enemys.del(obj);
	this.delObj(obj);
}

Room.prototype.addWeapon=function(obj){
	this.weapons.push(obj);
	this.addObj(obj);
}

Room.prototype.delWeapon=function(obj){
	this.weapons.del(obj);
	this.delObj(obj);
}

Room.prototype.addArmy=function(obj){
	this.armys.push(obj);
	this.addObj(obj);
}

Room.prototype.delArmy=function(obj){
	this.armys.del(obj);
	this.delObj(obj);
}

Room.prototype.clear=function(){
	this.objects=[]; 
	this.enemys=[];
	this.armys=[];
	this.weapons=[];
}

/**
 * 房间 1
 */
 function RoomFirst(cfg){
	this.marginal=600;
	this.range=200;
	for (var attr in cfg ){
		this[attr]=cfg[attr];
	}
 }
 RoomFirst.prototype=new Room();

 /* 房间数据更新 实现自己的逻辑 */
RoomFirst.prototype.update=function(){
	Game.EventManager.triggerMyEvent(this,"update");
}

/* 获得父类同名方法 设置一个属性指向父类*/
RoomFirst.prototype.superClass=Room.prototype;

RoomFirst.prototype.init=function(){
	this.superClass.init.call(this,null);	
	
	Game.EventManager.registerMyEvent(this,["update"],Control.firstRoomUpdate);
	
}



/**
 * 房间 2
 */
 function RoomSecond(cfg){
	this.marginal=600;
	for (var attr in cfg ){
		this[attr]=cfg[attr];
	}
 }
RoomSecond.prototype=new Room();

 /* 房间数据更新 实现自己的逻辑 */
RoomSecond.prototype.update=function(){
	Game.EventManager.triggerMyEvent(this,"update");
}

/* 获得父类同名方法 设置一个属性指向父类*/
RoomSecond.prototype.superClass=Room.prototype;

RoomSecond.prototype.init=function(){
	this.superClass.init.call(this,null);	
	Game.EventManager.registerMyEvent(this,["update"],Control.secondRoomUpdate);
}
