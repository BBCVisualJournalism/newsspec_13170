define(['bootstrap', 'lib/vendors/autocomplete'], function (news) {
    var AutocompleteMediator = function ($inputElement, onMpChange, mpData) {
        this.$autocompleteInput = $inputElement;
        this.onMpChange = onMpChange;
        this.autocompleteSelectedMp = null;
        this.istatsSent = false;
        this.$searchSubmit = news.$('.mpSearch_form_submit');

        this.mpData = mpData;
        
        this.setupAutocomplete();
        
    };

    AutocompleteMediator.prototype = {
        setupAutocomplete: function () {
            var mpAutocomplete = this;

            this.$autocompleteInput.autocomplete({
                lookup: this.getAutocompleteData(),
                lookupLimit: 20,
                autoSelectFirst: true,
                onSelect: function (suggestion) {
                    if (suggestion.mp !== mpAutocomplete.autocompleteSelectedMp) {
                        mpAutocomplete.autocompleteSelectedMp = suggestion.mp;
                        if (mpAutocomplete.onMpChange) {
                            mpAutocomplete.onMpChange(suggestion.mp);
                        }
                    }

                    mpAutocomplete.$searchSubmit.removeClass('mpSearch_form_submit-disabled').removeAttr('disabled');
                },
                lookupFilter: function (suggestion, originalQuery, queryLowerCase) {
                    if (suggestion.value.toLowerCase().indexOf(queryLowerCase) !== -1) {
                        return true;
                    }

                    mpAutocomplete.logiStats();
                },
                onInvalidateSelection: function () {
                    mpAutocomplete.autocompleteSelectedMp = null;
                    if (mpAutocomplete.onMpChange) {
                        mpAutocomplete.onMpChange();
                    }
                }

            });
        },
        getAutocompleteData: function () {
            // console.log('this.mpData = ', this.mpData);
            var autocompleteObject = [];
            for (var mpKey in this.mpData) {
                autocompleteObject.push({
                    value: mpKey,
                    mp: {
                        key: mpKey,
                        data: this.mpData[mpKey]
                    }
                });
            }
            return autocompleteObject;
        },
        getSelectedMp: function () {
            return this.autocompleteSelectedMp;
        },
        logiStats: function () {
            if (this.istatsSent === false) {
                var searchType = (this.$autocompleteInput.selector === '#mp-search--text-input') ? 'initial-search' : 'animate-table-search';
                news.pubsub.emit('istats', ['autocomplete-used', searchType]);

                this.istatsSent = true;
            }
        }
    };

    return AutocompleteMediator;
});