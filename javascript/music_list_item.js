Vue.component('music-list-item', {
    props: ['music'],
    data: function() {
        return { iframeSrc: null };
    },
    template:
        '<tr class="music-list">' +
            '<td><iframe :src="music.itunes"/></td>' +
            '<slot></slot>' +
        '</tr>',
    watch: {
        music: function () {
           // 曲が変わったのでiframeをアンロード
           this.iframeSrc = '';
        }
    },
    mounted: function () {
        var self = this;
        setInterval(function () {
            if (self.iframeSrc) {
                return;
            }
            if (self.$el.getBoundingClientRect().top < window.innerHeight) {
                self.iframeSrc = self.music.itunes;
            }
        }, 1);
    }
});