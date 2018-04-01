Vue.component('tag-button', {
    props: ['tagName', 'musics', 'selectedTags'],
    data: function() {
        return {disabled: false};
    },
    template:
        '<div class="col-md-3 tag-column">' +
            '<button ref="button" @click="onClicked" class="btn tag-button" :class="classObject" :disabled="isDisabled">' +
                '<span v-show="selected">{{priority}}. </span>' +
                '{{tagName}}' +
                '<span v-show="!selected && ifThisTagSelected > 0">({{ifThisTagSelected}}曲)</span>' +
            '</button>' +
        '</div>',
    methods: {
        onClicked: function () {
            this.$emit('tag-clicked', this.tagName);
        }
    },
    computed: {
        selected: function () {
            return _.include(this.selectedTags, this.tagName);
        },
        priority: function () {
            return this.selectedTags.indexOf(this.tagName) + 1;
        },
        classObject: function () {
            return {
                'btn-primary': !this.isDisabled && !this.selected,
                'btn-success': !this.isDisabled && this.selected,
                'btn-secondary': this.isDisabled
            }
        },
        ifThisTagSelected: function () {
            // このタグが選択された場合の残り曲数を返す
            var tmp = this.selectedTags.concat([]);
            tmp.push(this.tagName);
            return calcMatchedMusics(this.musics, tmp).length;
        },
        isDisabled: function () {
            return this.ifThisTagSelected === 0;
        }
    }
});