window.calcMatchedMusics = function (musics, selectedTags, primaryTag) {
    var matchedMusics = _.filter(musics, function (music) {
        for (var i = 0; i < selectedTags.length; i++) {
            if (_.include(_.keys(music.tags), selectedTags[i]) === false) {
                return false;
            }
        }
        return true;
    });

    // 距離でソートする場合はこんな感じ
    // _.each(matchedMusics, function (music) {
    //     var dist = 0;
    //     _.each(music.tags, function (weight, tagName) {
    //         var selectedPosition = 0;
    //         var index = selectedTags.indexOf(tagName);
    //         if (index !== -1) {
    //             // 最初に選択したものは2、それ以降は1で
    //             // Math.pow(2, 1 / index)とかにすると 2, 1.4, 1.25, 1.18...という感じで1.0に漸近します
    //             selectedPosition = index === 0 ? 2 : 1.5;
    //         }
    //
    //         dist += Math.pow(selectedPosition - weight, 2);
    //     });
    //     music.distance = dist;
    // });
    // return _.sortBy(matchedMusics, 'score').reverse();

    _.each(matchedMusics, function (music) {
        var totalScore = 0;
        _.each(music.tags, function (weight, tagName) {
            var index = selectedTags.indexOf(tagName);
            if (index === -1) return; // 曲にあるけど選択してないタグの場合はスコアに影響を与えない

            // タグの強さ/選んだ順
            var score = weight / (index + 1);

            // 優先タグなら100倍（適当）
            if (primaryTag === tagName) score *= 100;

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
            },
            primaryTag: function (v) {
                console.log(v)
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
                return this.showResult ? "300x400_2.png" : "300x400.png";
            },

            onCancelClicked: function () {
                this.showResult = false;
                this.selectedTags = [];
            }
        }
    })
});