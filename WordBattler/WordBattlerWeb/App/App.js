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

/* 共通のアプリ機能 */

var app = (function () {

    var app = {};

    // (各ページから呼び出す) 共通の初期化関数
    app.initialize = function () {
        $('body').append(
            '<div id="notification-message">' +
                '<div class="padding">' +
                    '<div id="notification-message-close"></div>' +
                    '<div id="notification-message-header"></div>' +
                    '<div id="notification-message-body"></div>' +
                '</div>' +
            '</div>');

        $('#notification-message-close').click(function () {
            $('#notification-message').hide();
        });


        // 初期化後に、共通の通知関数を公開します
        app.showNotification = function (header, text) {
            $('#notification-message-header').text(header);
            $('#notification-message-body').html(text);
            $('#notification-message').slideDown('fast');
        };

        // ページ遷移時にロードアイコンを表示
        window.onbeforeunload = function (event) {
            $('#content-main').activity({ length: 0 });
        };

        // フォントのスムージングを無効化
        screen.fontSmoothingEnabled = false;
    };

    return app;
})();