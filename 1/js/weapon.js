
/**
 * 武器基本对象
 */
function Weapon(){
	this.state=0;
	this.power=0;
	this.isEnemy=false;
	this.hit=false;
	this.marginal =0 ; /*临界点*/
	this.g=0.9;//重力速度
	this.vx=0;
	this.vy=0;
}
Weapon.prototype = new Obj();
Weapon.prototype.init = function(){
	Game.EventManager.registerMyEvent(this,["death"],Control.weaponDeath);
	Game.EventManager.registerMyEvent(this,["touchdown"],Control.weaponTouchdown);
}
Weapon.prototype.fly = function(){
	if(this.y>=Game.Map.currentRoom.marginal&&this.vy>0){//武器消失
		this.hit=true;
		Game.EventManager.triggerMyEvent(this,"touchdown");
	}
	this.y+=this.vy;
	this.vy+=this.g;
	this.x+=this.vx;
}
Weapon.prototype.stop = function(){
	this.vx=0;
	this.vy=0;
	this.g=0;
}

/**
 *	拖鞋
 */
 function Slipper(){
	this.flyAnim=null;
 }
 Slipper.prototype = new Weapon();
 
 Slipper.prototype.init = function (){
    this.marginal=380+(Math.random()*100);
	this.flyAnim={
			img:"weapon",
			scale:0.7,
			frames:[[60,60,100,100,100]]
	};
	this.currentAnim=this.flyAnim;
	this.currentAnim.init();
	EventManager.registerMyEvent(this,"death",Control.weaponDeath);
	EventManager.registerMyEvent(this,"touchdown",Control.weaponTouchdown);
 }
 
 Slipper.prototype.update = function(){
	if(this.y>=this.marginal&&this.vy>0){//武器消失
		this.hit=true;
		EventManager.triggerMyEvent(this,"touchdown");
	}
	this.y+=this.vy;
	this.vy+=this.g;
	this.x+=this.vx;
 }
 
 /**
  * 火球
  */
 function FireBall(){
	this.r=50;
	this.power=50;
	this.isEnemy=true;
	this.flyAnim=null;
 }
 FireBall.prototype = new Weapon();
 FireBall.prototype.superClass=Weapon.prototype;
 FireBall.prototype.init = function (){
	this.superClass.init.call(this,null);
    this.marginal=350+(Math.random()*200);
	this.flyAnim=new Animation({
			img:"new1",
			scale:0.7,
			frames:[[550,225,158,128,100],[706,225,160,128,100],[865,225,137,128,100]]
	});
	this.dispear=new Animation({
		img:"new1",
		scale:this.scale,
		frames:[[42,364,142,194,40]]
	});
	this.currentAnim=this.flyAnim;
	this.currentAnim.init();
 }
 
 FireBall.prototype.update = function(){
	this.fly();
 }
 
 FireBall.prototype.updateState = function(state){
	if(this.state == state ) return;
	this.state=state;
	switch(this.state){
		case 0:this.currentAnim=this.flyAnim;break;
		case 1:
			this.currentAnim=this.dispear;
			this.hit=true;
			break;
		default:this.currentAnim=this.flyAnim;break;
	}
	this.currentAnim.init();
}

 /**
  * 弓箭
  */
 function Arrow(){
	this.flyAnim=null;
	this.scale=0.7;
	this.r=30;
	this.power=30;
 }
 Arrow.prototype = new Weapon();
 Arrow.prototype.superClass=Weapon.prototype;
 Arrow.prototype.init = function (){
	this.superClass.init.call(this,null);
    this.marginal=350+(Math.random()*200);
	this.flyAnim=new Animation({
			img:"new1",
			scale:this.scale,
			frames:[[403,211,129,100,600],[252,211,152,100,200],[122,211,129,100,200],[0,211,121,100,1000]]
	});
	this.dispear=new Animation({
		img:"enemy",
		scale:0.2,
		frames:[[744,932,276,200,40]]
	});
	this.currentAnim=this.flyAnim;
	this.currentAnim.init();
 }
 
 Arrow.prototype.update = function(){
	this.fly();
 }
Arrow.prototype.updateState = function(state){
	if(this.state == state ) return;
	this.state=state;
	switch(this.state){
		case 0:this.currentAnim=this.flyAnim;break;
		case 1:
			this.currentAnim=this.dispear;
			this.hit=true;
			break;
		default:this.currentAnim=this.flyAnim;break;
	}
	//console.log(this.dispear);
	this.currentAnim.init();
}
/**
 * 斧头
 */
function Ax(){
	this.flyAnim=null;
	this.scale=0.7;
	this.vx=2;
	this.vy=-2;
	this.dispear=null;
	this.r=50;
	this.power=60;
	this.level1=0; //斧头升级1
	this.level2=0; //斧头升级2
	this.level3=0; //斧头升级3
 }
 Ax.prototype = new Weapon();
 Ax.prototype.superClass=Weapon.prototype;
 Ax.prototype.init = function (){
 	this.superClass.init.call(this,null);
    this.marginal=450+(Math.random()*100);
	this.flyAnim=new Animation({
			img:"enemy",
			scale:this.scale,
			frames:[[50,788,76,75,60],[260,790,85,85,60],[370,810,70,70,60],[475,790,85,85,60],[721,778,90,90,60],[834,802,90,90,60]]
			
	});
	this.dispear=new Animation({
		img:"enemy",
		scale:0.5,
		frames:[[744,932,276,200,40]]
	});
	this.level1=new Animation({
		img:"newAx",
		scale:0.5,
		frames:[[0,0,97,135,60],[97,0,99,135,60],[194,0,107,135,60],[300,0,123,135,60],[423,0,122,135,60],[544,0,117,135,60],[661,0,110,135,60],[771,0,117,135,60]]
	});
	this.level2=new Animation({
		img:"newAx",
		scale:0.5,
		frames:[[0,135,97,137,60],[97,135,99,137,60],[194,135,107,137,60],[300,135,123,137,60],[423,135,122,137,60],[544,135,117,137,60],[661,135,110,137,60],[771,135,117,137,60]]
	});
	this.level3=new Animation({
		img:"newAx",
		scale:0.5,
		frames:[[0,271,97,134,60],[97,271,99,134,60],[194,271,107,134,60],[300,271,123,134,60],[423,271,122,134,60],[544,271,117,134,60],[661,271,110,134,60],[771,271,117,134,60]]
	});
	this.currentAnim=this.flyAnim;
	this.currentAnim.init();

 }
 
 Ax.prototype.update = function(){
	if(this.state==1) return;
	this.fly();
 }

Ax.prototype.updateState = function(state){
	if(this.state == state ) return;
	this.state=state;
	switch(this.state){
		case 0:this.currentAnim=this.flyAnim;break;
		case 1:
			this.currentAnim=this.dispear;
			this.hit=true;
			break;
		default:this.currentAnim=this.flyAnim;break;
	}
	//console.log(this.dispear);
	this.currentAnim.init();
}