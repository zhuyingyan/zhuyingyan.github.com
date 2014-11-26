/**
 * 图片延时加载插件
 *
 * @module lazy
 * @author wangcanlin@xunlei.com
 * @version 1.0
 * @example
 lazy.init();
 lazy.run();
 */
var LAZY=(function(){
    var pResizeTimer = null;
    var imgs={};
    function addEventHandler (oTarget, sEventType, fnHandler) {
        if (oTarget.addEventListener) {
            oTarget.addEventListener(sEventType, fnHandler, false);
        } else if (oTarget.attachEvent) {
            oTarget.attachEvent("on" + sEventType, fnHandler);
        } else {
            oTarget["on" + sEventType] = fnHandler;
        }
    };
    function resize(){
        if(pResizeTimer) return '';
        pResizeTimer = setTimeout(function(){
            resize_run();
            try{
                clearTimeout(pResizeTimer);
            }
            catch(e){}
            pResizeTimer=null;
        }, 100);
    }
    function resize_run(){
        var min={};
        var max={};
        //min.Top=document.documentElement.scrollTop;
        min.Top = document.body.scrollTop + document.documentElement.scrollTop;
        min.Left=document.documentElement.scrollLeft;
        max.Top=min.Top+document.documentElement.clientHeight;
        max.Left=min.Left+document.documentElement.clientWidth;

        for(var i in imgs){
            if(imgs[i]){
                var _img=imgs[i];
                var img=document.getElementById(i);
                var width = img.clientWidth;
                var height = img.clientHeight;
                var wh=position(img);
                if(
                    (wh.Top>min.Top && wh.Top<max.Top && wh.Left>min.Left && wh.Left<max.Left)
                        ||
                        ((wh.Top+height)>min.Top && wh.Top<max.Top && (wh.Left+width)>min.Left && wh.Left<max.Left))
                {
                    img.src=_img.src;
                    delete imgs[i];
                }

            }
        }
    }

    function position(o){
        var p={Top:0,Left:0};
        while(!!o){
            p.Top+=o.offsetTop;
            p.Left+=o.offsetLeft;
            o=o.offsetParent;
        }
        return p;
    }

    return {
        init:function(){
            for(var i=0;i<document.images.length;i++){
                var img = document.images[i];
                var config={};
                config.id = img.id;
                config.src = img.getAttribute('_src');
                if(config.src && !config.id){
                    config.id = encodeURIComponent(config.src) + Math.random();
                    img.id = config.id;
                }
                if(!config.id || !config.src) continue;
                LAZY.push(config);
            }
            var ttiframes=document.body.getElementsByTagName("iframe");
            for(var i=0;i<ttiframes.length;i++){
                var config={};
                config.id = ttiframes[i].id;
                config.src = ttiframes[i].getAttribute('_src');
                if(config.src && !config.id){
                    config.id = encodeURIComponent(config.src) + Math.random();
                    ttiframes[i].id = config.id;
                }
                if(!config.id || !config.src) continue;
                LAZY.push(config);
            }
        },
        push:function(config){
            imgs[config.id] = config;
        },
        run:function(){
            resize_run();
            addEventHandler(window,'scroll',resize);
            addEventHandler(window,'resize',resize);
        },
        resize_run:resize_run
    };
})();

//初始化lazy
LAZY.init();
LAZY.run();