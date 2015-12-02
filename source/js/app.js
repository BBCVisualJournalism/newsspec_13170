define(['bootstrap', 'autocompleteMediator', 'http://www.live.bbc.co.uk/indepthtoolkit/data-sets/how_did_my_mp_vote?callback=define'], function (news, AutocompleteMediator, autocompleteData) {

    var $searchForm = news.$('.mpSearch_form');
    var $searchInput = news.$('#mpSearch_form_input');
    var $searchSubmit = news.$('.mpSearch_form_submit');
    var $resultVote = news.$('.mpSearch_result_vote');
    var $resultText = news.$('.mpSearch_result_text');

    var getUserMp = function () {
        return autocomplete.getSelectedMp();
    };

    var disableButton = function ($button) {
        $button.addClass('disabled').attr('disabled', 'disabled');
    };

    var enableButton = function ($button) {
        $button.removeClass('disabled').removeAttr('disabled');
    };

    var updateButtonState = function () {
        if (getUserMp() !== null) {
            enableButton($searchSubmit);
        }
        else {
            disableButton($searchSubmit);
        }
    };

    var autocomplete = new AutocompleteMediator($searchInput, updateButtonState, autocompleteData);

    $searchForm.on('submit', function () {
        news.pubsub.emit('user-submitted-mp', [getUserMp()]);
        return false;
    });

    news.pubsub.on('user-submitted-mp', function (mp) {
        // console.log('user-submitted-mp', mp);
        $resultVote.text(mp.data.vote_outcome);
        var resultTextString = mp.data.mp_name + ' (' + mp.data.party + ') - ' + mp.data.constituency_name + ' voted ' + mp.data.vote_outcome.toLowerCase() + ' the motion.';
        $resultText.text(resultTextString);
    });

    news.pubsub.emit('pageLoaded');
});
