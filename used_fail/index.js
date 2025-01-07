"use strict";
const express = require("express");
const app = express();

let bbs = []; // 投稿データ（名前、メッセージ、いいね数）

// EJSテンプレートエンジンを設定
app.set("view engine", "ejs");
// 静的ファイル（publicフォルダ内）のアクセス設定
app.use("/public", express.static(__dirname + "/public"));
// POSTリクエストのボディをURLエンコード形式で処理できるように設定
app.use(express.urlencoded({ extended: true }));

// BBS関連のエンドポイント

// 現在の掲示板の投稿数を返す
app.post("/check", (req, res) => {
  res.json({ number: bbs.length });
});

// 投稿を読み込む（ページ番号の指定があれば、指定された範囲を返す）
app.post("/read", (req, res) => {
  const start = Number(req.body.start);
  if (start == 0) res.json({ messages: bbs });
  else res.json({ messages: bbs.slice(start) });
});



// 新しい投稿を掲示板に追加
app.post("/post", (req, res) => {
  let name = req.body.name; // 名前
  const message = req.body.message; // メッセージ

  // 匿名の場合、名前を「名無しさん」に設定
  if (!name || name.trim() === "") {
    name = "名無しさん";
  }

  bbs.push({ name, message, likes: 0 }); // 新しい投稿を追加
  res.json({ number: bbs.length }); // 現在の投稿数を返す
});


// アプリケーションをポート8080で起動
app.listen(8080, () => console.log("Example app listening on port 8080!"));
