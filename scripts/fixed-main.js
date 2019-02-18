function fixedMain() {
	let i = $('header').outerHeight()
	$('main').css({
		'padding-top': i
	})
}
$(document).ready(function () {
	fixedMain()
})
$(window).resize(function () {
	fixedMain()
})
$(window).on('scroll', function () {
	fixedMain()
})
