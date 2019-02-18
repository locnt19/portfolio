function headerActive() {
	let i = $('header').height()
	if ($(window).scrollTop() > i) {
		$('header').addClass('active')
	} else {
		$('header').removeClass('active')
	}
}
$(document).ready(function () {
	$('header').addClass('fixed-header')
	headerActive()
})
$(window).resize(function () {
	headerActive()
})
$(document).on('scroll', function () {
	headerActive()
})
