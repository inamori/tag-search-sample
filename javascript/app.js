window.calcMatchedMusics = function (musics, selectedTags, primaryTag) {
    var matchedMusics = _.filter(musics, function (music) {
        for (var i = 0; i < selectedTags.length; i++) {
            if (_.include(_.keys(music.tags), selectedTags[i]) === false) {
                return false;
            }
        }
        return true;
    });

    _.each(matchedMusics, function (music) {
        var totalScore = 0;
        _.each(music.tags, function (weight, tagName) {
            var index = selectedTags.indexOf(tagName);
            if (index === -1) return; // 曲にあるけど選択してないタグの場合はスコアに影響を与えない

            // タグの強さ/選んだ順
            var score = weight / (index + 1.5);

            // 優先タグなら1.15倍
            if (primaryTag === tagName) score *= 1.15;

            totalScore += score;
        });
        music.score = totalScore;
    });
    //スコアの場合大きい順(降順)になるので最後にreverse()します
    return _.sortBy(matchedMusics, 'score').reverse();
};

$(document).ready(function () {
    new Vue({
        el: '#app',
        template: '#app-template',
        data: function () {
            return {
                musics: [], tags: [], selectedTags: [], animationNum: 0, showResult: false,
                primaryTag: null
            }
        },
        computed: {
            matchedMusics: function () {
                return calcMatchedMusics(this.musics, this.selectedTags, this.primaryTag);
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
            $.get('./config.json?t='+(new Date()).getTime()).done(function (res) {
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
                    this.primaryTag = this.selectedTags[0];
                }
            },
            onResultClicked: function () {
                this.showResult = !this.showResult;
            },

            misakiImage: function () {
                return this.showResult ? "misaki2.png" : "misaki1.png";
            },

            onCancelClicked: function () {
                this.showResult = false;
                this.selectedTags = [];
            }
        }
    })
});