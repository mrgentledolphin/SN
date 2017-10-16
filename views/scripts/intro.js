$(function(){
	$('.item1').animate({
			'padding-top': 0,
		},
		1500, function() {

			var svgAttributes = anime({
			  targets: '#svgAttributes polygon',
			  points: '64 128 8.574 96 8.574 32 64 0 119.426 32 119.426 96',
			  easing: 'easeInOutExpo'
			});

			$('.linkToLog').delay(800).animate({'opacity': 1}, 500)
	});


})
