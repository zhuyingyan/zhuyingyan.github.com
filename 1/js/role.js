
/**
 * 角色基本对象
 */
function Role(){
	this.state=0;
	this.life=0;
	this.blood=0;
	this.bloodL=60;
	this.bloodW=10;
}
Role.prototype=new Obj();
Role.prototype.showBlood=function(ctx){
	if(this.blood == 0) return;
	var width=this.life/this.blood*this.bloodL;
	ctx.fillStyle="black";
	ctx.fillRect(this.x + this.r ,this.y - this.r,this.bloodL,this.bloodW);
	ctx.fillStyle="red";
	ctx.fillRect(this.x + this.r ,this.y - this.r,width,this.bloodW);
}

/**
 * 游戏主角
 */
function Hero(){
	this.state=1;
	this.life=2000;
	this.blood=2000;
	this.scale=0.5;
	this.Throw=0;
	this.quite=0;
	this.hit=0;
	this.currentAnim=0;
	this.r=50;
	this.record=[];
}
Hero.prototype=new Role();

Hero.prototype.init=function(){
	this.Throw=new Animation(
	{
		img:"enemy",
		scale:this.scale,
		frames:[[205,460,200,230,100],[445,460,200,230,100]]	//图片的位置，x,y,长,宽,time
	});
	this.quite=new Animation(
	{
		img:"enemy",
		scale:this.scale,
		frames:[[35,460,180,230,100]]	
	});
	/**
	 * [hit description]boss被砸中的状态
	 * @type {Animation}
	 */
	this.hit=new Animation(
	{
		img:"newPic",
		scale:this.scale,
		frames:[[165,0,100,236,100]]
	});
	
	/**
	 * [hoverHero description]hover的时候变有光
	 * @type {Animation}
	 */
	this.hoverHero=new Animation({
		img:"newPic",
		scale:this.scale,
		frames:[[0,0,110,236,100]]
	});
	this.currentAnim=this.quite;
	this.currentAnim.init();

	Game.EventManager.registerBean(this,["mousedown","touchstart"],Control.heroOn,true);
	Game.EventManager.registerBean(this,["mouseup","touchend"],Control.heroOut,false);
	Game.EventManager.registerBean(this,["mousemove","touchmove"],Control.heroMove,false);
	Game.EventManager.registerBean(this,["mousemove"],Control.heroFocus,false);
	Game.EventManager.registerMyEvent(this,["hit"],Control.heroHit);
	Game.EventManager.registerMyEvent(this,["update"],Control.heroUpdate);
}

Hero.prototype.update=function(){
	Game.EventManager.triggerMyEvent(this,"update");
}

Hero.prototype.updateState=function(state){
	if(this.state == state ) return;
	
	this.state=state;
	switch(this.state){
		case 0:this.currentAnim=this.Throw;break;
		case 1:this.currentAnim=this.quite;break;
		case 2:this.currentAnim=this.hit;break;
		case 3:this.currentAnim=this.hoverHero;break;
		default:this.currentAnim=this.quite;break;
	}
	this.currentAnim.init();
}

/**
 * guard
 */
function Guard(){
	this.type=1;
	this.quite=0;
	this.Throw=0;
	this.currentAnim=0;
	this.scale=0.5;
	this.test=0;  //测试
}
Guard.prototype=new Role();
Guard.prototype.init=function(){
	var fr=[];
	switch (this.type){
		case 1:
		  	fr=[[30,900,220,200,100]];
			break;
		case 2:
			fr=[[30,1090,220,180,100]];
			break;
		case 3:
			fr=[[30,1275,220,155,100]];
			break;
		case 4:
			fr=[[450,1275,100,155,100]];
			break;
		case 5:
			fr=[[750,1270,100,155,100]];
			break;
		default:
			fr=[[830,1270,100,155,100]];
			break;	
	}
	this.Throw=new Animation(
	{
		img:"enemy",
		scale:this.scale,
		frames:fr 	
	}
	);
	this.quite=new Animation(
	{
		img:"enemy",
		scale:this.scale,
		frames: fr	
	}
	);
	this.test=new Animation({
		img:"super",
		scale:this.scale,
		frames:[[0,0,130,159,100],[130,0,130,159,100],[260,0,130,159,100],[390,0,130,159,100],[520,0,130,159,100],[650,0,130,159,100]]
	});
	this.currentAnim=this.quite;
	this.currentAnim.init();
}

/**
 * boss
 */
function Boss(){
	this.form1=0;        /*形态一*/
	this.form2=0;        /*形态二*/
	this.form3=0;        /*形态三*/
	this.form4=0;        /*扔火球*/
	this.currentAnim=0;
	this.scale=0.5;
	this.r=60;
	this.vx=1.2;
	this.vy=Math.random()*3+0.3;
	this.life=1000;
	this.blood=1000;
}
Boss.prototype=new Role();
Boss.prototype.init=function(){
	this.form1=new Animation({
		img:"boss",
		frames:[[0,0,200,200,100],[200,0,200,200,100]]	
	});
	this.form2=new Animation({
		img:"boss",
		frames:[[380,0,190,200,100],[580,0,190,200,100]]
	});
	this.form3=new Animation({
		img:"boss",
		frames:[[800,0,180,200,100],[970,0,190,200,100]]
	});
	this.form4=new Animation({
		img:"new1",
		frames:[[611,0,188,212,200],[798,0,178,212,200]]
	});
	this.currentAnim=this.form1;
	this.currentAnim.init();
	Game.EventManager.registerMyEvent(this,["update"],Control.bossUpdate);
	Game.EventManager.registerMyEvent(this,["death"],Control.enemyDeath);
	Game.EventManager.registerMyEvent(this,["throwFireBall"],Control.throwFireBall);
}

Boss.prototype.update=function(){
	Game.EventManager.triggerMyEvent(this,"update");
}
Boss.prototype.updateState=function(state){
	if(this.state == state ) return;
	this.state=state;
	switch(this.state){
		case 0:this.currentAnim=this.form1;break;
		case 1:this.currentAnim=this.form2;break;
		case 2:this.currentAnim=this.form3;break;
		case 3:this.currentAnim=this.form4;break;
		default:this.currentAnim=this.form1;break;
	}
	this.currentAnim.init();
}

/**
 * Enemy A
 */
function EnemyA(){
	this.run=0;        /*敌人A跑*/
	this.currentAnim=0;
	this.scale=0.5;
	this.vx=1.2;
	this.vy=Math.random()*3+0.3;
	this.r=50;
	this.life=150;
	this.marginal =650+Math.random()*150 ; /*临界点*/
	this.blood=150;
	this.bloodL=30;
	this.bloodW=5;
}
EnemyA.prototype=new Role();
EnemyA.prototype.init=function(){
	this.run=new Animation({
		img:"enemy",
		scale:this.scale,
		frames:[[30,30,200,200,100],[230,30,200,200,100],[430,30,200,200,100]]
	});	
	this.archer =new Animation({
		img:"new1",
		scale:this.scale,
		frames:[[0,0,183,217,100],[180,0,179,211,100],[360,0,160,214,100]]
	});
	
	this.currentAnim=this.run;
	this.currentAnim.init();
	Game.EventManager.registerMyEvent(this,["update"],Control.enemyAUpdate);
	Game.EventManager.registerMyEvent(this,["hit"],Control.enemyHit);
	Game.EventManager.registerMyEvent(this,["death"],Control.enemyDeath);
	Game.EventManager.registerMyEvent(this,["archer"],Control.enemyArcher);
}
EnemyA.prototype.update=function(){
	Game.EventManager.triggerMyEvent(this,"update");
}
EnemyA.prototype.updateState=function(state){
	if(this.state == state ) return;
	this.state=state;
	switch(this.state){
		case 0:this.currentAnim=this.run;break;
		case 1:this.currentAnim=this.archer;break;
		default:this.currentAnim=this.run;break;
	}
	this.currentAnim.init();
}


/**
 * Enemy B
 */
function EnemyB(){
	this.run=0;        /*敌人B跑*/
	this.currentAnim=0;
	this.scale=0.5;
	this.vx=1.2;
	this.vy=Math.random()*3+0.3;
	this.r=50;
	this.life=200;
	this.marginal =750+Math.random()*150 ; /*临界点*/
	this.blood=200;
	this.bloodL=40;
	this.bloodW=5;
}
EnemyB.prototype=new Role();
EnemyB.prototype.init=function(){
	this.run=new Animation({
		img:"enemy",
		scale:this.scale,
		frames:[[30,230,200,200,100],[230,230,200,200,100],[430,230,200,200,100]]
	});
	this.archer =new Animation({
		img:"new1",
		scale:this.scale,
		frames:[[0,0,183,217,100],[180,0,179,211,100],[360,0,160,214,100]]
	});
	this.currentAnim=this.run;
	this.currentAnim.init();
	Game.EventManager.registerMyEvent(this,["update"],Control.enemyBUpdate);
	Game.EventManager.registerMyEvent(this,["hit"],Control.enemyHit);
	Game.EventManager.registerMyEvent(this,["death"],Control.enemyDeath);
	Game.EventManager.registerMyEvent(this,["archer"],Control.enemyArcher);
}
EnemyB.prototype.update=function(){
	Game.EventManager.triggerMyEvent(this,"update");
}
EnemyB.prototype.updateState=function(state){
	if(this.state == state ) return;
	this.state=state;
	switch(this.state){
		case 0:this.currentAnim=this.run;break;
		case 1:this.currentAnim=this.archer;break;
		default:this.currentAnim=this.run;break;
	}
	this.currentAnim.init();
}

/**
 * Archer
 */
function Archer()
{
	this.run=0;        /*敌人B跑*/
	this.currentAnim=0;
	this.scale=0.5;
	this.vx=1.2;
	this.vy=Math.random()*3+0.3;
	this.r=50;
}
Archer.prototype=new Role();
Archer.prototype.init=function(){
	this.run=new Animation({
		img:"archer",
		scale:this.scale,
		frames:[[0,0,168,210,100],[168,0,188,210,100],[356,0,177,210,100],[533,0,189,210,100],[722,0,179,210,100]]
	});
	this.currentAnim=this.run;
	this.currentAnim.init();
	Game.EventManager.registerMyEvent(this,["update"],Control.enemyBUpdate);
	Game.EventManager.registerMyEvent(this,["hit"],Control.enemyHit);
	Game.EventManager.registerMyEvent(this,["death"],Control.enemyDeath);
}
Archer.prototype.update=function(){
	Game.EventManager.triggerMyEvent(this,"update");
}