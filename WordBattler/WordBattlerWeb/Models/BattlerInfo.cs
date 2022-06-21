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

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WordBattlerWeb.Models
{
    // バトラー登録情報
    public class BattlerInfo
    {
        [Key]
        [Required(ErrorMessage = "IDが記入されていません")]
        [MaxLength(30, ErrorMessage="IDが長すぎます")]
        [RegularExpression("[a-zA-Z0-9_]*", ErrorMessage="IDには半角英数字、及びアンダースコア(_)のみが使用できます。")]
        [Display(Name = "ID")]
        public string Id { get; set; }

        [Required(ErrorMessage = "バトラーネームが記入されていません")]
        [MaxLength(30, ErrorMessage = "バトラーネームが長すぎます")]
        [Display(Name = "バトラーネーム")]
        public string Name { get; set; }

        [Index]
        [Display(Name = "バトルポイント合計")]
        public int BattlePointSum { get; set; }

        public BattlerAccountInfo BattlerAccountInfo { get; set; }
        public BattlePoint BattlePoint { get; set; }
        public BattlePoint HiddenBattlePoint { get; set; }
        public BattleResult BattleResult { get; set; }

        [Display(Name = "登録日")]
        public DateTime Registered { get; set; }
        [Display(Name = "最終ログイン日")]
        public DateTime LastLogined { get; set; }
    }

    // バトラーアカウント情報
    [ComplexType]
    public class BattlerAccountInfo
    {
        [Required(ErrorMessage = "パスワードが記入されていません")]
        [DataType(DataType.Password)]
        [MinLength(8, ErrorMessage = "パスワードは8文字以上ご記入してください")]
        [MaxLength(100, ErrorMessage = "パスワードが長すぎます")]
        [Display(Name = "パスワード")]
        public string Password { get; set; }

        [Required(ErrorMessage = "キャラクターが選択されていません")]
        [MaxLength(30)]
        [Display(Name = "キャラクター")]
        public string Character { get; set; }
    }

    // バトルポイント
    [ComplexType]
    public class BattlePoint
    {
        [Display(Name = "攻撃力")]
        public int Attack { get; set; }

        [Display(Name = "防御力")]
        public int Defense { get; set; }

        [Display(Name = "すばやさ")]
        public int Speed { get; set; }

        [Display(Name = "運")]
        public int Luck { get; set; }
    }

    // バトル結果
    [ComplexType]
    public class BattleResult
    {
        [Display(Name = "勝利回数")]
        public int Won { get; set; }

        [Display(Name = "敗北回数")]
        public int Lost { get; set; } 
    }
}
