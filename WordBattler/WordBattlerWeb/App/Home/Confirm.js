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

            $('#confirm-ok').click(confirmOK);
            $('#confirm-cancel').click(confirmCancel);
        });
    };

    // アプリ起動確認メッセージを表示する
    function confirmOK() {
        window.location.href = "Title.html";
    }

    // キャンセル押下時
    function confirmCancel() {
        $("#content-main div").text("アプリを終了してください");
        $("#content-footer").empty();
    }
})();
