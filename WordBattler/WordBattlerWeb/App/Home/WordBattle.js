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


    function init() {
        triggerLoading.forEach(function (trigger) {
            trigger.addEventListener('click', function (ev) {
                ev.preventDefault();
                loader.show();
                // after some time hide loader
                setTimeout(function () {
                    loader.hide();

                    classie.removeClass(pages[currentPage], 'show');
                    // update..
                    currentPage = currentPage ? 0 : 1;
                    classie.addClass(pages[currentPage], 'show');

                }, 2000);
            });
        });
    }

    // 「たたかう」選択後
    // メインバトル画面
    function startBattle(currentobj) {
        $('#canvas-main').empty().activity({ length: 0 });
        loader.show();
        $('#canvas-main').load("BattleAnimation.html #content-main div", function () {
            loader.hide();
            $("#image-opponent").attr("src", CHARACTER_IMG[battleCommon.opponent.BattlerAccountInfo.Character])
            $("#image-player").attr("src", CHARACTER_IMG[battleCommon.player.BattlerAccountInfo.Character])
            battleCommon.player.BattlePoint = battleCommon.player.Regular;
            battleCommon.player.BattlePoint.Attack += battleCommon.player.Hidden.Attack;
            battleCommon.player.BattlePoint.Defense += battleCommon.player.Hidden.Defense;
            battleCommon.player.BattlePoint.Speed += battleCommon.player.Hidden.Speed;
            battleCommon.player.BattlePoint.Luck += battleCommon.player.Hidden.Luck;

            battleCommon.opponent.BattlePoint.Attack += battleCommon.opponent.HiddenBattlePoint.Attack;
            battleCommon.opponent.BattlePoint.Defense += battleCommon.opponent.HiddenBattlePoint.Defense;
            battleCommon.opponent.BattlePoint.Speed += battleCommon.opponent.HiddenBattlePoint.Speed;
            battleCommon.opponent.BattlePoint.Luck += battleCommon.opponent.HiddenBattlePoint.Luck;

            battleCommon.player.Damage = battleCommon.opponent.Damage = 0;

            WriteMessage(battleCommon.opponent.BattlerAccountInfo.Character + 'があらわれた！');
            battleCommon.player.hitMark = $('#hitmark-player');
            battleCommon.opponent.hitMark = $('#hitmark-opponent');
            battleCommon.player.image = $('#image-player');
            battleCommon.opponent.image = $('#image-opponent');

            battleCommon.player.hitMark.hide();
            battleCommon.opponent.hitMark.hide();

            var interval = 4000;
            timeout = setTimeout(function () {
                AttackBattler(battleCommon.player, battleCommon.opponent, 1, function () {
                // 戦闘終了後の処理
                BattleResult(battleCommon.player, battleCommon.opponent);
                });
            }, interval);
        });
    }

    // ｢にげる｣選択後
    function escapeBattle() {
        moveToMain();
    }

    // メイン画面に移動
    function moveToMain() {
        $('#content-header div h1').text('メインがめん');
        $('#canvas-main').load('ShowBattlePoints.html #content-main div', function () {
            // バトルポイントを更新する
            uploadWordDocument();

            // 以後、5秒ごとにドキュメントの更新を確認
            var interval = 5000;
            timer = setInterval(function () {
                checkDocumentUpdated(uploadWordDocument);
            }, interval);
            //           $('#doc-name').empty().text(Office.context.document.url/*.match(".+/(.+?)([\?#;].*)?$")*/);
            //           Office.context.document.bindings.addFromSelectionAsync(Office.BindingType.Text, function (result) {
            //            });
        });
    }

    // 対戦相手を読み込む
    function loadBattler() {
        $.ajax("/battlerinfoes/getbattler", {
            type: 'post',
            datatype: 'json',
            cache: false
        }).done(function (data) {
            // ログイン確認
            if (data === 'Login required') {
                window.location.href = '/BattlerInfoes/Login';
                return;
            }

            battleCommon.opponent = data;
            $('.battle-name').text(data.BattlerAccountInfo.Character);
            $('.battle-point-sum').text(data.BattlePointSum);
            $('.battle-won').text(data.BattleResult.Won);
            $('.battle-lost').text(data.BattleResult.Lost);
            $("#image-opponent").attr("src", CHARACTER_IMG[data.BattlerAccountInfo.Character])
            $("#image-player").attr("src", CHARACTER_IMG[battleCommon.player.BattlerAccountInfo.Character])
        });
    }
