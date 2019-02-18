function mapListener() {
	$('[mapListener]').each(function () {
		let mapPoint = $(this).attr('mapPoint')
		var mapTo = $(this).attr('mapListener')
		if (mapPoint && mapPoint.length > 0) {
			if ($(window).width() < mapPoint) {
				$(this).appendTo(mapTo);
				// $(this).removeAttr('mapListener')
			}
		} else {
			if ($(window).width() < 992) {
				$(this).appendTo(mapTo);
				// $(this).removeAttr('mapListener')
			}
		}

	})


}
$(document).ready(function () {
	mapListener()
})
$(window).resize(function () {
	mapListener()
})
