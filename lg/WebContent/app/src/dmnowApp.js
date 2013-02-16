/**
 * Main application script
 * used to load body of the app
 */

function random(from, to, precision)
{
    if (typeof from === 'number' && from % 1 == 0) {
        return Math.round(Math.random() * (to - from) + from);
    }
    if(typeof(precision) == 'undefined'){
        precision = 2;
    }
    return parseFloat(Math.min(from + (Math.random() * (to - from)),to).toFixed(precision));
}

/**
 * Storage for config and defaults
 */
var dmnowConfig = {
    app : {
        loader : {
            show : {
                minOpacity : 0.7,
                maxOpacity : 0.95
            },
            hide : {
                minOpacity : 0.1,
                maxOpacity : 0.4
            },
            minTimeout : 2000,
            maxTimeout : 5000
        }
    },
    network : {
        repeatTimeout : 15000,
        retriesCount : 5
    }
};

/**
 * Script for working with network
 */
var dmnowNetwork = {
    loadUrl : function (url, onSuccess, onError, retry) {
    	
        if (url.match(/\.css$/g) ) {
            var e = $("<link>", {
                rel  : "stylesheet",
                type : "text/css",
                href : url
            }).appendTo("head");
            var CSSload = function(link, callback) {
                var cssLoaded = false;
                try {
                    if ( link.sheet && link.sheet.cssRules.length > 0 ) {
                        cssLoaded = true;
                    } else if ( link.styleSheet && link.styleSheet.cssText.length > 0 ) {
                        cssLoaded = true;
                    } else if ( link.innerHTML && link.innerHTML.length > 0 ) {
                        cssLoaded = true;
                    }
                } catch(ex) {}
                if (cssLoaded) {
                    callback();
                } else {
                    setTimeout(function() {
                        CSSload(link, callback);
                    }, 50);
                }
            };
            CSSload(e.get(0), onSuccess);
        } else {
            $.getScript(url)
                .done(function () {
                    if ($.isFunction(onSuccess) ) {
                        onSuccess();
                    }
                }).error(function () {
                    if (retry == undefined) {
                        retry = 1;
                    } else {
                        retry++;
                    }
                    if (retry < dmnowConfig.network.retriesCount) {
                        setTimeout(function () {
                            dmnowNetwork.loadUrl(url, onSuccess, onError, retry);
                        }, dmnowConfig.network.repeatTimeout);
                    } else if ($.isFunction(onError) ) {
                        onError();
                    }
                });
        }
    },
    loadUrls : function (urls, onSuccess) {
        if (! urls.length) {
            if ($.isFunction(onSuccess)) {
                onSuccess();
            }
            return;
        }
        this.loadUrl(urls.shift(), function () {
            dmnowNetwork.loadUrls(urls, onSuccess);
        });
    },
    // Wait before image loaded
    loadBackgroundImage : function (e, onLoad) {
        var imageUrl = e.css('background-image')
            .replace(/(url\()|(\))|\'|"/g, '')
            .replace(/^.*?\/app\/image\//, 'app\/image\/');

        var img = $('<img>')
            .hide()
            .attr('src', imageUrl)
            .appendTo($('body'))
            .load(function () {
                img.remove();
                e.css('background-image', 'url(' + imageUrl + ')')
                onLoad();
            });
    },
    loadBackgroundImages : function (imageList, onLoad, onBackgroundImageLoad) {
        if (! imageList.length) {
            if ($.isFunction(onLoad)) {
                onLoad();
            }
            return;
        }
        this.loadBackgroundImage(imageList.shift(), function () {
            dmnowNetwork.loadBackgroundImages(imageList, onLoad, onBackgroundImageLoad);
        });
    }
};

/**
 * Main app
 */
var dmnowApp = {
    isLoading : false,
    init : function () {
        this.initInterface();
    },
    initInterface : function () {
        var e = $('<div></div>').attr('id', 'loader')
          .appendTo('body');
        var n = $('<div></div>').addClass('logo-under')
          .appendTo(e);
        var m = $('<div></div>').addClass('logo')
          .appendTo(e);
        
        dmnowNetwork.loadBackgroundImages([e,n,m], function() {

            tmhScreenTools.persistentAdaptiveFitToBox($('#loader'), window);
            tmhScreenTools.persistentPinupCenterBox($('#loader .logo-under'), window);
            tmhScreenTools.persistentPinupCenterBox($('#loader .logo'), window);

            dmnowApp.startLoading();
        });
    },
    startLoading : function () {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
    	
        function show() {
            var opacity = random(dmnowConfig.app.loader.show.minOpacity,
                dmnowConfig.app.loader.show.maxOpacity);
            var timeout = random(dmnowConfig.app.loader.minTimeout,
                dmnowConfig.app.loader.maxTimeout);

            $('#loader .logo-under').animate({
                opacity: opacity
            }, timeout, "swing", function () {
                hide();
            });
        }

        function hide() {
            var opacity = dmnowApp.isLoading ? random(dmnowConfig.app.loader.hide.minOpacity,
                dmnowConfig.app.loader.hide.maxOpacity) : 0;
            var timeout = random(dmnowConfig.app.loader.minTimeout,
                dmnowConfig.app.loader.maxTimeout);

            $('#loader .logo-under').animate({
                opacity: opacity
            }, timeout, "swing", function () {
                if (dmnowApp.isLoading == false) {
                    return;
                }
                show();
            });
        }

        show();
        $('#loader').show();

        this.loadClip();
    },
    stopLoading : function () {
        dmnowApp.isLoading = false;
    },
    loadClip : function () {
        dmnowNetwork.loadUrl(dmnowConfigLocal.domain + '/app/src/dmnowClip.js', function() {
            dmnowClip.init();
            dmnowClip.initDone = dmnowApp.stopLoading;
        });
    }
};

/**
 * Init script on load
 */
$(function () {
    dmnowApp.init();
});
