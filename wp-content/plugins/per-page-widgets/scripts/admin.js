jQuery(function($) {
    /**
     * unfuck thickbox to use full page width to edit widgets
     */
    var tb_position_old = tb_position;
    tb_position = function() {
        if ($('#TB_window').hasClass('i123_widgets')) {
            var tbWindow = $('#TB_window');
            var width = $(window).width();
            var T = $("#wpcontent").offset().top;
            var H = $(window).height() - T;
            var W = ( 1720 < width ) ? 1720 : width;

            if ( tbWindow.size() ) {
                    tbWindow.width( W - 50 ).height( H - 75 );
                    $('#TB_iframeContent').width( W - 50 ).height( H - 80 );
                    tbWindow.css({'margin-left': '-' + parseInt((( W - 50 ) / 2),10) + 'px'});
                    if ( typeof document.body.style.maxWidth != 'undefined' )
                            tbWindow.css({'top': (T + 25) + 'px','margin-top':'0'});
            };

            return $('a.sidebareditlink').each( function() {
                    var href = $(this).attr('href');
                    if ( ! href ) return;
                    href = href.replace(/&width=[0-9]+/g, '');
                    href = href.replace(/&height=[0-9]+/g, '');
                    $(this).attr( 'href', href + '&width=' + ( W - 80 ) + '&height=' + ( H - 85 ) );
            });
        } else {
            tb_position_old();
        }
    };
    $(window).resize( function() {tb_position();});

    $('a.sidebareditlink').click(function(){
        add_i123_widget_class();
    });

    function add_i123_widget_class() {
        var tbWindow = $('#TB_window');
        if ( tbWindow.length==1) {
            tbWindow.addClass("i123_widgets");
            tb_position();
        } else {
            setTimeout(function(){
                add_i123_widget_class();
            }, 200);
        }
    }

    $('.i123_widgets_formlineleftside input[type=radio]').change(function(){
        basename = $(this).attr('name');
        selectedval = ($('#' + basename + '-2').is(':checked')) ? 'block' : 'none';
        $('#' + basename + '_edit').css({'display':selectedval});
        selectedval = ($('#' + basename + '-1').is(':checked')) ? 'inline' : 'none';
        $('#' + basename + '_edit_default').css({'display':selectedval});
    }).trigger('change');
    $('#i123_widgets_overall_setting').change(function(){
        display = ($(this).val()==1) ? 'block' : 'none';
        $("#i123_widgets_special_settings").css({'display':display});
    }).trigger('change');
});
