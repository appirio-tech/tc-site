$(document).ready(function() {

    //multiple select configurations
    var config = {
        '.chosen-select': {},
        '.chosen-select-deselect': { allow_single_deselect: true },
        '.chosen-select-no-single': { disable_search_threshold: 10 },
        '.chosen-select-no-results': { no_results_text: 'Oops, nothing found!' },
        '.chosen-select-width': { width: "95%" }
    }
    for (var selector in config) {
        $(selector).chosen(config[selector]);
    }

    //set equal height to row contestGrid boxes
    var index = 0, minWidth = 1019, cols = $(window).width() > minWidth ? 3 : 1, rows = 0;
    $(".contestGrid .contest").each(function() {
        rows = Math.floor(index / cols) + 1;
        $(this).addClass("row" + Math.floor(index / cols));
        index++;
    });
    $('.tabviews a').off().on(ev, function(e) {
        if ($(this).hasClass('isActive')) {
            return false;
        }
        $('.viewTab').hide();
        id = $(this).attr('href');
        $(id).fadeIn('fast');
        $('.isActive', $(this).parent()).removeClass('isActive');
        $(this).addClass('isActive');

        if ($(this).hasClass('gridView') && $(window).width() > minWidth) {
            for (var i = 0; i < rows; i++) {
                var maxHeight = Math.max.apply(null, $(".contestGrid .contest.row" + i).map(function() {
                    return $(this).height();
                }).get());
                $(".contestGrid .contest.row" + i).height(maxHeight);
            }
        }
    });
});
