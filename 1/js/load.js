(function(){
	var EventUtil={
	  addHandler:function(element,type,handler){
	        if(element.addEventListener){
	            element.addEventListener(type,handler,false);
	        }else if(element.attachEvent){
	            element.attachEvent("on"+type,handler);
	        }else{
	            element["on"+type]=handler;
	        }
	    }
	};
	var settimeclear;
	function getCSSValue(obj,key){
	    if(obj.currentStyle){
	        return obj.currentStyle[key];
	    }else{
	        return document.defaultView.getComputedStyle(obj,null)[key];
	    }
	}
	function onload(){
		var loading=document.getElementById("loading");
		var probar=loading.getElementsByClassName("probar")[0];
		var length=parseInt(getCSSValue(probar,'width'));
		var probar_inner=loading.getElementsByClassName("probar_inner")[0];
		var probar_ax=loading.getElementsByClassName("probar_ax")[0];
		var cover=loading.getElementsByClassName("cover")[0];
		var header=document.getElementById("header");
		var about=document.getElementById("aboutus");
		var number=0;
		var process=function(){
			console.log(number);
			if(number<100){
				number=parseInt((Game.Data.CountLoad.loadedImage+Game.Data.CountLoad.loadedMusic)/(Game.Data.CountLoad.totalImage+Game.Data.CountLoad.totalMusic)*100);
				cover.innerText=number+"%";		    
				probar_inner.style.width=length*number/100+"px";
				probar_ax.style.left=(length-45)*number/100+"px";
				processtime=setTimeout(process,1);
			}else{
				clearTimeout(processtime);
				cover.innerText='';
				probar_ax.style.left=(length-50)+"px";
				loading.className="animation";
				header.className="headimg";
			}
		}
		var processtime=setTimeout(process,1);
		var loading=document.getElementById("loading");
		var about_btn=loading.getElementsByClassName("about_btn")[0];
		var start_btn=loading.getElementsByClassName("start_btn")[0];
		var btn=about.getElementsByClassName("btn")[0];
		EventUtil.addHandler(start_btn,"click",startGame);
		EventUtil.addHandler(about_btn,"click",aboutus);
		EventUtil.addHandler(btn,"click",backtogame);
		var passSay=document.getElementById("passSay");
		EventUtil.addHandler(passSay,"click",pass);

	}
	function startGame(){
		var loading=document.getElementById("loading");
		var header=document.getElementById("header");
		var prologue=document.getElementById("prologue");
		var foreWord=document.getElementById("foreWord");
		var container=document.getElementById("container");
		loading.style.display="none";
		header.style.display="none";
		prologue.style.display="block";
		settimeclear=setTimeout(function(){foreWord.style.display="none";container.style.display="block";Game.Start();},24000);
	}
	function pass(){
		var foreWord=document.getElementById("foreWord");
		foreWord.style.display="none";
		var container=document.getElementById("container");
		container.style.display="block";
		clearTimeout(settimeclear);
		Game.Start();
	}
	function aboutus(){
		var foreWord=document.getElementById("foreWord");
		foreWord.style.opacity=0;
		var about=document.getElementById("aboutus");
		about.style.display="block";

	}
	function backtogame(){
		var about=document.getElementById("aboutus");
		about.style.display="none";
		var foreWord=document.getElementById("foreWord");
		foreWord.style.opacity=1;
	}
	EventUtil.addHandler(window,"load",onload);

})();