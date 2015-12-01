define(['bootstrap', 'autocompleteMediator'], function (news, AutocompleteMediator) {

    var autocompleteData;
    var autocomplete;

    require(['http://www.live.bbc.co.uk/indepthtoolkit/data-sets/how_did_my_mp_vote?callback=define'], function (data) {
        autocompleteData = data;
        autocomplete = new AutocompleteMediator(news.$('#mp-search--text-input'), updateButtonState, autocompleteData);
    });

    var $submitButton = news.$('.mp-search--submit');

    var updateButtonState = function () {
        if (autocomplete.getSelectedMp() !== null) {
            $submitButton.removeClass('disabled');
        }
        else {
            $submitButton.addClass('disabled');
        }
    }

    var getUserMp = function () {
        return autocomplete.getSelectedMp();
    }

    $submitButton.on('click', function () {
        console.log('getUserMp()', getUserMp());
        news.pubsub.emit('user-submitted-mp', [getUserMp()]);
    });

    // ###################################################################################################
    // The only code necessary for the iframe scaffold to WORK is below this line.
    // ###################################################################################################

    news.pubsub.emit('pageLoaded');
});
