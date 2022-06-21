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

    // 共通の変数
    var battleCommon = new Object();
    battleCommon.player = {
        BattlePointSum: 0,
        Regular: {
            Attack: 0,
            Defense: 0,
            Speed: 0,
            Luck: 0
        },
        Hidden: {
            Attack: 0,
            Defense: 0,
            Speed: 0,
            Luck: 0
        }
    };
    var timer, timeout;

    // キャラクター画像一覧
    var CHARACTER_IMG = {
        'クラウディア': "../../images/クラウディアSD3.jpg",
        'ちーたん': "../../images/ちーたん.png",
        '琴葉　茜・葵': "../../images/横向き_茜葵.png",
        '？？？': "../../images/iruka.png"
    };

    // キャラクター画像一覧
    var CHARACTER_IMG_WIN = {
        'クラウディア': "../../images/クラウディアSD4.jpg",
        'ちーたん': "../../images/ちーたん勝.png",
        '琴葉　茜・葵': "../../images/横向き_茜葵.png",
        '？？？': "../../images/iruka.png"
    };

    // キャラクター画像一覧
    var CHARACTER_IMG_LOSE = {
        'クラウディア': "../../images/クラウディアSD2.jpg",
        'ちーたん': "../../images/ちーたん敗.png",
        '琴葉　茜・葵': "../../images/横向き_茜葵.png",
        '？？？': "../../images/iruka.png"
    };

    // Wordドキュメントをアップロード
    function uploadWordDocument() {
        getWordDocument(function (docView) {
            var formData = new FormData();
            formData.append("xml", new Blob([docView]));

            $.ajax("/BattlerInfoes/CalcBattlePoint", {
                type: 'post',
                data: formData,
                contentType: false,
                datatype: 'json',
                cache: false,
                processData: false
            }).done(function (data) {
                if (Office.context.document.url)
                    $('#doc-name').text('「' + Office.context.document.url.substring(Office.context.document.url.lastIndexOf('\\') + 1) + '」のバトルポイントは');
                battleCommon.player = data;
                battleCommon.player.BattlePointSum = data.Regular.Attack +
                    data.Regular.Defense +
                    data.Regular.Speed +
                    data.Regular.Luck;

                $('.attack').text(data.Regular.Attack);
                $('.defense').text(data.Regular.Defense);
                $('.speed').text(data.Regular.Speed);
                $('.luck').text(data.Regular.Luck);
                $('.sum').text(battleCommon.player.BattlePointSum);
                $("#image-player").attr("src", CHARACTER_IMG[battleCommon.player.BattlerAccountInfo.Character])
            });
        });
    }

    // Wordのドキュメントを取得してコールバック関数に渡す
    function getDocument(docType, triggeredFunc) {
        var docResult = new Array(0);
        Office.context.document.getFileAsync(docType, function (result) {
            var slices = 1;

            for (var i = 0; i < slices; i++)
                result.value.getSliceAsync(i, function (result) {
                    docResult = docResult.concat(result.value.data);

                    if (slices == i) { // Means it's done traversing...
                        triggeredFunc(docResult);
                    }
                });

            result.value.closeAsync();
        });

    }

    // Wordドキュメントが更新されたかどうかを確認
    var oldDoc = "";
    function checkDocumentUpdated(triggeredFunc) {
        getDocument(Office.FileType.Text, function (newDoc) { // Means it's done traversing...
            if (oldDoc != newDoc.toString()) {
                oldDoc = newDoc.toString();
                triggeredFunc();
            }
        });
    }

    // ワードのバイト列を取得して送信
    function getWordDocument(sendCompleteMethod) {
        getDocument(Office.FileType.Compressed, function (doc) { // Means it's done traversing...
            sendCompleteMethod(new Uint8Array(doc));
        });
    }
