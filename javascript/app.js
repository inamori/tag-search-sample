window.calcMatchedMusics = function (musics, selectedTags) {
    return _.filter(musics, function (music) {
        for (var i = 0; i < selectedTags.length; i++) {
            if (_.include(music.tags, selectedTags[i]) === false) return false;
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
                // 選択タグが変わったら結果数をアニメーションさせる
                this.selectedTags = val;
                var self = this;
                var current = this.matchedMusics.length;
                $({count: this.animationNum}).animate({count: current}, {
                    duration: 300,
                    progress: function() {
                        self.animationNum = Math.round(this.count);
                    }
                });
            }
        },
        created: function () {
            var self = this;
            //　設定ファイルを読み込んで初期化
            $.get('./config.json').done(function (res) {
                self.tags = res.tags;
                self.musics = res.musics;
                self.animationNum = self.musics.length;
            })
        },
        methods: {
            onTagClicked: function (tagName) {
                if (_.include(this.selectedTags, tagName)) {
                    // 選択解除
                    this.selectedTags = _.without(this.selectedTags, tagName);
                } else {
                    // 選択
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