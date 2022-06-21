/*
    Copyright (c) 2014 Yumi Ninomiya

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

/// <reference path="../App.js" />

(function () {
    "use strict";

    // 新しいページが読み込まれるたびに初期化関数を実行する必要があります
    Office.initialize = function (reason) {
        $(document).ready(function () {
            app.initialize();
            $('#Back').click(backToTitle);

            // マウスオーバー表示
            $('p,label').hover(function () {
                $('#content-footer div').text($(this).attr('data-description'));
            }, function () {
                $('#content-footer div').text('');
            });

            // ページ遷移時にロードアイコンを表示
            $('form').submit(function (event) {
                event.preventDefault();
                $(this).activity({ length: 0 });

                $.ajax($(this).attr('action'), {
                    type: $(this).attr('method'),
                    datatype: 'json',
                    cache: false,
                    data: $(this).serialize()
                }).done(function (data) {
                    if (data === 'Succeeded')
                        window.location.href = "../App/Home/BattlerMain.html";
                    else {
                        $('form').activity(false);
                        app.showNotification('エラー', data);
                    }
                }).fail(function (data) {
                    $('form').activity(false);
                    app.showNotification('エラー', 'データの送信に失敗しました。<br />しばらく待ったあと、再度送信してください。');
                });
            });
        });
    };
    
    // タイトル画面に戻る
    function backToTitle() {
        app.showNotification("",'タイトル画面へ戻りますか？ <br /><input type="button" id="confirm-ok" value="ＯＫ" /> <input type="button" id="confirm-cancel" value="キャンセル" />');
        $('#confirm-ok').click(function () {
            window.location.href = "../App/Home/Title.html";
        });
        $('#confirm-cancel').click(function () {
            $('#notification-message').hide();
        });
    }
})();