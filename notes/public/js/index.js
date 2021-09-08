$(function() {
    var banner = $('.main .main-bg');
    var title = $('.main .title');
    var arr = ["images/banner_01.jpg", "images/banner_02.jpg", "images/banner_03.jpg"];
    var titles = ["所谓空白，其实是无限的可能", "你会从这里看到“她”的美", "在这里策马奔腾，不受拘束"];
    var current = 0;
    var imgs;
    if (banner.length > 0) {
        for (var i = 0; i < arr.length; i++) {
            if (banner.html().indexOf(arr[i]) < 0) {
                banner.append('<img style="display:none;" src="' +
                    arr[i] + '"/>');
                title.after('<p class="title text-center" style="display:none;">' + titles[i] + '</p>');
            }
        }
        imgs = banner.find('img');
        // console.log(imgs.length);
        if (imgs.length > 1) {
            setInterval(function() {
                current++;
                current = current < imgs.length ? current : 0;
                $(imgs).filter(':visible').fadeOut(1000).parent().find('img:eq(' + current + ')')
                    .fadeIn(1500).parent().next().find('.title').filter(':visible')
                    .fadeOut(1000).parent().find('p.title:eq(' + current + ')').fadeIn(1500);
            }, 3000);
        }
    }
});