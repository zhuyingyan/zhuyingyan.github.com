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
	$('.m-videoUl').click(function(event){
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
	});
});