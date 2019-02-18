function backToTop() {
	$('body').append('<div id="backToTop"><em class="mdi mdi-chevron-up"></em></div>')
	$('#backToTop').on('click', function () {
		$('body, html').animate({
			scrollTop: 0
		}, 500)
	})
}
$(document).ready(function () {
	backToTop()
})
