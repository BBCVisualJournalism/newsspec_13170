define(['bootstrap', 'ShareTools'], function (news, ShareTools) {

    // ###################################################################################################
    // The following is example code and can/should be used where required.
    // ###################################################################################################

    news.hostPageSetup('' +
        'document.body.id = "hostPageCallbackWorks";' +
        'document.body.style.background = "lime";'
    );

    setTimeout(function () {
        news.pubsub.emit('istats', ['panel-clicked', 'newsspec-interaction', 3]);
    }, 500);
    setTimeout(function () {
        news.pubsub.emit('istats', ['quiz-end', 'newsspec-interaction', true]);
    }, 2000);

    var isInTheNewsApp = news.isInTheNewsApp();

    var sharetools = new ShareTools({
        label: 'Share this page',
        holderEl: $('.tempShareToolsHolder'),
        messages: {
            twitter: 'Custom message #BBCNewsGraphics',
            facebook: {
                title: 'Facebook share message',
                description: 'Further detailed information here', //Optional
                image: 'http://bbc.co.uk/some-image.png' //Optional
            },
            email: {
                subject: 'SUPER IMPORTANT EMAIL',
                message: 'BBC News has new bespoke'
            },
            app: {
                title: 'Shiny new app',
                text: 'Hello world'
            }
        },
        shareUrl: document.referrer,
        isInTheNewsApp: isInTheNewsApp,
        template: 'dropdown'
    });

    // Example: how to set the iframe to be a constant static height
    // news.setStaticIframeHeight(10000);

    // ###################################################################################################
    // The following code is used only to aid the integration tests, and should be removed in production.
    // ###################################################################################################

    news.$('.testIntegration').on('click', function () {
        news.$('.main').prepend('<div class="dynamic" style="background-color: red;display: block;height: 100px;width: 100%;color: white;padding-top: 40px;text-align: center;margin-top: 20px;">Dynamically added element</div>');
    });

    function printToScreen(className, label, value) {
        // display none so that imager.js cucumber features still pass. Otherwise long URL means image doesn't resize
        news.$('.main').append('<p style="display: none"><strong>' + label + ':</strong> <em class="' + className + '">' + value + '</em></p>');
    }

    function getQueryStringValue(queryString, key) {
        var regex       = new RegExp('(?:[\\?&]|&amp;)' + key + '=([^&#]*)'),
            results     = regex.exec(queryString);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    printToScreen('url__hash',                'Url Hash',       window.location.hash);
    printToScreen('url__params',              'Url Parameters', window.location.search);
    printToScreen('url__params--version',     'Version',        getQueryStringValue(window.location.search, 'v'));
    printToScreen('url__params--hostUrl',     'Host Url',       getQueryStringValue(window.location.search, 'hostUrl'));
    printToScreen('url__params--iframeUID',   'iFrame UID',     getQueryStringValue(window.location.search, 'iframeUID'));
    printToScreen('url__params--onbbcdomain', 'On BBC Domain?', getQueryStringValue(window.location.search, 'onbbcdomain'));

    // ###################################################################################################
    // The only code necessary for the iframe scaffold to WORK is below this line.
    // ###################################################################################################

    news.pubsub.emit('pageLoaded');
});
