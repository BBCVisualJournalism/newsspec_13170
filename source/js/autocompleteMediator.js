define(['bootstrap', 'lib/vendors/autocomplete'], function (news) {
    var AutocompleteMediator = function ($inputElement, onMpChange, mpData) {
        this.$autocompleteInput = $inputElement;
        this.onMpChange = onMpChange;
        this.autocompleteSelectedMp = null;
        this.istatsSent = false;
        this.$submitButton = news.$('.mp-search--submit');

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

                    mpAutocomplete.$submitButton.removeClass('disabled');   
                    
                    if (!news.$('#mp-search--text-input').is(':focus')) {
                        news.$('#mp-search--text-input').focus();
                    }

                    // mpAutocomplete.$submitButton.trigger("click");

                },
                lookupFilter: function (suggestion, originalQuery, queryLowerCase) {
                    if (suggestion.value.toLowerCase().indexOf(queryLowerCase) !== -1) {
                        return true;
                    }

                    mpAutocomplete.logiStats();

                    // if (suggestion.mp.search_alternative) {
                    //     var a, arrLength = suggestion.mp.search_alternative.length, returnedVal = false;
                    //     for (a = 0; a < arrLength; a++) {
                    //         if (suggestion.mp.search_alternative[a].toLowerCase().indexOf(queryLowerCase) !== -1) {
                    //             returnedVal = (suggestion.mp.search_alternative[a].toLowerCase().indexOf(queryLowerCase) !== -1);
                    //         }
                    //     }
                    //     return returnedVal;
                    // }
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
            console.log('this.mpData = ', this.mpData);
            var autocompleteObject = [];
            for (mpKey in this.mpData) {
                autocompleteObject.push({
                    // value: mpKey,
                    value: mpKey,
                    mp: {
                        mpName: mpKey,
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