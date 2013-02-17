/**
 * Created with JetBrains PhpStorm.
 * User: Катерина
 * Date: 06.02.13
 * Time: 1:44
 * To change this template use File | Settings | File Templates.
 */

var tmhScreenTools = {
    fitToBox : function (e, box, preferOriginalSize) {
        e = $(e);

        if (box == undefined) {
            var box = $(window);
        } else {
            box = $(box);
        }

        var original = e.outerWidth() / e.outerHeight();
        var current  = box.outerWidth() / box.outerHeight();

        if (original > current) {
            if (preferOriginalSize !== true
                || e.outerWidth() > box.outerWidth()
            ) {
                var width = box.outerWidth();
                e.outerWidth(width)
                    .outerHeight(parseInt(width / original) );

                var width = box.outerWidth();
                e.outerWidth(width)
                    .outerHeight(parseInt(width / original) );
            }
        } else {
            if (preferOriginalSize !== true
                || e.outerHeight() > box.outerHeight()
            ) {
                var height = box.outerHeight();
                e.outerHeight(height)
                    .outerWidth(parseInt(height * original) );

                var height = box.outerHeight();
                e.outerHeight(height)
                    .outerWidth(parseInt(height * original) );
            }
        }
        e.css('background-position', 'center')
            .css('background-size', e.outerWidth() + 'px ' + e.outerHeight() + 'px')
            .css('top', parseInt((box.outerHeight() - e.outerHeight()) / 2) + 'px')
            .css('left', parseInt((box.outerWidth() - e.outerWidth()) / 2) + 'px');
    },
    adaptiveFitToBox : function (e, box, preferOriginalSize) {
        e = $(e);

        if (box == undefined) {
            var box = $(window);
        } else {
            box = $(box);
        }

        if (! e.attr('data-original')) {
            e.attr('data-original', e.outerWidth() / e.outerHeight())
                .attr('data-original-width', e.outerWidth())
                .attr('data-original-height', e.outerHeight());
        }

        var original = e.attr('data-original');
        var current  = box.outerWidth() / box.outerHeight();

        if (original < current) {
            var width  = box.outerWidth();
            var height = parseInt(width / original);

            if (preferOriginalSize !== true
                || e.attr('data-original-width') < box.outerWidth() ) {
                e.css('background-size', width + 'px ' + height + 'px');
            } else {
                e.css('background-size', e.attr('data-original-width') + 'px ' +
                    e.attr('data-original-height') + 'px');
            }
            //.css('background-position', '0 ' + (- parseInt((height - box.outerHeight() ) / 2)) + 'px')

            e.css('background-position', 'center')
                .outerWidth(width)
                .outerHeight(box.outerHeight());

        } else {
            var height = box.outerHeight();
            var width  = parseInt(height * original);

            if (preferOriginalSize !== true
                || e.attr('data-original-height') < box.outerHeight() ) {
                //e.css('background-position', (- parseInt((width - box.outerWidth() ) / 2)) + 'px 0')
                e.css('background-size', width + 'px ' + height + 'px');
            } else {
                e.css('background-size', e.attr('data-original-width') + 'px ' +
                    e.attr('data-original-height') + 'px');
            }
            e.css('background-position', 'center')
                .outerWidth(box.outerWidth())
                .outerHeight(height);
        }
    },
    pinupCenterBox : function (e, box) {
        e = $(e);

        if (box == undefined) {
            var box = $(window);
        } else {
            box = $(box);
        }
        e.css('top', parseInt((box.outerHeight() - e.outerHeight()) / 2) )
            .css('left', parseInt((box.outerWidth() - e.outerWidth()) / 2) );
    },
    expandToBox : function (e, box) {
        e = $(e);

        if (box == undefined) {
            var box = $(window);
        } else {
            box = $(box);
        }

        e.width(box.outerWidth() - e.css('padding-left').replace('px', '')
            - e.css('padding-right').replace('px', '') )
         .height(box.outerHeight() - e.css('padding-top').replace('px', '')
            - e.css('padding-bottom').replace('px', '') );
    },
    persistentFitToBox : function (e, box, preferOriginalSize) {
        $(window).resize(function () {
            tmhScreenTools.fitToBox(e, box, preferOriginalSize);
        });
        tmhScreenTools.fitToBox(e, box, preferOriginalSize);
    },
    persistentAdaptiveFitToBox : function (e, box, preferOriginalSize) {
        $(window).resize(function () {
            tmhScreenTools.adaptiveFitToBox(e, box, preferOriginalSize);
        });
        tmhScreenTools.adaptiveFitToBox(e, box, preferOriginalSize);
    },
    persistentPinupCenterBox : function (e, box) {
        $(window).resize(function () {
            tmhScreenTools.pinupCenterBox(e, box);
        });
        tmhScreenTools.pinupCenterBox(e, box);
    },
    persistentExpandToBox : function (e, box) {
        $(window).resize(function () {
            tmhScreenTools.expandToBox(e, box);
        });
        tmhScreenTools.expandToBox(e, box);
    },
}