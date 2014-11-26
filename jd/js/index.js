(function($){
    $.Slide = function(options,element){
        this.$el = $(element) ;   // the div or ul which to be slided
        this._init(options);

    };

    $.Slide.defaults ={
        prev : null,        // the prev element
        next: null,         // the next element
        s_num : 1,           // the num
        isListUl : true,     // is ul or others
        slide_item : "li",    // the element in the slide_lis
        current: 0,            // index of current item
        isAnimate:false,
        time:5000,
        animateTime: 500
    };
    $.Slide.prototype = {
        _init  :function(options){
            this.options = $.extend(true,{}, $.Slide.defaults,options);

            this.$s_li = this.$el.find(this.options.slide_item);
            this.$s_len = parseInt(this.$s_li.length);
            this.$s_max = Math.ceil(this.$s_len/this.options.s_num * Math.pow(10,0)) / Math.pow(10,0)-1;

            this.$move = this.$s_li.outerWidth(true)  ;
            this.c_num = Math.floor(this.$el.width()/this.$move);
            this.$prev = this.$el.find(this.options.prev);
            this.$next = this.$el.find(this.options.next);

            this.$el_ul = this.$el.find("ul");
            this.$el_ul.css('width',this.$move * this.$s_len);

            this.current = this.options.current;
            this._slideEvents();
            this._hoverEvents();

            if(this.options.isAnimate){
                this._animateEvents();
            }

        },
        _hoverEvents:function(){
            this.$s_li.hover(function(){
                $(this).siblings().removeClass('on');
                $(this).addClass('on');
            });
        },
        _slideEvents: function(){
            var _self = this;

            this.$next.click(function(event){
                var last_px ;
                _self.c_num = Math.floor(_self.$el.width()/_self.$move);
                if(_self.options.s_num>_self.c_num){
                    _self.options.s_num=_self.c_num;
                }
                if(_self.options.isAnimate){
                    clearInterval(_self.flag);
                }
                _self.current+=_self.options.s_num;
                if(_self.current<_self.$s_len - _self.c_num ){
                    _self.$prev.removeClass('ico-prev-false');
                    _self.$next.removeClass('ico-next-false');
                }else{
                    _self.current = _self.$s_len - _self.c_num ;
                    _self.$prev.removeClass('ico-prev-false');
                    _self.$next.addClass('ico-next-false');
                }

                last_px = -(_self.$move * _self.current);
                _self.$el_ul.animate({left:last_px + 'px'}, 'slow');

                if(_self.options.isAnimate){
                    _self._animateEvents();
                }
                _self.$s_li.each(function(){
                    $(this).removeClass("on");
                });
                event.preventDefault();
                return false;
            });

            this.$prev.click(function(event){
                var last_px ;
                _self.c_num = Math.floor(_self.$el.width()/_self.$move);
                if(_self.s_num>_self.c_num){
                    _self.s_num=_self.c_num;
                }
                if(_self.options.isAnimate){
                    clearInterval(_self.flag);
                }
                _self.current-=_self.options.s_num;
                if(_self.current>0){
                    _self.$prev.removeClass('ico-prev-false');
                    _self.$next.removeClass('ico-next-false');
                }else{
                    _self.current = 0;
                    _self.$prev.addClass('ico-prev-false');
                    _self.$next.removeClass('ico-next-false');
                }

                last_px = -(_self.$move * _self.current);
                _self.$el_ul.animate({left:last_px + 'px'}, 'slow');
                if(_self.options.isAnimate){
                    _self._animateEvents();
                }
                _self.$s_li.each(function(){
                    $(this).removeClass("on");
                });
                event.preventDefault();
                return false;
            });
        },
        _animateEvents:function(){
            var _self = this;
            this.flag = setInterval(function(){
                _self.$el_ul.stop().animate({ "left": -1*_self.$move
                }, _self.options.animateTime,function(){
                    var temp = _self.$s_li[_self.current];
                    _self.current++;
                    if(_self.current==_self.$s_len){
                        _self.current = 0;
                    }
                    _self.$el_ul.append(temp); //重新拼装内容
                    _self.$el_ul.css("left", 0); //初始化left
                });
            },parseInt(this.options.time));
        }

    };
    var logError 			= function( message ) {
        if ( this.console ) {
            console.error( message );
        }
    };

    $.fn.slide = function(options){
        this.each(function() {

            var instance = $.data( this, 'slide' );
            if ( !instance ) {
                $.data( this, 'slide', new $.Slide( options, this ) );
            }
        });
        return this;
    };
})(jQuery);

//one for more一个对应多个的
(function($,undefined){
    $.Tag = function(options,element){
        this.$el = $(element) ;   // the div or ul which to be slided
        this._init(options);

    };
    $.Tag.defaults ={
        nav : null,        // the nav element
        contentArr: null,         // the content element  array ul.classname
        navItem:"li",
        contentItemArr:["li"],     //needed
        event:"click",        // the event target
        cur_css: "on",
        isAnimate:false,         // play or not
        time:5000 ,
        isLeftRight:false ,
        leftArrow:null,
        rightArrow:null
    };
    $.Tag.prototype = {
        _init  :function(options){
            this.options = $.extend(true,{}, $.Tag.defaults,options);

            this.$nav = $(this.options.nav).find("ul:first");
            this.$contentArr = $(this.options.contentArr);
            this.$contentLen = this.$contentArr.length;
            this.$navItem = this.$nav.find(this.options.navItem);

            this.current = 0;
            this.length = this.$navItem.length;
            this.addClassName = this.options.cur_css;
            this._tagEvents();

            if(this.options.isLeftRight){
                this.$leArr = this.$el.find(this.options.leftArrow);
                this.$riArr = this.$el.find(this.options.rightArrow);
                this.leftPx = 0;
                this.leftest = 0;  //左边边界值
                this.navItemWidth = this.$navItem.eq(0).outerWidth(true);
                this.navShowNum = Math.floor($(this.options.nav).width()/this.navItemWidth);
                this.rightest = this.navShowNum - 1;
                this._lrEvent();
            }

            if(this.options.isAnimate){
                this.isSwitch = this.options.isAnimate;
                this._autoEvent();
            }
            var _self =this;
            window.onresize = function(){
                _self.throttle(_self.resizeFun,_self);
            }

        },
        _addClass:function(i,className){
            var j,$contentItem;
            for(j = 0;j<this.$contentLen;j++){
                $contentItem=$(this.$contentArr[j]).find(this.options.contentItemArr[j]);
                $contentItem.removeClass(className);
                $contentItem.eq(i).addClass(className);
            }

            this.$navItem.removeClass(className);
            this.$navItem.eq(i).addClass(className);
        },
        _tagEvents:function(){
            var _self = this, i,that;
            for(i=0;i<_self.length;i++){
                _self.$navItem.eq(i).on(_self.options.event,{num:i},function(event){
                    if(_self.isSwitch){
                        clearInterval(_self.interFun);
                    }
                    that = _self.$navItem.eq(event.data.num);
                    _self._addClass(event.data.num,_self.addClassName);
                    _self.current = event.data.num;
                    if(_self.isSwitch && _self.options.event!="hover"){
                        _self._autoEvent();
                    }
                    return false;
                });
                _self.$navItem.eq(i).on("mouseleave",{num:i},function(event){
                    if(_self.isSwitch && _self.options.event=="hover"){
                        _self._autoEvent();
                    }
                    return false;
                });
            }
        },
        toRight:function(){
            var _self = this,last_px;
            if(_self.current > _self.length - 1){
                _self.current = 0;
                if(_self.options.isLeftRight){
                    last_px = 0;
                    _self.leftPx = last_px;
                    _self.leftest = 0;
                    _self.rightest = _self.navShowNum - 1;
                    _self.$nav.animate({left:last_px + 'px'}, 'slow');
                }
                _self._addClass(_self.current,_self.addClassName);
                return false;
            }

            else if((_self.current - 1)==_self.rightest){
                _self._addClass(_self.current,_self.addClassName);
                if(_self.options.isLeftRight){
                    last_px = _self.leftPx - _self.navItemWidth;
                    _self.leftPx = last_px;
                    _self.leftest = _self.leftest + 1;
                    _self.rightest = _self.rightest + 1;
                    _self.$nav.animate({left:last_px + 'px'}, 'slow');
                }
                return false;
            }
            else{
                _self._addClass(_self.current,_self.addClassName);
                return false;
            }
        },
        _lrEvent:function(){
            var _self = this,last_px;
            this.$leArr.click(function(){
                clearInterval(_self.interFun);
                _self.current = _self.current - 1;
                if(_self.current < 0){
                    _self.current = _self.length - 1;
                    last_px = _self.leftPx - _self.navItemWidth * (_self.length - _self.navShowNum);
                    _self.leftPx = last_px;
                    _self.leftest = _self.length - _self.navShowNum;
                    _self.rightest = _self.length - 1;
                    _self._addClass(_self.current,_self.addClassName);
                    _self.$nav.animate({left:last_px + 'px'}, 'slow');
                }
                else if( (_self.current + 1)==_self.leftest){
                    last_px = _self.leftPx + _self.navItemWidth;
                    _self._addClass(_self.current,_self.addClassName);
                    _self.$nav.animate({left:last_px + 'px'}, 'slow');
                    _self.leftPx = last_px;
                    _self.leftest = _self.leftest - 1;
                    _self.rightest = _self.rightest - 1;
                }
                else{
                    _self._addClass(_self.current,_self.addClassName);
                }
                _self._autoEvent();
                return false;

            });

            this.$riArr.click(function(){
                clearInterval(_self.interFun);
                _self.current = _self.current + 1;
                _self.toRight();
                _self._autoEvent();
                return false;
            });

        },

        _autoEvent:function(){
            var _self = this;
            _self.interFun = setInterval(function(){
                _self.current = _self.current + 1;
                _self.toRight();
            },this.options.time);
        },
        throttle:function(method,context){
            clearTimeout(method.tId);
            method.tId = setTimeout(function(){
                method.call(context);
            },100);
        },
        resizeFun:function(){
            this.navShowNum = Math.floor($(this.options.nav).width()/this.navItemWidth);
            this.rightest = this.navShowNum - 1;
        }

    };
    var logError 			= function( message ) {
        if ( this.console ) {
            console.error( message );
        }
    };

    $.fn.tag = function(options){
        this.each(function() {

            var instance = $.data( this, 'tag' );
            if ( !instance ) {
                $.data( this, 'tag', new $.Tag( options, this ) );
            }
        });
        return this;
    };
})(jQuery);

(function($){
    $("#slidePt").slide({
        prev:".ico-prev",
        next:".ico-next",
        s_num:5,
        content:".slide-wr"
    });
    $('.focus').tag({
        nav:'.focus-nav',
        contentArr:'.ps_tag',
        contentItemArr:['li','li'],
        event:"hover",
        isLeftRight:true,
        leftArrow:".ico-prev",
        rightArrow:".ico-next",
        isAnimate:true
    });

    // star
    $(".hit-star").each(function(){
        var $this =$(this),widthPar = $this.find(".star-wr").width(),itemWidth;
        itemWidth = parseInt($this.find(".star-txt span").text())*parseInt(widthPar)/100;
        $this.find(".star").width(itemWidth);
    });


})(jQuery);