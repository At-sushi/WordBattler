■必要動作環境
ASP.NET 4.5対応ウェブサーバ
および
SQL　Databaseサーバ

上記の動作環境が必要です。（Microsoft Azureにて動作確認を致しております）

■プロジェクト内訳
・WordBattler
WordBattlerのマニフェストファイル、及びアプリの設定ファイルが含まれております。

・WordBattlerWeb
WordBattlerで使用するWebサイトのプロジェクトです。
こちらのプロジェクトが納品物となります。

■変更の必要な箇所
・マニフェスト
    <SourceLocation DefaultValue="https://localhost:44301/App/Home/Confirm.html" />
上記タグ内の「localhost:44301」の部分を、設置するWebサイトのドメイン名に変更してください。
また、必要に応じて、アプリの説明欄などをご記入ください。

・ポイントボーナス定義ファイル
App_Dataフォルダ内に、ポイントボーナスを付与するキーワードを記述するための、テキストファイルがあります。
ファイル内に記入例がありますので、そちらに沿って、ポイントボーナスを付与するキーワードをご入力ください。

・項目説明テキスト
Views\BattlerInfoes\Login.cshtmlおよび、Views\BattlerInfoes\Regist.cshtml内の項目につきましては、
data-description属性に指定したテキストが、説明として表示されるようになっておりますので、
お手数ですが、ご記入をお願いいたします。


■サーバー環境の構築方法
Microsoft Azureを用いた方法をご説明いたします。

１）　Microsoft　Azureサイトの「無料で試す」ボタンをクリックし、画面の指示に従いましてMicrosoft Azureのアカウントを登録してください。

２）　管理ポータル画面のトップページより「Webサイト」を選択して、「Webサイトの作成」をクリックしてください。
　　　その後、画面の指示に従いまして、新規Webサイトを作成してください。

３）　管理ポータル画面のトップページより｢SQL データベース｣を選択して、「SQL データベースを作成します」をクリックしてください。
　　　その後、画面の指示に従いまして、新規データベースを作成してください。
　　　この際指定したパスワードはあとで必要になりますので、控えておいてください。

４）　「Azure ファイアウォールを設定する」をクリックしたあと、出てくるダイアログの「はい」をクリックし、アクセスを許可してください。

５）　「ADO.Net ODBC PHP JDBCのデータベース接続文字列を表示する」をクリックし、ADO.Net欄の接続文字列を控えておいてください（あとで使用します）。

■Webアプリケーションの発行方法
１）　Visual Studioでプロジェクトを開き、「ソリューションエクスプローラー」タブの「WordBatter」プロジェクトを右クリックし、
　　　プルダウンメニューより「発行」を選択してください。

２）　発行先としてMicrosoft Azure Websiteを選択し、先ほど作ったアカウントでサインインしてください。
　　　「既存のWebサイト」メニューより、先ほど作ったWebサイトを選択し、OKをクリックしてください。

３）　「設定」タブの「BattlerInfoContext」と表示されているテキスト欄に、
　　　先ほどの接続文字列を記入し、「{ここにパスワードを挿入}」というテキストをデータベースのパスワードに置き換えてください。

４）　「発行」ボタンをクリックして、ページの発行を完了してください。

■マニフェストファイルの配置方法
テスト環境では共有フォルダを作成する方法を使用しておりましたが、アプリとして公開するにはOffice Exchangeを使用する必要があるようです。
http://msdn.microsoft.com/ja-jp/library/bb772100.aspx
お手数ですが、上記のサイトをご確認ください。

■DDLにつきまして
アプリケーション発行の際にテーブルは自動生成されますので、手動でテーブルを生成する必要はありませんが、
もし正常に作成されないようでしたら、　下記のSQLコードをお使いください。

CREATE TABLE [dbo].[BattlerInfoes] (
    [Id]                           NVARCHAR (30)  DEFAULT ('') NOT NULL,
    [Name]                         NVARCHAR (30)  NOT NULL,
    [BattlePointSum]               INT            NOT NULL,
    [BattlerAccountInfo_Password]  NVARCHAR (100) NOT NULL,
    [BattlerAccountInfo_Character] NVARCHAR (30)  NOT NULL,
    [BattlePoint_Attack]           INT            NOT NULL,
    [BattlePoint_Defense]          INT            NOT NULL,
    [BattlePoint_Speed]            INT            NOT NULL,
    [BattlePoint_Luck]             INT            NOT NULL,
    [HiddenBattlePoint_Attack]     INT            NOT NULL,
    [HiddenBattlePoint_Defense]    INT            NOT NULL,
    [HiddenBattlePoint_Speed]      INT            NOT NULL,
    [HiddenBattlePoint_Luck]       INT            NOT NULL,
    [BattleResult_Won]             INT            NOT NULL,
    [BattleResult_Lost]            INT            NOT NULL,
    [Registered]                   DATETIME       DEFAULT ('1900-01-01T00:00:00.000') NOT NULL,
    [LastLogined]                  DATETIME       DEFAULT ('1900-01-01T00:00:00.000') NOT NULL,
    CONSTRAINT [PK_dbo.BattlerInfoes] PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
CREATE NONCLUSTERED INDEX [IX_BattlePointSum]
    ON [dbo].[BattlerInfoes]([BattlePointSum] ASC);


■内部構造
・ディレクトリ構造　※重要なもののみ記載いたします
App/　　　　表示するHtmlファイルやJavaScriptを格納しています
App_Data/　ボーナスポイント記述用のテキストファイルが配置されています
Controllers/ BattlerInfoesController.csが配置されています。
fonts/　　　　挿入フォントが配置されています
Images/　　　キャラクターのイメージファイルガ配置されています。
Models/　　　BattlerInfo.csおよびBattlerInfoesContext.csが配置されています。
Views/　　　　Login.cshtmlおよびRegist.cshtmlが配置されています。

・クラス詳細
サーバ側
ファイル数が多いので、主要なファイルのみ解説いたします。
ClassDiagram1.cdが参考になるかも知れませんので、よろしければ併せてご参照ください。

Models/BattlerInfo.cs
Models/BattlerInfoContext.cs
データベースに記録するデータを管理するためのモデルクラスです。

Controllers/BattlerInfoesController.cs
クライアントからの要求を受け取るためのAPIを、管理するためのコントローラークラスです。
バトルポイントの算出、登録、ログインなどの処理は、このクラスですべて行っております。

・BattlerInfoesControllerメソッド一覧

-API処理メソッド
BattlerInfoesController.Login() 
BattlerInfoesController.Regist() 
ログイン画面、登録画面を表示するためのメソッドです。

BattlerInfoesController.Ranking() 
DBよりデータを取得し、ランキング画面を表示します。

BattlerInfoesController.BattleEnd() 
バトルが終了したときの処理です。バトルポイントをDBに送信します。

BattlerInfoesController.CalcBattlePoint(）
バトルポイントを計算し、クライアントに返信します。

BattlerInfoesController.Login(string, WordBattlerWeb.Models.BattlerAccountInfo) 
ログイン処理です。
IDとパスワードを照合し、ログイン情報を保存します。

BattlerInfoesController.Regist(string, string, WordBattlerWeb.Models.BattlerAccountInfo) 
登録処理です。
バリデーションのあと、必要な情報をDBに新規登録します。

BattlerInfoesController.GetBattler(int) 
ランダムなバトラーを取得します。
自分のバトルポイントの合計に近い100人の中から、ランダムでバトラーを選択し、クライアントにデータを返信します。

-内部処理メソッド
BattlerInfoesController.ConfirmPassword(string, string) 
パスワード照合用メソッドです

BattlerInfoesController.EncryptPassword(string) 
パスワード暗号化用メソッドです

BattlerInfoesController.GetBonusPhraseCount(string, string) 
ボーナスワードと一致した単語の数を返すメソッドです

BattlerInfoesController.GetLoginId()
現在ログイン中のIdを取得するメソッドです

BattlerInfoesController.isDuplicated(string) 
ID重複チェック用のメソッドです

BattlerInfoesController.isLogin() 
ログイン確認のためのメソッドです

BattlerInfoesController.LoginRequired() 
ログイン要求を示すレスポンスを処理するメソッドです

BattlerInfoesController.SetLoginId(string) 
ログイン情報をセッションに保存するメソッドです（ログイン成功時に呼び出されます）

BattlerInfoesController.SumOfChar(char[]) 
char型配列の要素数を返すメソッドです

BattlerInfoesController.UpdateBattlerStatus()
DBのバトラー情報を更新するための処理を実装しているメソッドです

BattlerInfoesController.PointCalcEnd(BattlePoint BattlePoint, BattlePoint BattlePointHidden)
ポイント算出後のデータ送信メソッドです

BattlerInfoesController.WordDocumentToBattlePoint(WordprocessingDocument, WordBattlerWeb.Models.BattlePoint, WordBattlerWeb.Models.BattlePoint, WordBattlerWeb.Models.BattleResult)
Wordのドキュメントをバトルポイントに変換する為のメソッドです。
このWebアプリケーションの主要なルーチンとなります。
恐れ入りますが、ドキュメントの編集情報を直接入手する手段が無いため、アルゴリズムは下記の物で代用しております。

-WordDocumentToBattlePoint内のアルゴリズムにつきまして
攻撃力：ドキュメントの文字数に比例しますが、文字数が増えるにつれて増加率はしだいに減っていきます。

防御力：圧縮率の逆数を使用しております。
　　　　　圧縮アルゴリズムに依存しますが、原則として、使用する語句の種類が少ないほど、数値は高くなります。

素早さ：ドキュメント中の文字コードの総和を使用しております。

運：ドキュメント内のxmlタグの比率を使用しております。
　　Wordの文字装飾機能などを多用すると数値が高くなる可能性があります。

隠しバトルポイントにつきましては、おおむね企画書通りの物となっておりますが、
プロダクトIDは使用できないため、ユーザーのホストネームをハッシュ数値化して使用しております。

Views/Login.cshtml
Views/Regist.cshtml
ログイン画面、登録画面を管理するためのビュークラスです。
入力のバリデーション、及びクロスサイトリクエストフォージュリ対策に対応しております。

その他の詳細につきましては、ASP.NET MVC 5の仕様に準拠いたします。

-javascriptファイル構造
App\Home\BattlerAnimation.js		バトルアニメーション画面の処理スクリプトです。
App\Home\BattlerMain.js		ログイン後の画面全般の処理スクリプトです。
App\Home\BattlerRanking.js		バトラーランキング画面の処理スクリプトです。
App\Home\Confirm.js		免責事項画面の処理スクリプトです。
App\Home\Regist.js			登録画面の処理スクリプトです。(ログイン画面と共用しております)
App\Home\ShowBattlePoint.js		メイン画面の処理スクリプトです。（都合により、バトル機能全体で共有するデータが含まれております。）
App\Home\Title.js			タイトル画面の処理スクリプトです。
App\Home\WordBattle.js		ワードバトル画面の処理スクリプトです。


■今後の改良点につきまして
データベースのテーブル構造につきましては、問題が無く動くように設計を致しておりますが、
今後の最適化の余地があるかも知れません。
また、今回はjQueryを用いて制作を致しましたが、
コードの保守性の観点より、今後の改良の際には、TypeScript等への移行を検討するとよいかも知れません。
