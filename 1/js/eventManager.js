
(function (){

/**
 * 构造函数.
 * @name EventManager
 * @class EventManager是一个简单的系统事件管理器。
 */
var EventManager =  function(){
	this.keyState = {};
	this._evtHandlers = {};
	this.target=Game.Container.canvas;
};

EventManager.prototype.registerMyEvent = function(obj,events,callback){
	var me = this;
	handler = function(e){
			me._onEvent(e, obj, callback);
	};
	
	for(var i = 0; i < events.length; i++)
	{
		/*获得事件类型*/
		var type = events[i] ;
		/*以注册列表*/
		var list = this._evtHandlers[type] || (this._evtHandlers[type] = []);
		var has = false;
		for(var j = 0; j < list.length; j++)
		{
			var li = list[j];
			if(li.obj == obj && li.callback == callback) 
			{			
				has = true;
				break;
			}
		}
		if(!has)
		{
			list.push({obj:obj, callback:callback, handler:handler});
		}
	}
}

EventManager.prototype.unregisterMyEvent = function(obj,events,callback){
	for(var i = 0; i < events.length; i++)
	{
		var type = events[i], list = this._evtHandlers[type];
		for(var j = 0; j < list.length; j++)
		{
			var li = list[j];
			if( li.obj == obj && (li.callback == callback || callback == null))
			{
				list.splice(j, 1);
				break;
			}
		}
	}
}

EventManager.prototype.triggerMyEvent = function(obj,event){
	var list = this._evtHandlers[event] || [];
	var has = false;
	var fun = null;
	for(var j = 0; j < list.length; j++)
	{
		var li = list[j];
		if(li.obj == obj ) 
		{			
			has = true;
			fun= li.callback;
			if(typeof fun == "function")
			{	
				try{
					fun.call(obj,{type:event});
				}catch(err){
					console.log("err……");
				}
			}
			continue;
		}
	}
		
}

/**
 * 注册game obj事件侦听，使得游戏对象能够接收和处理指定的事件。
 * @param target 监听对象。
 * @param events 要注册的事件类型数组。
 * @param callback 回调方法
 * @param isIn 是否在对象上面
 */
EventManager.prototype.register = function(target, events, callback)
{
	var me = this;
	handler = function(e){		
		me._onEvent(e, window, callback);
	};
	
	for(var i = 0; i < events.length; i++)
	{
		/*获得事件类型*/
		var type = events[i] ;
		/*以注册列表*/
		var list = this._evtHandlers[type] || (this._evtHandlers[type] = []);
		var has = false;
		for(var j = 0; j < list.length; j++)
		{
			var li = list[j];
			if(li.target == target && li.callback == callback) 
			{		
				has = true;
				break;
			}
		}
		if(!has)
		{
			list.push({target:target, callback:callback, handler:handler});
			target.addEventListener(type, handler, false);
		}
	}
};

/**
 * 删除game obj事件侦听。
 * @param target 监听对象。
 * @param events 要删除的事件类型数组。
 * @param callback 回调方法
 */
EventManager.prototype.unregister = function(target, events, callback)
{
	for(var i = 0; i < events.length; i++)
	{
		var type = events[i], list = this._evtHandlers[type];
		for(var j = 0; j < list.length; j++)
		{
			var li = list[j];
			if( li.target == target && (li.callback == callback || callback == null))
			{
				target.removeEventListener(type, li.handler);
				list.splice(j, 1);
				break;
			}
		}
	}
};

/**
 * 注册game obj事件侦听，使得游戏对象能够接收和处理指定的事件。
 * @param obj 舞台对象。
 * @param events 要注册的事件类型数组。
 * @param callback 回调方法
 * @param isIn 是否在对象上面
 */
EventManager.prototype.registerBean = function(obj, events, callback,isIn)
{
	var me = this;
	handler = function(e){
		/* if */
		if(!isIn || checkPointInObj(obj,e)){	
			me._onEvent(e, obj, callback);
		}	
	};
	
	for(var i = 0; i < events.length; i++)
	{
		/*获得事件类型*/
		var type = events[i] ;
		/*以注册列表*/
		var list = this._evtHandlers[type] || (this._evtHandlers[type] = []);
		var has = false;
		for(var j = 0; j < list.length; j++)
		{
			var li = list[j];
			if(li.obj == obj && li.callback == callback) 
			{			
				has = true;
				break;
			}
		}
		if(!has)
		{
			list.push({obj:obj, callback:callback, handler:handler});
			this.target.addEventListener(type, handler, false);
		}
	}
};

/**
 * 删除game obj事件侦听。
 * @param obj 舞台对象。
 * @param events 要删除的事件类型数组。
 * @param callback 回调方法
 */
EventManager.prototype.unregisterBean = function(obj, events, callback)
{
	for(var i = 0; i < events.length; i++)
	{
		var type = events[i], list = this._evtHandlers[type];
		for(var j = 0; j < list.length; j++)
		{
			var li = list[j];
			if( li.obj == obj && (li.callback == callback || callback == null))
			{
				this.target.removeEventListener(type, li.handler);
				list.splice(j, 1);
				break;
			}
		}
	}
};


/**
 * 内部事件处理器。
 * @private
 */
EventManager.prototype._onEvent = function(e, obj, callback)
{	
	var ne = e, type = e.type, isTouch = e.type.indexOf("touch") == 0;
    if(isTouch)
    {
        ne = (e.touches && e.touches.length > 0) ? e.touches[0] : 
            (e.changedTouches && e.changedTouches.length > 0) ? e.changedTouches[0] : e;
        ne.type = type;
    }
	callback.call(obj, ne);
}

Game.EventManager= new EventManager();
})();