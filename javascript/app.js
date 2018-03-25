window.calcMatchedMusics = function (musics, selectedTags) {
    return _.filter(musics, function (music) {
        for (var i = 0; i < selectedTags.length; i++) {
            if (music.tags.indexOf(selectedTags[i]) === -1) return false;
        }
        return true;
    });
};

$(document).ready(function () {
    new Vue({
        el: '#app',
        template: '#app-template',
        data: function () {
            return { musics: [], tags: [], selectedTags: [], animationNum: 0, showResult: false }
        },
        computed: {
            matchedMusics: function () {
                return calcMatchedMusics(this.musics, this.selectedTags);
            }
        },
        watch: {
            selectedTags: function (val) {
                this.selectedTags = val;
                var self = this;
                var current = this.matchedMusics.length;
                $({count: this.animationNum}).animate({count: current}, {
                    duration: 400,
                    easing: 'linear',
                    progress: function() {
                        self.animationNum = Math.round(this.count);
                    }
                });
            }
        },
        created: function () {
            var self = this;
            $.get('./sample.json').done(function (res) {
                self.tags = res.tags;
                self.musics = res.musics;
                self.animationNum = self.musics.length;
            })
        },
        methods: {
            onTagClicked: function (tagName) {
                if (_.include(this.selectedTags, tagName)) {
                    this.selectedTags = _.without(this.selectedTags, tagName);
                } else {
                    this.selectedTags.push(tagName);
                    this.selectedTags = _.uniq(this.selectedTags);
                }
            },
            onResultClicked: function () {
                this.showResult = !this.showResult;
            },
            onCancelClicked: function () {
                this.showResult = false;
                this.selectedTags = [];
            }
        }
    })
});