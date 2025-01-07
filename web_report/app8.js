"use strict";
const express = require("express");
const app = express();

// BBSデータを保存する配列（本来はDBMSを使用する）
let bbs = [];  

// EJSをテンプレートエンジンとして設定
app.set('view engine', 'ejs');
// 静的ファイル（CSS、JS、画像など）を提供するディレクトリを設定
app.use("/public", express.static(__dirname + "/public"));
// POSTデータのパース用ミドルウェア
app.use(express.urlencoded({ extended: true }));

// "/hello1"ルートで2つの挨拶メッセージを表示
app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1:message1, greet2:message2});
});

// "/hello2"ルートでもう1つの簡単な挨拶表示
app.get("/hello2", (req, res) => {
  res.render('show', { greet1:"Hello world", greet2:"Bon jour"});
});

// "/icon"ルートで画像を表示
app.get("/icon", (req, res) => {
  res.render('icon', { filename:"./public/Apple_logo_black.svg", alt:"Apple Logo"});
});

// ランダムにおみくじを表示
app.get("/luck", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  // おみくじの運勢判定
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';
  console.log( 'あなたの運勢は' + luck + 'です' );
  res.render( 'luck', {number:num, luck:luck} );
});

// "/janken"ルートでじゃんけんを行い、勝敗を判定
app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number( req.query.win );
  let total = Number( req.query.total );
  console.log( {hand, win, total});
  const num = Math.floor( Math.random() * 3 + 1 );
  let cpu = '';
  if( num==1 ) cpu = 'グー';
  else if( num==2 ) cpu = 'チョキ';
  else cpu = 'パー';
  
  // じゃんけんの勝敗判定（現在はダミーで人間の勝ち）
  let judgement = '勝ち';
  win += 1;
  total += 1;
  
  // 結果を表示
  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  res.render( 'janken', display );
});

// "/get_test"ルートでJSON形式で返すテスト
app.get("/get_test", (req, res) => {
  res.json({
    answer: 0
  })
});

// "/add"ルートで2つの数値を加算して返す
app.get("/add", (req, res) => {
  console.log("GET");
  console.log( req.query );
  const num1 = Number( req.query.num1 );
  const num2 = Number( req.query.num2 );
  console.log( num1 );
  console.log( num2 );
  res.json( {answer: num1+num2} );
});

// POSTリクエストで2つの数値を加算して返す
app.post("/add", (req, res) => {
  console.log("POST");
  console.log( req.body );
  const num1 = Number( req.body.num1 );
  const num2 = Number( req
