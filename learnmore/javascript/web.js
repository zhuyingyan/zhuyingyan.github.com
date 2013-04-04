$(function(){
	console.log(document.documentElement.scrollHeight);
	$('.m-navmain .m-button').click(function(){
		if($('#aside-nav').hasClass('showAsideNav')){
			$('#aside-nav').removeClass('showAsideNav');
		}
		$('#main-nav').addClass('shawMainNav');
		return false;
	});
	$('.tosidenav').click(function(){
		if($('#main-nav').hasClass('shawMainNav')){
				$('#main-nav').removeClass('shawMainNav');
		}
		$('#aside-nav').addClass('showAsideNav');
		return false;
	});
	$('.search').click(function(){return false;});
	$('body').click(function(){
		if($('#main-nav').hasClass('shawMainNav')){
			$('#main-nav').removeClass('shawMainNav');
		}
		if($('#aside-nav').hasClass('showAsideNav')){
			$('#aside-nav').removeClass('showAsideNav');
		}
	});
	/*$('.m-videoUl').click(function(event){
		var bodyHeight=document.documentElement.scrollHeight,
			clientHeight=document.documentElement.clientHeight;
		bodyHeight=bodyHeight>clientHeight?bodyHeight:clientHeight;
		$('#videoShow').addClass('videoPlay').height(bodyHeight);
		$('#videoShow video')[0].src=event.target.href;
		return false;
	});
	$('#videoShow .a-close').click(function(){
		$('#videoShow').removeClass('videoPlay');
		$('#videoShow video')[0].pause();
	});*/
	$('.a-close').click(function(){
		if($(this).text().indexOf("关灯")!=-1){
			$('body').css('background','rgba(0,0,0,.8)');
			$(this).text("开灯");
		}
		else{
			$('body').css('background','#fff');
			$(this).text("关灯");
		}
		return false;
	});
	$('.picWithWord img').click(function(event){
		var bodyHeight=document.documentElement.scrollHeight,
			clientHeight=document.documentElement.clientHeight,
			screenHeight=bodyHeight<clientHeight?bodyHeight:clientHeight,
			scrollTop=document.documentElement.scrollTop+document.body.scrollTop,
			clientWidth=document.documentElement.clientWidth;	
		bodyHeight=bodyHeight>clientHeight?bodyHeight:clientHeight;
		$('#picShow').addClass('picBig').height(bodyHeight);
		var $pic=$('#picShow .picDiv');
		$('#picShow img')[0].src=event.target.src;
		var imgTop=screenHeight/2-$pic.height()/2,
			imgWidth=$pic.width();
		$pic.css("margin-left",-imgWidth/2);
		$pic.css("margin-top",imgTop+scrollTop);	
		var bodyWidth=document.documentElement.scrollWidth;
			bodyWidth=bodyWidth>clientWidth?bodyWidth:clientWidth,
			bodyWidth=bodyWidth>imgWidth?bodyWidth:imgWidth;
		$('#picShow').width(bodyWidth);
		$('.showWord').text($(this).next('span').text());
		return false;
	});
	$('.picDiv .a-closePic').click(function(){
		$('#picShow').removeClass('picBig');
	});
});