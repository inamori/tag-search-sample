$(function() {
    var topBtn = $('#pagetop');    
    topBtn.hide();
    //スクロールが50に達したらボタン表示
    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            topBtn.fadeIn();
        } else {
            topBtn.fadeOut();
        }
    });
    //スクロールしてトップ
    topBtn.click(function () {
        $('body,html').animate({
            scrollTop: 0
        }, 500);
        document.getElementById("misaki").src = "majin2b.png";
        return false;
    });
});