$(function () {
	$('.dropper').on('click', function() {
		if ( $('.drop').hasClass('down') ) {
			$('.drop').slideUp(200, function() {
				$('.drop').removeClass('down');
			})
		} else {
			$('.drop').slideDown(200, function() {
				$('.drop').addClass('down');
			});
		}
	});
})