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

using DocumentFormat.OpenXml.Packaging;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using WordBattlerWeb.Models;

namespace WordBattlerWeb.Controllers
{
    public class BattlerInfoesController : Controller
    {
        private BattlerInfoContext db = new BattlerInfoContext();
        private struct ResultMessage
        {
            public readonly static string Succeeded = "Succeeded";
            public readonly static string LoginRequired = "Login required";
        };

        // GET: BattlerInfoes/Login
        public ActionResult Login()
        {
            return View();
        }

        // GET: BattlerInfoes/Regist
        public ActionResult Regist()
        {
            return View();
        }

        // バトラー新規登録
        // POST: BattlerInfoes/Regist
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Regist(string Id, string Name, BattlerAccountInfo BattlerAccountInfo)
        {
            if (ModelState.IsValid)
            {
                if (isDuplicated(Id))
                    return Json("すでに同じIDが登録されています。別のIDを入力してください。");

                db.BattlerInfoes.Add(new BattlerInfo
                {
                    Id = Id,
                    Name = Name,
                    BattlePointSum = 0,
                    BattlerAccountInfo = new BattlerAccountInfo
                    {
                        Password = EncryptPassword(BattlerAccountInfo.Password),
                        Character = BattlerAccountInfo.Character
                    },
                    BattlePoint = new BattlePoint
                    {
                        Attack = 0,
                        Defense = 0,
                        Speed = 0,
                        Luck = 0
                    },
                    HiddenBattlePoint = new BattlePoint
                    {
                        Attack = 0,
                        Defense = 0,
                        Speed = 0,
                        Luck = 0
                    },
                    BattleResult = new BattleResult
                    {
                        Won = 0,
                        Lost = 0
                    },
                    Registered = DateTime.Now,
                    LastLogined = DateTime.Now
                });

                // データベースに登録
                db.SaveChanges();

                // ログインIDを登録
                SetLoginId(Id);
                return Json(ResultMessage.Succeeded);
            }
            else
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
        }

        // 登録済みのバトラーでログイン
        // POST: BattlerInfoes/Login
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Login(string Id, BattlerAccountInfo BattlerAccountInfo)
        {
            BattlerInfo info;
            string accountPassword;

            // 登録情報取得
            info = db.BattlerInfoes.Find(Id);
            if (info == null)
            {
                return Json("ユーザーID、もしくはパスワードが正しくありません。");
            }

            // パスワード取得
            accountPassword = info.BattlerAccountInfo.Password;

            // パスワードを照合
            if (!ConfirmPassword(BattlerAccountInfo.Password, accountPassword))
                return Json("ユーザーID、もしくはパスワードが正しくありません。");

            // ログインIDを登録
            SetLoginId(Id);

            // 最終ログイン日を更新
            info.LastLogined = DateTime.Now;
            db.SaveChanges();

            return Json(ResultMessage.Succeeded);
        }

        // バトル終了後のデータ送信
        [HttpPost]
        public ActionResult BattleEnd(Boolean isWin)
        {
            // ログインチェック
            if (!isLogin())
                return LoginRequired();

            BattlerInfo info = db.BattlerInfoes.Find(GetLoginId());

            // データ更新
            if (isWin)
                info.BattleResult.Won++;
            else
                info.BattleResult.Lost++;

            db.SaveChanges();

            return Json(ResultMessage.Succeeded);
        }

        // バトルポイントを算出
        // POST: BattlerInfoes/CalcBattlePoint
        [HttpPost]
        public ActionResult CalcBattlePoint(HttpPostedFileBase xml)
        {
            // ログインチェック
            if (!isLogin())
                return LoginRequired();

            WordprocessingDocument document = WordprocessingDocument.Open(xml.InputStream, false);
            BattlePoint result = new BattlePoint();
            BattlePoint hidden = new BattlePoint();
            string Id = GetLoginId();

            // プレイヤーの情報から必要な物を取得
            var player = (from a in db.BattlerInfoes
                                  where a.Id == Id
                                  select new
                                  {
                                      Name = a.Name,
                                      BattleResult = a.BattleResult,
                                      BattlerAccountInfo = new
                                      {
                                          Character = a.BattlerAccountInfo.Character
                                      }
                                  }).Single();

            // ポイントを計算
            WordDocumentToBattlePoint(xml, document, result, hidden, player.BattleResult);

            document.Close();

            // ポイントを送信
            PointCalcEnd(result, hidden);

            return Json(new
            {
                Name = player.Name,
                BattlerAccountInfo = new
                {
                    Character = player.BattlerAccountInfo.Character
                },
                Regular = result,
                Hidden = hidden
            });
        }

        // バトラーランキング取得
        // GET: BattlerInfoes/Ranking
        public ActionResult Ranking()
        {
            // ログインチェック
            if (!isLogin())
                return LoginRequired();

            const int num = 10; // 順位数
            var result = (from a in db.BattlerInfoes
                          where ((a.BattleResult.Won > 0) || (a.BattleResult.Lost > 0))
                          orderby a.BattlePointSum descending
                          select new { Name = a.Name, BattlePointSum = a.BattlePointSum }).Take(num);

            // 自分の順位を取得
            string Id = GetLoginId();
            var myInfo = (from a in db.BattlerInfoes
                          where (a.Id == Id) && ((a.BattleResult.Won > 0) || (a.BattleResult.Lost > 0))
                          select new { Name = a.Name, BattlePointSum = a.BattlePointSum }).SingleOrDefault();
            int myRank = (myInfo != null) ? db.BattlerInfoes.Count(a => a.BattlePointSum >= myInfo.BattlePointSum) : 0;

            if (myRank > num)
                return Json(new { Rank = result, myInfo = myInfo, myRank = myRank }, JsonRequestBehavior.AllowGet);
            else
                return Json(new { Rank = result, myRank = myRank }, JsonRequestBehavior.AllowGet);
         }

        // ランダムなバトラー（対戦相手）を受信
        // POST: BattlerInfoes/GetBattler
        [HttpPost]
        public ActionResult GetBattler()
        {
            // ログインチェック
            if (!isLogin())
                return LoginRequired();

            // バトラーをランダムに抽出
            string Id = GetLoginId();
            int PointSum = (from a in db.BattlerInfoes
                            where a.Id == Id
                            select a.BattlePointSum).Single();
            object result;

            try { 
                result = (from a in db.BattlerInfoes
                          where (a.Id != Id)
                            orderby Math.Abs(a.BattlePointSum - PointSum)
                            select new { BattlePoint = a.BattlePoint,
                                BattlePointSum = a.BattlePointSum,
                                HiddenBattlePoint = a.HiddenBattlePoint,
                                BattlerAccountInfo = new {
                                    Character = a.BattlerAccountInfo.Character
                                },
                                BattleResult = a.BattleResult
                            })
                            .Take(100)
                            .OrderBy(x => Guid.NewGuid())
                            .First();
            }
            catch (InvalidOperationException)
            {
                result = (from a in db.BattlerInfoes
                          where (a.Id == Id)
                          select new
                          {
                              BattlePoint = a.BattlePoint,
                              BattlePointSum = a.BattlePointSum,
                              HiddenBattlePoint = a.HiddenBattlePoint,
                              BattlerAccountInfo = new
                              {
                                  Character = a.BattlerAccountInfo.Character
                              },
                              BattleResult = a.BattleResult
                          }).Single();
            }

            return Json(result, JsonRequestBehavior.AllowGet);
         }

        // -------------------------------------------------------------------------------------

        // ログインIDを記録するセッション項目の名前
        private const string SESSION_BATTLER_ID = "BattlerId";

        // ID重複確認
        private bool isDuplicated(string Id)
        {
            var info = db.BattlerInfoes.FirstOrDefault(a => a.Id == Id);

            return info != null;
        }

        // パスワード認証
        private static bool ConfirmPassword(string Password, string accountPassword)
        {
            return accountPassword == EncryptPassword(Password);
        }

        // ログイン名の設定
        private void SetLoginId(string Id)
        {
            Session[SESSION_BATTLER_ID] = Id;
        }

        // ログイン名の取得
        private string GetLoginId()
        {
            return (string)Session[SESSION_BATTLER_ID];
        }

        // ログインしているかどうか
        private bool isLogin()
        {
            return Session[SESSION_BATTLER_ID] != null;
        }

        // バトラーのデータを更新
        private void UpdateBattlerStatus(BattlerInfo dest, BattlePoint BattlePoint, BattlePoint BattlePointHidden)
        {
            Debug.Assert(dest != null);

            dest.BattlePoint = BattlePoint;
            dest.HiddenBattlePoint = BattlePointHidden;
            dest.BattlePointSum = BattlePoint.Attack + BattlePoint.Defense + BattlePoint.Speed + BattlePoint.Luck;
        }

        // パスワードを暗号化
        private static string EncryptPassword(string source)
        {
            SHA256CryptoServiceProvider SHA256 = new SHA256CryptoServiceProvider();

            byte[] byteValue = Encoding.UTF8.GetBytes(source);
            byte[] hashValue = SHA256.ComputeHash(byteValue);
                
            return Convert.ToBase64String(hashValue);
        }

        // ドキュメントとプレイヤー情報からバトルポイントを計算
        private void WordDocumentToBattlePoint(HttpPostedFileBase xml, WordprocessingDocument document, BattlePoint result, BattlePoint hidden, BattleResult battleResult)
        {
            char[] b = document.MainDocumentPart.Document.Body.InnerText.ToCharArray();
            int j = SumOfChar(b);

            // バトルポイント
            result.Attack = (int)(100.0 * Math.Sqrt((document.MainDocumentPart.Document.Body.InnerText.Length + 1) / 100.0)) / 10;
            result.Defense = xml.ContentLength / (document.MainDocumentPart.Document.Body.InnerXml.Length);
            result.Speed = j / ((b.Length + 1) * 500);
            result.Luck = 100 / (document.MainDocumentPart.Document.Body.InnerXml.Length / (document.MainDocumentPart.Document.Body.InnerText.Length + 5));

            // 隠しバトルポイント
            hidden.Attack = Math.Max(Request.UserHostName.GetHashCode() % 25, 0);
            hidden.Defense = Math.Max(((string)GetLoginId()).GetHashCode() % 25, 0);
            hidden.Speed = battleResult.Won ^ battleResult.Lost;
            hidden.Luck = DateTime.Now.Day ^ DateTime.Now.Hour;

            // ボーナス
            result.Attack += GetBonusPhraseCount("~/App_Data/Attack_Bonus.txt", document.MainDocumentPart.Document.Body.InnerText) * 20;
            result.Defense += GetBonusPhraseCount("~/App_Data/Defense_Bonus.txt", document.MainDocumentPart.Document.Body.InnerText) * 20;
            result.Speed += GetBonusPhraseCount("~/App_Data/Speed_Bonus.txt", document.MainDocumentPart.Document.Body.InnerText) * 20;
            result.Luck += GetBonusPhraseCount("~/App_Data/Luck_Bonus.txt", document.MainDocumentPart.Document.Body.InnerText) * 20;
        }

        private int GetBonusPhraseCount(string FilePath, string targetText)
        {
            StreamReader sr = new StreamReader(Server.MapPath(FilePath), Encoding.UTF8);
            string text = sr.ReadToEnd();

            sr.Close();
            return Regex.Matches(targetText, text).Count;
        }

        // char配列の合計
        private static int SumOfChar(char[] b)
        {
            int j = 0;

            for (int i = 0; i < b.Length; i++)
                j = j + b[i];

            return j;
        }

        // ログイン要求レスポンス
        private JsonResult LoginRequired()
        {
            return Json(ResultMessage.LoginRequired, JsonRequestBehavior.AllowGet);
        }

        // ポイント算出後のデータ送信
        private void PointCalcEnd(BattlePoint BattlePoint, BattlePoint BattlePointHidden)
        {
            BattlerInfo info = db.BattlerInfoes.Find(GetLoginId());

            // データ更新
            UpdateBattlerStatus(info, BattlePoint, BattlePointHidden);
            db.SaveChanges();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
