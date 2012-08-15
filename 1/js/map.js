function Map(){
	this.role=null;
	this.inRefresh=true;
	this.state=0;
	this.currentRoom=null;
	this.roomOne=null;
	this.roomTwo=null;
	this.heart=null;
}

Map.prototype.init=function(){
	/* 注册舞台会发生的事件 */
	Game.EventManager.registerMyEvent(this,["began"],Control.mapBegan);
	Game.EventManager.registerMyEvent(this,["win"],Control.mapWin);
	Game.EventManager.registerMyEvent(this,["fail"],Control.mapFail);
	Game.EventManager.registerMyEvent(this,["clear"],Control.mapClear);
	Game.EventManager.registerMyEvent(this,["addEnemyA"],Control.addEnemyA);
	Game.EventManager.registerMyEvent(this,["addEnemyB"],Control.addEnemyB);
	Game.EventManager.registerMyEvent(this,["addBoss"],Control.addBoss);
	Game.EventManager.registerMyEvent(this,["intoFirstRoom"],Control.intoFirstRoom);
	Game.EventManager.registerMyEvent(this,["intoSecondRoom"],Control.intoSecondRoom);
	Game.EventManager.registerMyEvent(this,["update"],Control.mapUpdate);
	Game.EventManager.register(document.getElementById("heart"),["click"],Control.addBlood);
	
	this.heart = new Heart();
	this.heart.init();
	
	this.role=new Hero();
	this.role.init();
	
	this.roomOne=new RoomFirst(
		{bg:{img:"room1-bg",x:0,y:0}}
	);
	this.roomOne.init();
	this.roomTwo=new RoomSecond(
		{bg:{img:"r2",x:0,y:0}}
	);
	this.roomTwo.init();
		
	
	
	Game.EventManager.triggerMyEvent(this,"began");

}

Map.prototype.refresh=function(){
	if(this.inRefresh){
		this.update();
		this.currentRoom.refresh();
		Game.EventManager.triggerMyEvent(this,"update");
	}
}

Map.prototype.update=function(){
	this.createEnemy();
}


Map.prototype.stopRefresh=function(){
	this.inRefresh=false;
}

Map.prototype.continueRefresh=function(){
	this.inRefresh=true;
}

Map.prototype.updateState=function(state){
	
}


Map.prototype.addGuard=function(){
	for(var i=0;i<5;i++){
		var x=i*50-70;
		var y=400;
		for(var j=0;j<5;j++){
			var guard=new Guard();
			guard.x=x;
			guard.y=y;
			guard.type=i+1;
			guard.init();
			this.currentRoom.armys.push(guard);
			this.currentRoom.objects.push(guard);
			x-=30;
		    y+=50;
		}
	}
	
}

Map.prototype.createEnemy=function(){
	
	if(Game.Enemy.length==0){
		Game.EventManager.triggerMyEvent(this,"win");
		return;
	}
	
	var n=Math.random()*1000;
	if(n>100&&n<110&&Game.Enemy[0].A>0){
	   /*随机产生敌人A*/
		Game.EventManager.triggerMyEvent(this,"addEnemyA");
		Game.Enemy[0].A--;

	}
	if(n>200&&n<208&&Game.Enemy[0].B>0){//随机产生敌人B
		Game.EventManager.triggerMyEvent(this,"addEnemyB");
		Game.Enemy[0].B--;
	}
	if(n>300&&n<380&&Game.Enemy[0].C>0){//随机产生boss
		if(Game.Enemy[0].B<=0&&Game.Enemy[0].A<=0&&this.currentRoom.enemys.length==0){
			Game.EventManager.triggerMyEvent(this,"addBoss");
			Game.Enemy[0].C--;
		}
		
	}
	
	if(Game.Enemy[0].A==0&&Game.Enemy[0].B==0&&Game.Enemy[0].C==0&&this.currentRoom.enemys.length==0){//一大波僵尸已经被灭，准备下一波
		if(Game.Enemy.length>0)
			{
				Game.Enemy.splice(0, 1);;
			}

		/* 进入房间1 */
		if(this.state==2)
		{
			Game.EventManager.triggerMyEvent(this,"intoFirstRoom");
		}
		
	}
	
	

}
 
Map.prototype.addWeapon=function(){
	var weapon=new Ax();
	weapon.x=490;
	weapon.y=300;
	weapon.init();
	this.currentRoom.weapons.push(weapon);
	this.currentRoom.objects.push(weapon);
	console.log("rrr");
}



