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

            // 点滅の間隔
            var Interval = 500;

            setInterval(function () { $('#pushkey_indicator').slideToggle(0); }, Interval);
        });
    };

})();