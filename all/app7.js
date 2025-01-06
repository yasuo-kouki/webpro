"use strict";
const express = require("express");
const app = express();

let bbs = [];  // 本来はDBMSを使用するが，今回はこの変数にデータを蓄える

// EJSテンプレートエンジンを設定
app.set('view engine', 'ejs');
// 静的ファイル（publicフォルダ内）のアクセス設定
app.use("/public", express.static(__dirname + "/public"));
// POSTリクエストのボディをURLエンコード形式で処理できるように設定
app.use(express.urlencoded({ extended: true }));

// /hello1 にアクセスしたときに2つのメッセージを表示
app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1:message1, greet2:message2});
});

// /hello2 にアクセスしたときに固定の2つのメッセージを表示
app.get("/hello2", (req, res) => {
  res.render('show', { greet1:"Hello world", greet2:"Bon jour"});
});

// /icon にアクセスしたときにAppleのロゴ画像を表示
app.get("/icon", (req, res) => {
  res.render('icon', { filename:"./public/Apple_logo_black.svg", alt:"Apple Logo"});
});

// /luck にアクセスしたときに運勢をランダムで表示
app.get("/luck", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  // 運勢の内容を決定
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';
  console.log( 'あなたの運勢は' + luck + 'です' );
  // luck.ejsに運勢の内容を渡して表示
  res.render( 'luck', {number:num, luck:luck} );
});

// /janken にアクセスしてじゃんけんを行う
app.get("/janken", (req, res) => {
  let hand = req.query.hand;  // 人間の出した手
  let win = Number( req.query.win );  // 勝った回数
  let total = Number( req.query.total );  // 総試合数
  console.log( {hand, win, total});
  const num = Math.floor( Math.random() * 3 + 1 );  // ランダムでCPUの手を決定
  let cpu = '';
  // CPUの手を決定
  if( num==1 ) cpu = 'グー';
  else if( num==2 ) cpu = 'チョキ';
  else cpu = 'パー';
  
  // 勝敗判定を行う（現在はダミーで「勝ち」として設定）
  let judgement = '勝ち';
  win += 1;
  total += 1;
  
  // 結果を画面に表示するためのデータを用意
  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  res.render( 'janken', display );  // janken.ejsに渡して表示
});

// テスト用のGETリクエスト（固定のJSONレスポンスを返す）
app.get("/get_test", (req, res) => {
  res.json({
    answer: 0
  })
});

// GETリクエストで2つの数を受け取り、その合計を返す
app.get("/add", (req, res) => {
  console.log("GET");
  console.log( req.query );
  const num1 = Number( req.query.num1 );
  const num2 = Number( req.query.num2 );
  console.log( num1 );
  console.log( num2 );
  res.json( {answer: num1+num2} );
});

// POSTリクエストで2つの数を受け取り、その合計を返す
app.post("/add", (req, res) => {
  console.log("POST");
  console.log( req.body );
  const num1 = Number( req.body.num1 );
  const num2 = Number( req.body.num2 );
  console.log( num1 );
  console.log( num2 );
  res.json( {answer: num1+num2} );
});

// BBS関連のエンドポイント

// 現在の掲示板の投稿数を返す
app.post("/check", (req, res) => {
  // 本来はここでDBMSに問い合わせる
  res.json( {number: bbs.length });
});

// 投稿を読み込む（ページ番号の指定があれば、指定された範囲を返す）
app.post("/read", (req, res) => {
  // 本来はここでDBMSに問い合わせる
  const start = Number( req.body.start );
  console.log( "read -> " + start );
  if( start==0 ) res.json( {messages: bbs });
  else res.json( {messages: bbs.slice( start )});
});

// 新しい投稿を掲示板に追加
app.post("/post", (req, res) => {
  const name = req.body.name;  // 名前
  const message = req.body.message;  // メッセージ
  console.log( [name, message] );
  // 本来はここでDBMSに保存する
  bbs.push( { name: name, message: message } );  // bbs配列に追加
  res.json( {number: bbs.length } );  // 現在の投稿数を返す
});

// アプリケーションをポート8080で起動
app.listen(8080, () => console.log("Example app listening on port 8080!"));
