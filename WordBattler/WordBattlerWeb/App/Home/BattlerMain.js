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
/// <reference path="/ShowBattlePoint.js" />
/// <reference path="/WordBattle.js" />

(function () {
    "use strict";

    // 新しいページが読み込まれるたびに初期化関数を実行する必要があります
    Office.initialize = function (reason) {
        $(document).ready(function () {
            app.initialize();

            // プルダウンメニューを変更したときの処理
            var onCommandChanged = {
                // 遊び方
                "how-to-play": function () {
                        $('#content-header div h1').text('あそびかた');
                        howToPlay();
                },

                // ワードバトラーについて
                "about": function () {
                        $('#content-header div h1').text('ワードバトラーについて');
                        about();
                },

                // バトルポイント表示（メイン）画面
                "show-battle-point": function () {
                        showBattlePoints();
                },

                // ワードバトル
                "word-battle": function () {
                        wordBattle();
                        $('#content-header div h1').text('ワードバトル');
                },

                // ワードバトル
               "ranking": function () {
                        $('#content-header div h1').text('バトラーランキング');
                        battlerRanking();
                },

                // タイトル画面に戻る
                "title": function () {
                        backToTitle();
                }
            };

            // 文書名表示
            if (Office.context.document.url)
                $('#DocumentName').val(Office.context.document.url.substring(Office.context.document.url.lastIndexOf('\\') + 1));

            $('#command').change(function () {
               clearInterval(timer);
               clearTimeout(timeout);

               // ローディング画面を表示
               $('#canvas-main').empty().activity({ length: 0 });

               // コールバック関数を実行
               onCommandChanged[$('#command').val()]();
            });

            uploadWordDocument();
            howToPlay();
        });
    };

    // バトルポイント表示
    function showBattlePoints() {
        moveToMain();
    }

    // ワードバトル画面
    function howToPlay() {
        $('#canvas-main').load('HowToPlay.html #content-main div');
    }

    // ワードバトル画面
    function about() {
        $('#canvas-main').load('About.html #content-main div');
    }

    // バトラーランキング画面
    function battlerRanking() {
        $('#canvas-main').load('BattlerRanking.html #content-main div', function () {
            $('#result').activity({ length: 0 });
            $.ajax("/battlerinfoes/ranking", {
                type: 'get',
                datatype: 'json',
                cache: false
            }).done(onRankingUpdated);
        });
    }

    // タイトル画面に戻る
    function backToTitle() {
        // タイトル画面に戻る
        function moveToTitle() {
            window.location.href = "Title.html";
        }

        // 画面をロード
        $('#canvas-main').load('BackToTitle.html #content-main div', function () {
            $('#confirm-ok').click(moveToTitle);
            $('#confirm-cancel').click(function () {
                $('#command').val("show-battle-point");
                moveToMain();
            });
        });
    }
})();