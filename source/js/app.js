define(['bootstrap', 'autocompleteMediator', 'http://www.live.bbc.co.uk/indepthtoolkit/data-sets/how_did_my_mp_vote?callback=define'], function (news, AutocompleteMediator, autocompleteData) {

    var $searchForm = news.$('.mpSearch_form');
    var $searchInput = news.$('#mpSearch_form_input');
    var $searchSubmit = news.$('.mpSearch_form_submit');

    var $result = news.$('.mpSearch_result');
    var $resultVote = news.$('.mpSearch_result_vote');
    var $resultText = news.$('.mpSearch_result_text');

    var getUserMp = function () {
        return autocomplete.getSelectedMp();
    };

    var disableButton = function ($button) {
        $button.addClass('mpSearch_form_submit-disabled').attr('disabled', 'disabled');
    };

    var enableButton = function ($button) {
        $button.removeClass('mpSearch_form_submit-disabled').removeAttr('disabled');
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
        $result.show();
        $resultVote.text(mp.data.vote_outcome);

        var resultHtmlString = '<p>' + mp.data.mp_name + ' (' + mp.data.party + ', ' + mp.data.constituency_name + ')';
        if (mp.data.vote_outcome.toLowerCase() === 'abstained') {
            resultHtmlString += ' abstained from voting.</p>';
        } else {
            resultHtmlString += ' voted ' + mp.data.vote_outcome.toLowerCase() + ' the motion.</p>';
        }
        $resultText.html(resultHtmlString);
    });

    news.pubsub.emit('pageLoaded');
});
