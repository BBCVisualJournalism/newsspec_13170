define(['bootstrap', 'autocompleteMediator', 'http://www.stage.bbc.co.uk/indepthtoolkit/data-sets/how_did_my_mp_vote/jsonp'], function (news, AutocompleteMediator, autocompleteData) {

    var $searchForm = news.$('.mpSearch_form');
    var $searchInput = news.$('#mpSearch_form_input');

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

    var hideResult = function () {
        $result.hide();
    };

    var showResult = function () {
        $result.show();
    };

    var onMpSelect = function () {
        $searchInput.trigger('blur');
        $searchForm.trigger('submit');
    };

    var autocomplete = new AutocompleteMediator($searchInput, onMpSelect, autocompleteData);

    $searchInput.on('focus', function () {
        var $this = $(this);
        if ($this.val() !== '') {
            $this.val('');
            hideResult();
        }
    });

    $searchForm.on('submit', function () {
        if ($searchInput.val() === $searchInput.attr('placeholder')) {
            $searchInput.val('');
        }

        var userMp = getUserMp();
        if (userMp) {
            news.pubsub.emit('user-submitted-mp', [userMp]);

            news.pubsub.emit('istats', ['mp-submitted', 'newsspec-interaction', true]);
            var istats_mpname = 'mp-submitted_' + userMp.data.mp_name.replace(/\s+/g, '-').toLowerCase();
            news.pubsub.emit('istats', [istats_mpname, 'newsspec-interaction', true]);
        }
        return false;
    });

    news.pubsub.on('user-submitted-mp', function (mp) {
        if (mp) {
            showResult();
            $resultVote.text(mp.data.vote_outcome);

            var resultHtmlString = '<p>' + mp.data.mp_name + ' (' + mp.data.party + ', ' + mp.data.constituency_name + ')';
            if (mp.data.vote_outcome.toLowerCase() === 'abstained') {
                resultHtmlString += ' abstained from voting.';
            } else if (mp.data.vote_outcome.toLowerCase() === 'did not vote') {
                resultHtmlString += ' did not vote.';
            } else {
                resultHtmlString += ' voted ' + mp.data.vote_outcome.toLowerCase() + ' the motion.';
            }
            resultHtmlString += '</p>';
            $resultText.html(resultHtmlString);
        }
    });

    news.pubsub.emit('pageLoaded');
});
