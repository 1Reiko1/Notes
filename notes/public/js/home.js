$(function() {
    var email = localStorage.userName;
    $('#nickname_display').html(email);
    // 载入最新笔记
    viewNotes();
});
//保存笔记
function saveNote() {
    var _subject = $.trim($("#subject").val());
    var noteContents = $.trim($("#text").val());
    if (noteContents == '' || _subject == '') {
        alert('标题和内容必须都不为空！');
        return false;
    }
    $.ajax({
        type: 'post',
        url: 'http://localhost:3000/noteinfo',
        dataType: 'json',
        data: {
            useremail: localStorage.userName,
            title: _subject,
            contents: noteContents,
        },
        success: function(data) {
            if (data.code == 'ok') {
                console.log('笔记保存success');
            }
            console.log('111111111111');
            viewNotes();
            $("#subject").val("");
            $("#text").val("");
        },
        error: function(data) {
            if (data.code == 'no') {
                alert('笔记保存失败');
            }
            console.log(data);
        }
    });
}

// 显示笔记列表
function viewNotes() {
    var table = document.getElementById("mytable");
    var tbody = table.tBodies[0];
    tbody.innerHTML = '';
    tbody.innerHTML += "<tr><td id='_id'></td><td></td><td></td><td><a href='javascript:;' onclick='deleteNote(this);'>删除</a>&nbsp;<a href='javascript:;' onclick='ModNote(this);'>修改</a></td></tr>"
    $.ajax({
        type: "get",
        url: "http://localhost:3000/getNotes",
        dataType: 'json',
        data: {
            useremail: localStorage.userName
        },
        success: function(data) {
            console.log('传过来了');
            var d = data[0];
            var t = '';
            //console.log(d.content[0], d.content.length);
            for (var i = 0; i < d.content.length - 1; i++) {
                var tr = $($('#notes_lately tbody tr')[0]);
                var ctr = tr.clone(true);
                tr.after(ctr);
            }
            var td = $('#notes_lately tbody tr td');
            for (var i = 0; i < d.content.length; i++) {
                $($($('tbody tr')[i]).children(td)[0]).html(d.content[i]._id);
                $($($('tbody tr')[i]).children(td)[1]).html(d.content[i].title);
                $($($('tbody tr')[i]).children(td)[2]).html(d.content[i].contents);
            }
            console.log('success');
        },
        error: function(data) {
            console.log(data);
        }
    });
}

//修改笔记
function ModNote(obj) {
    var _subject = $.trim($("#subject").val());
    var noteContents = $.trim($("#text").val());
    if (noteContents == '' || _subject == '') {
        alert('标题和内容必须都不为空！才能进行修改');
        return false;
    }
    var i = obj.parentNode.parentNode.rowIndex;
    var noteid = $($($('tbody tr')[i - 1]).children('td')[0]).html();
    //console.log(noteid);
    $.ajax({
        type: 'put',
        url: 'http://localhost:3000/ModNotes',
        dataType: 'json',
        data: {
            useremail: localStorage.userName,
            title: _subject,
            contents: noteContents,
            id: noteid
        },
        success: function(data) {
            if (data.code == 'ok') {
                console.log('笔记修改success');
            }
            console.log('111111111111');
            viewNotes();
        },
        error: function(data) {
            console.log('修改error');
            if (data.code == 'no') {
                console.log('修改error');
                alert('修改失败');
            }
        }
    })
}
//删除笔记
function deleteNote(obj) {
    var i = obj.parentNode.parentNode.rowIndex;
    var noteid = $($($('tbody tr')[i - 1]).children('td')[0]).html();
    //console.log(noteid);
    $.ajax({
        type: 'delete',
        url: 'http://localhost:3000/delNotes',
        dataType: 'json',
        data: {
            useremail: localStorage.userName,
            id: noteid
        },
        success: function(data) {
            console.log('删除成功');
        },
        error: function(data) {
            console.log('删除失败');
        }
    })
    $(obj).parents('tr').remove();
}
//退出
function logout() {
    console.log('localStorage.userName')
    localStorage.clear();
    console.log(localStorage.userName)
}