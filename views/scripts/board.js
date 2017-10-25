$(function(){
	$('.like').on('click', function(){
		if ($(this).hasClass('liked')) {
			$(this).removeClass('fa-thumbs-up');
			$(this).addClass('fa-thumbs-o-up');
			$(this).removeClass('liked');
		} else {
			$(this).removeClass('fa-thumbs-o-up');
			$(this).addClass('fa-thumbs-up');
			$(this).addClass('liked');	
		}
	})
	$('.dislike').on('click', function(){
		if ($(this).hasClass('liked')) {
			$(this).removeClass('fa-thumbs-down');
			$(this).addClass('fa-thumbs-o-down');
			$(this).removeClass('liked');
		} else {
			$(this).removeClass('fa-thumbs-o-down');
			$(this).addClass('fa-thumbs-down');
			$(this).addClass('liked');
		}
	})



	$('.PostedImg').on('click', function(){
		let img = $(this).attr('src');
		$('.full').removeClass('d-none');
		$('.imgInModal').attr('src', img);
	})
	$('.full').on('click', function(){
		if ( $('.full').hasClass('d-none') ) {

		} else {
			$('.full').addClass('d-none');
		}
	})


	$('.like').on('click', function() {
		let postId = $(this).attr('data-id');

		$.ajax({
			type: 'POST',
			url: '/addLike/' + postId,
			success: function(data) {
				console.log(data);
			}
		})
	})
	$('.dislike').on('click', function() {
		let postId = $(this).attr('data-id');

		$.ajax({
			type: 'POST',
			url: '/addDislike/' + postId,
			success: function(data) {
				console.log(data);
			}
		})
	})
})