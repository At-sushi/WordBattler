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

// ランキング画面更新処理
function onRankingUpdated(data) {
    var currentRank = 0;
    var prevPoint = -1;
    var tagged = false;

    // ログイン確認
    if (data === 'Login required') {
        window.location.href = '/BattlerInfoes/Login';
        return;
    }

    $('#result').activity(false);
    $.each(data.Rank, function () {
        // 同着判定
        if (this.BattlePointSum != prevPoint) {
            currentRank++;
            prevPoint = this.BattlePointSum;
        }

        // 表示を更新
        var tr = $('<tr></tr>')
                .append($('<td class="rank"></td>').text(currentRank))
                .append($('<td></td>').text(this.Name))
                .append($('<td></td>').text(this.BattlePointSum));
        if (currentRank <= data.myRank &&
            data.Rank[Math.min(data.myRank - 1, 9)].BattlePointSum == this.BattlePointSum &&
            this.Name == battleCommon.player.Name &&
            tagged == false) {
            tr.attr('class', 'my-rank');
            tagged = true;
        }
        $('#result').append(tr);
    });

    // 自分のランキングデータがある場合、さらに下に表示。
    if (data.myInfo && tagged == false)
        $('#result').append($('<tr></tr>'))
            .append($('<tr class="my-rank"></tr>')
                .append($('<td class="rank"></td>').text(data.myRank))
                .append($('<td></td>').text(data.myInfo.Name))
                .append($('<td></td>').text(data.myInfo.BattlePointSum))
            );
}

