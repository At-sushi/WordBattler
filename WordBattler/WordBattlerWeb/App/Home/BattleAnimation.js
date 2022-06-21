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

function flicker(target, count, callback, current) {
    current = current || 0;

    target[current % 2 == 0 ? 'hide' : 'show']();

    setTimeout(function () {
        if (count * 2 <= current) {
            callback();
            return;
        }
        flicker(target, count, callback, current + 1)
    }, 55);
}
// バトラーの攻撃ターン処理
    function AttackBattler(Attacker, Defender, count, resultfunc) {
        var text = Attacker.BattlerAccountInfo.Character + "　の　こうげき！<br>";      // バトルメッセージ

        // 画像を元に戻す
        Attacker.hitMark.hide();
        Attacker.image.attr("src", CHARACTER_IMG[Attacker.BattlerAccountInfo.Character])

        // 相手にダメージ
        function Damage() {
            var Damage = Math.floor(Math.max(Attacker.BattlePoint.Attack * (Math.random() * (Attacker.BattlePoint.Luck / 100)) * 1.5 - Math.sqrt(Defender.BattlePoint.Defense), 1));

            Defender.Damage += Damage;
            text += Defender.BattlerAccountInfo.Character + "　に　あたった！（ダメージ：　" + Damage + "）";

            // ヒットマーク表示
            Defender.hitMark.show();

            // キャラ点滅
            flicker(Defender.image, 3, function () {
                Defender.image.show();
            });

            // キャラの画像を変える
            Defender.image.attr("src", CHARACTER_IMG_LOSE[Defender.BattlerAccountInfo.Character])
        }

        // 相手に特別なダメージ（会心の一撃）
        function LuckyDamage() {
            var Damage = Attacker.BattlePoint.Attack * (Math.random() * (Attacker.BattlePoint.Luck / 100) - Math.sqrt(Defender.BattlePoint.Defense));

            Damage = Math.floor(Math.max(Damage * Math.random() * (Attacker.BattlePoint.Luck / 100), 1));
            Defender.Damage += Damage;
            text = Attacker.BattlerAccountInfo.Character + "　のラッキーパンチ！<br>" +
                   Defender.BattlerAccountInfo.Character + "　に　あたった！（ダメージ：　" + Damage + "）";

            // ヒットマーク表示
            Defender.hitMark.show();

            // キャラ点滅
            flicker(Defender.image, 5, function () {
                Defender.image.show();
            });

            // キャラの画像を変える
            Defender.image.attr("src", CHARACTER_IMG_LOSE[Defender.BattlerAccountInfo.Character]);

            // 光る
            setTimeout(function () {
                $('#content-main').css("background", "#fff");
                setTimeout(function () {
                    $('#content-main').css("background", "#000");
                }, 55);
            }, 55);

        }

        // 演出効果を振り分け
        if (Math.random() * Attacker.BattlePoint.Luck > Math.random() * Defender.BattlePoint.Luck)
            LuckyDamage();
        else if (Attacker.BattlePoint.Speed > Defender.BattlePoint.Speed + (Math.random() * (Defender.BattlePoint.Luck / 100)))
            Damage();
        else
            text += Defender.BattlerAccountInfo.Character + "　は身をかわした！";

        // メッセージを更新
        WriteMessage(text);

        // 4秒後に次のイベントを実行
        var interval = 4000;

        if (Attacker.BattlePoint.Speed > Defender.BattlePoint.Speed * 2 &&
            Math.random() < 0.3 + 0.2 * (Defender.BattlePoint.Luck / 100))
            timeout = setTimeout(function () { AttackBattler(Attacker, Defender, count, resultfunc); }, interval);          // 連続攻撃
        else if (count < 6)
            timeout = setTimeout(function () { AttackBattler(Defender, Attacker, count + 1, resultfunc); }, interval);
        else
            timeout = setTimeout(resultfunc, interval);
    }

    // メッセージ欄を書き換え
    function WriteMessage(text) {
        $('.battle-message-box-animation').html(text);
    }

    // ワードバトル画面
    function wordBattle() {
        $('#canvas-main').empty().activity({ length: 0 });
        $('#canvas-main').load('WordBattle.html #content-main div', function () {
            $('#start-battle').click(startBattle);
            $('#escape').click(function () {
                $('#command').val("show-battle-point");
                moveToMain();
            });
            loadBattler();
        });
    }

    // バトル結果を表示
    function BattleResult(Attacker, Defender) {

        Attacker.hitMark.hide();
        Defender.hitMark.hide();

        if (Attacker.Damage <= Defender.Damage) {
            sendBattlerInfo(true);
            WriteMessage(Attacker.BattlerAccountInfo.Character + "　はバトルに<br>しょうりした！");

            $("#image-opponent").attr("src", CHARACTER_IMG_LOSE[Defender.BattlerAccountInfo.Character])
            $("#image-player").attr("src", CHARACTER_IMG_WIN[Attacker.BattlerAccountInfo.Character])
        }
        else {
            sendBattlerInfo(false);
            WriteMessage(Attacker.BattlerAccountInfo.Character + "　はバトルに<br>まけてしまった…");

            $("#image-opponent").attr("src", CHARACTER_IMG_WIN[Defender.BattlerAccountInfo.Character])
            $("#image-player").attr("src", CHARACTER_IMG_LOSE[Attacker.BattlerAccountInfo.Character])
        }

        // リンク表示
        $('.battle-message-box-animation').append('<br />')
                                          .append($('<a></a>').text('つづけてバトルする').click(wordBattle).attr('style', 'padding-right: 15px;'))
                                          .append($('<a></a>').text('メインがめんにもどる').click(endBattle))
    }

    // ワードバトル画面に戻る
    function endBattle() {
        $('#canvas-main').empty().activity({ length: 0 });
        moveToMain();
        $('#command').val("show-battle-point");
    }

    // 戦闘終了後、バトルポイントとバトル成績をサーバーに送信
    function sendBattlerInfo(isWin) {
        $.ajax('/battlerinfoes/BattleEnd', {
            type: 'post',
            data: {
                isWin: isWin
            }
        });
    }
