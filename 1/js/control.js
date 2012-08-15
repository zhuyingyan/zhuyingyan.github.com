
/**
 *控制
 */
var Control={
	tmp:function(e){
		
	
	},

	/**
	 * 舞台事件
	 */	
	mapBegan:function(e){
		this.currentRoom=this.roomOne;
		this.currentRoom.role=this.role;
		this.currentRoom.addObj(this.role);
		this.role.x=300;
		this.role.y=300;
		Game.EventManager.triggerMyEvent(this,"intoFirstRoom");
	},
	mapWin:function(){
		Game.Pause();
		if(Game.isMusicOn)
		{
			Game.Data.AudioCache['bgMusic'].pause();
			Game.Data.AudioCache['win'].play();
		}
		var game_happyending=document.getElementById("game_happyending");
		game_happyending.style.display="block";
		//alert("end");
	},
	mapFail:function(){
		Game.Pause();
		if(Game.isMusicOn)
		{
			Game.Data.AudioCache['bgMusic'].pause();
			Game.Data.AudioCache['fail'].play();
		}
		var game_badending=document.getElementById("game_badending");
		game_badending.style.display="block";
		//alert("over");
	},
	addEnemyA:function(){
		var en=new EnemyA();
		en.x=1000;
		en.y=300+Math.random()*250;
		en.init();
		if(this.state==2) en.updateState(1);
		this.currentRoom.addEnemy(en);
		
	},
	mapClear:function(){
		this.state=0;
		this.roomOne.clear();
		this.roomTwo.clear();
		this.role.state=1;
		this.role.life=this.role.blood;
		this.heart.now=0;
		this.heart.t=0;
	},
	addEnemyB:function(){
		var en=new EnemyB();
		en.x=1000;
		en.y=300+Math.random()*250;
		en.init();
		if(this.state==2) en.updateState(1);
		this.currentRoom.addEnemy(en);
	},
	addBoss:function(){
		var en=new Boss();
		en.x=1000;
		en.y=350+Math.random()*200;
		en.init();
		this.currentRoom.addEnemy(en);
	},
	intoFirstRoom:function(){
		if(this.state==0){
			this.state=1;
			//this.addGuard();
		}else{
			if(Game.Enemy.length!=0){
				Game.Pause();
				toOne("backToOne");       //参数是div层的id
			}
			this.role.x=300;
			this.role.y=300;
			this.currentRoom=this.roomOne;
			this.currentRoom.role=this.role;
			this.currentRoom.clear(); 
			this.currentRoom.addObj(this.role);
			//this.addGuard();
			this.state=1;
		}
	},
	intoSecondRoom:function(){
		toSecond("oneChangeTwo");      //参数是div层的id
		Game.Pause();
		this.state=2;
		this.role.x=275;
		this.role.y=475;
		this.role.updateState(1);
		this.currentRoom=this.roomTwo;
		this.currentRoom.clear(); 
		this.currentRoom.role=this.role;
		this.currentRoom.addObj(this.role);
		var en=this.roomOne.enemys;
		for(var i = 0; i < en.length; i++)
		{
			en[i].x+=600;
			if(en[i] instanceof EnemyA || en[i] instanceof EnemyB)
				en[i].updateState(1);
			this.currentRoom.addEnemy(en[i]);
		}
		this.heart.draw();
		clearLine();
	},
	addBlood:function(){
		if(Game.Map.heart.isValid()){
			Game.Map.role.life+=Game.Map.heart.life;
			if(Game.Map.role.life>Game.Map.role.blood)
				Game.Map.role.life=Game.Map.role.blood;
			Game.Map.heart.now=0;
			Game.Map.heart.draw();
		}
	},
	mapUpdate:function(){
		if( !this.heart.isValid()){
			this.heart.t+=0.05;
			if(this.heart.t>5){
				this.heart.now+=5;
				this.heart.draw();
				this.heart.t=0;
			}
			
		}
		
	},
	/**
	 * 房间事件
	 */
	firstRoomUpdate:function(){
		var wp=this.weapons,
		en=this.enemys;
		var w,e;
		for(var i=0;i<wp.length;i++)
		{	
			if(wp[i].hit) 
				continue;
			w=wp[i];
			if(!w.isEnemy){
			for(var j=0;j<en.length;j++){
				if(en[j]){			
					e=en[j];	
					if(checkHit(e,w)){	
						e.life-=w.power;
						Game.EventManager.triggerMyEvent(w,"touchdown");	
						Game.EventManager.triggerMyEvent(e,"hit");
						break;
					}
				}
			}
			}
	    }
	},
	secondRoomUpdate:function(e){
		
		var wp=this.weapons,
		en=this.enemys;
		var w,e;
		for(var i=0;i<wp.length;i++)
		{	
			if(wp[i].hit) 
				continue;
			w=wp[i];
			if(!w.isEnemy){
				for(var j=0;j<en.length;j++){
					if(en[j]){			
						e=en[j];
						if(checkHit(e,w)){	
							e.life-=w.power;
							Game.EventManager.triggerMyEvent(w,"touchdown");	
							Game.EventManager.triggerMyEvent(e,"hit");
							break;
						}
					}
				}
			}else{
				if(checkHit(w,Game.Map.role)){
					Game.Map.role.life-=w.power;
					Game.EventManager.triggerMyEvent(w,"touchdown");
					if(Game.Map.role.state !=1 ) return;
					Game.EventManager.triggerMyEvent(Game.Map.role,"hit");
					
				}
			}
	    }
	},
	
	/**
	 * 主角事件
	 */
	heroUpdate:function(){
		this.showBlood(Game.Container.context);
		if(this.life<0){
			Game.EventManager.triggerMyEvent(Game.Map,"fail");
			return;
		}
	},
	heroOn:function(e){
		this.updateState(0);
		this.record=[];
		var zleft=Game.Container.zoffsetLeft;
		var ztop=Game.Container.zoffsetTop;
		var dis=e.pageX-zleft;
		this.record.push({x:dis,y:e.pageY});
		Game.EventManager.target.style.cursor='pointer';
	},
	heroMove:function(e){
		if(this.state==0){
			var zleft=Game.Container.zoffsetLeft;
			var ztop=Game.Container.zoffsetTop;
			var dis=e.pageX-zleft;
			this.record.push({x:dis,y:e.pageY});
			var l=this.record.length;
			var vx=(this.record[l-1].x-this.record[0].x)/8;
			var vy=(this.record[l-1].y-this.record[0].y)/8;
			if(vx<0){
				clearLine();
			}else{
				drawLine(this.record[0].x,this.record[0].y,vx,vy,0.9);
			}
		}else{
			Game.EventManager.target.style.cursor='default';
		}	
	},
	heroOut:function(e){
		if(this.state==0){
			var container=document.getElementById("container");
			var dis=e.pageX-container.offsetLeft;
			this.record.push({x:dis,y:e.pageY});
			Control.throwWeapon(this);
			
		}else{
			
		}
		this.updateState(1);
	},
	throwWeapon:function(hero){
		var l=hero.record.length;
		var vx=(hero.record[l-1].x-hero.record[0].x)/8;
		var vy=(hero.record[l-1].y-hero.record[0].y)/8;
		if(vx<0){
			clearLine();
			return;
		}
		var w=new Ax();
		w.init();		
		w.x=hero.record[0].x;
		w.y=hero.record[0].y;	
		w.vx=vx;
		w.vy=vy;
		Game.Map.currentRoom.addWeapon(w);
		clearLine();
	},
	heroHit:function(){
		if(this.state == 0) return;
		this.updateState(2);
		var me=this;
		setTimeout(function(){
			if(me.state == 2)
				me.updateState(1);
		},500);
	},
	heroFocus:function(e){
		if(checkPointInObj(this,e) && this.state!=0){
			Game.EventManager.target.style.cursor='pointer';
			this.updateState(3);
		}else if(this.state!=0){
			this.updateState(1);
		}
	},
	/**
	 * 敌人事件
	 */
	enemyAUpdate:function(){
		this.showBlood(Game.Container.context);
		if(this.life<0){
			Game.EventManager.triggerMyEvent(this,"death");
			return;
		}
		if(Game.Map.state==1){	
			/* 房间1中的情况 */
			this.x-=this.vx;
			var r=Math.random()*600;
			var max,min;
			if(this.x<800){
				min=100;
				max=180;
			}else{
				min=100;
				max=120;
			}
	
			if(this.y>520&&r>min&&r<max){		
				this.y-=this.vy;
			}else if(this.y<400&&r>min&&r<max){
				this.y+=this.vy;
			}
			if(this.x<400){
				this.vx=0;
				Game.EventManager.triggerMyEvent(Game.Map,"intoSecondRoom");
			}
		}else{
			/* 房间2中的情况 */		
			var r=Math.random()*600;
			var max,min;
			if(this.x<800){
				min=100;
				max=180;
			}else{
				min=100;
				max=120;
			}	
			/*放箭*/
			if(405<r&&r<415){
				Game.EventManager.triggerMyEvent(this,"archer")
			}
			
			if(this.x<this.marginal) return;
			this.x-=this.vx;
			if(this.y>520&&r>min&&r<max){		
				this.y-=this.vy;
			}else if(this.y<400&&r>min&&r<max){
				this.y+=this.vy;
			}
			
		
		}
	},
	enemyBUpdate:function(){
		this.showBlood(Game.Container.context);
		if(this.life<0){
			Game.EventManager.triggerMyEvent(this,"death");
			return;
		}
		if(Game.Map.state==1){	
			/* 房间1中的情况 */
			this.x-=this.vx;
			var r=Math.random()*600;
			var max,min;
			if(this.x<800){
				min=100;
				max=180;
			}else{
				min=100;
				max=120;
			}
	
			if(this.y>520&&r>min&&r<max){		
				this.y-=this.vy;
			}else if(this.y<400&&r>min&&r<max){
				this.y+=this.vy;
			}
			if(this.x<400){
				this.vx=0;
				Game.EventManager.triggerMyEvent(Game.Map,"intoSecondRoom");
			}
		}else{
			/* 房间2中的情况 */
			var r=Math.random()*600;
			var max,min;
			if(this.x<800){
				min=100;
				max=180;
			}else{
				min=100;
				max=120;
			}	
			
			/*放箭*/
			if(405<r&&r<415){
				Game.EventManager.triggerMyEvent(this,"archer")
			}
			
			if(this.x<this.marginal) return;
			this.x-=this.vx;
			if(this.y>520&&r>min&&r<max){		
				this.y-=this.vy;
			}else if(this.y<400&&r>min&&r<max){
				this.y+=this.vy;
			}
			
			
		}
	},
	bossUpdate:function(){
		this.showBlood(Game.Container.context);
		if(this.life<0){
			Game.EventManager.triggerMyEvent(this,"death");
			return;
		}
		if(Game.Map.state==1){	
			/* 房间1中的情况 */
			this.x-=this.vx;
			var r=Math.random()*600;
			var max,min;
			if(this.x<800){
				min=100;
				max=180;
			}else{
				min=100;
				max=120;
			}
	
			if(this.y>520&&r>min&&r<max){		
				this.y-=this.vy;
			}else if(this.y<400&&r>min&&r<max){
				this.y+=this.vy;
			}
			if(this.x<400){
				this.vx=0;
				Game.EventManager.triggerMyEvent(Game.Map,"intoSecondRoom");
			}
			
		}else{
			/* 房间2中的情况 */
			var r=Math.random()*600;
			var max,min;
			if(this.x<800){
				min=100;
				max=180;
			}else{
				min=100;
				max=120;
			}	
			if(this.x<590) return;
			this.x-=this.vx;
			if(this.y>520&&r>min&&r<max){		
				this.y-=this.vy;
			}else if(this.y<400&&r>min&&r<max){
				this.y+=this.vy;
			}
			
			if(405<r&&r<415){
				
				Game.EventManager.triggerMyEvent(this,"throwFireBall")
			}
			
		
		}
	},
	throwFireBall:function(){
		this.updateState(3);
		var w=new FireBall();
		w.init();
		w.x=this.x;
		w.y=this.y;
		w.isEnemy=true;
		var r=Math.random()*8;
		w.vy=-18-r;
		w.vx=getVelocityX(w.x,w.y,Game.Map.role.x,Game.Map.role.y,w.g,w.vy);
		Game.Map.currentRoom.addWeapon(w);
		var me=this;
		setTimeout(function(){me.updateState(0);},400);
	},
	enemyArcher:function(){
		var w=new Arrow();
		w.init();
		w.x=this.x;
		w.y=this.y;
		w.isEnemy=true;
		var r=Math.random()*8;
		w.vy=-18-r;
		w.vx=getVelocityX(w.x,w.y,Game.Map.role.x,Game.Map.role.y,w.g,w.vy);
		Game.Map.currentRoom.addWeapon(w);
	},
	enemyHit:function(){
		
	},
	enemyDeath:function(){
		try{
		Game.Map.currentRoom.delEnemy(this);
		Game.EventManager.unregisterMyEvent(this,["update","death"]);
		}catch(e){
			console.log(e);
		}
	},
	/**
	 * 武器事件
	 */
	
	weaponDeath:function(){
		try{
		Game.Map.currentRoom.delWeapon(this);
		Game.EventManager.unregisterMyEvent(this,["update","death"]);
		}catch(e){
			console.log(e);
		}
		
	},
	weaponTouchdown:function(){
		//setTimeout
		this.vx=this.vy=0;
		this.updateState(1);
		Game.EventManager.unregisterMyEvent(this,["touchdown"],Control.weaponTouchdown);
		var me=this;
		setTimeout(function(){Game.EventManager.triggerMyEvent(me,"death")},200);
	}
	
}
