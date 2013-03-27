$(function(){
	$('.m-navmain').click(function(){
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
});