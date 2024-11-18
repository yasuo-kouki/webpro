const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1:message1, greet2:message2});
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1:"Hello world", greet2:"Bon jour"});
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename:"./public/Apple_logo_black.svg", alt:"Apple Logo"});
});

app.get("/luck", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';
  console.log( 'あなたの運勢は' + luck + 'です' );
  res.render( 'luck', {number:num, luck:luck} );
});


app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number(req.query.win);
  let total = Number(req.query.total);
  console.log({ hand, win, total }); // 確認のために表示
  const num = Math.floor(Math.random() * 3 + 1); // 乱数表示

  let cpu = '';
  if (num === 1) cpu = 'グー';
  else if (num === 2) cpu = 'チョキ';
  else cpu = 'パー';

  // 勝敗の判定を行う
  let judgement = '';
  if (
    (hand === 'グー' && cpu === 'チョキ') ||
    (hand === 'チョキ' && cpu === 'パー') ||
    (hand === 'パー' && cpu === 'グー')
  ) {
    judgement = '勝ち';
    win += 1; // 勝った場合のみ増加
  } else if (hand === cpu) {
    judgement = 'あいこ';
  } else {
    judgement = '負け';
  }

  total += 1; // トータルは毎回増加

  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total,
  };
  res.render('janken', display);
});




app.get("/hiandlo", (req, res) => {
  let userChoice = req.query.choice || '';  // ユーザーが選んだ「Hi」または「Lo」
  let judgement = ''; // 勝敗を判定するための変数
  let userCard; // ユーザーのカード（ランダムに生成）
  
  // ユーザーが「もう一度プレイ」を押した場合、カードを再度ランダムで生成
  if (!req.query.userCard) {
    userCard = Math.floor(Math.random() * 13) + 1;  // ユーザーのカードをランダムに生成
  } else {
    userCard = Number(req.query.userCard);  // カードがすでに選ばれている場合
  }

  const cpuCard = Math.floor(Math.random() * 13) + 1;  // コンピュータのカード

  // 勝敗の判定
  if (userChoice === 'hi') {
    if (userCard > cpuCard) {
      judgement = 'あなたの勝ち！';
    } else if (userCard < cpuCard) {
      judgement = 'あなたの負け！';
    } else {
      judgement = '引き分け！';
    }
  } else if (userChoice === 'lo') {
    if (userCard < cpuCard) {
      judgement = 'あなたの勝ち！';
    } else if (userCard > cpuCard) {
      judgement = 'あなたの負け！';
    } else {
      judgement = '引き分け！';
    }
  }
  
  // 表示する情報をセット
  const display = {
    your: userCard,
    cpu: cpuCard,
    judgement: judgement,
    total: total,
    choice: userChoice,
  };

  res.render('hiandlo', display);
});





app.get("/chinchiro", (req, res) => {
  let userChoice = req.query.choice || '';  // ユーザーの選択
  let judgement = ''; // 勝敗を判定するための変数
  let userDice = []; // ユーザーのサイコロの目
  let cpuDice = []; // コンピュータのサイコロの目

  // ユーザーが「もう一度プレイ」を押した場合、サイコロを再度ランダムで生成
  if (!req.query.userDice) {
    // 3つのサイコロをランダムに振る
    for (let i = 0; i < 3; i++) {
      userDice.push(Math.floor(Math.random() * 6) + 1);  
    }
  } else {
    userDice = req.query.userDice.split(',').map(Number); // すでに選ばれたサイコロの目
  }

  // コンピュータのサイコロも3つ振る
  for (let i = 0; i < 3; i++) {
    cpuDice.push(Math.floor(Math.random() * 6) + 1);
  }

  // 役を判定する関数
  const checkRole = (dice) => {
    // ソートして比較しやすくする
    dice.sort((a, b) => a - b);

    // アラシ（嵐）: すべてのサイコロが同じ
    if (dice[0] === dice[1] && dice[1] === dice[2]) {
      return 'アラシ'; // 3個とも同じ
    }
    // シゴロ（四五六）: 4, 5, 6
    if (dice[0] === 4 && dice[1] === 5 && dice[2] === 6) {
      return 'シゴロ';
    }
    // ヒフミ（一二三）: 1, 2, 3
    if (dice[0] === 1 && dice[1] === 2 && dice[2] === 3) {
      return 'ヒフミ';
    }
    // 同じ目が2つ、異なる目が1つの場合、その異なる目を役とする
    if (dice[0] === dice[1] && dice[1] !== dice[2]) {
      return dice[2];  // 異なる目（役）を返す
    }
    if (dice[1] === dice[2] && dice[0] !== dice[1]) {
      return dice[0];  // 異なる目（役）を返す
    }
    if (dice[0] === dice[2] && dice[1] !== dice[0]) {
      return dice[1];  // 異なる目（役）を返す
    }
    // 目なし（目無し）: 特に役がない
    return '目なし';
  };

  const userRole = checkRole(userDice);
  const cpuRole = checkRole(cpuDice);

  // 判定
  if (userRole === 'アラシ') {
    judgement = 'あなたの勝ち！アラシ（嵐）です。';
  } else if (userRole === 'シゴロ') {
    judgement = 'あなたの勝ち！シゴロ（四五六）です。';
  } else if (userRole === 'ヒフミ') {
    judgement = 'あなたの負け！ヒフミ（一二三）です。';
  } else if (userRole === '目なし') {
    judgement = 'あなたの負け！目なし（凡）です。';
  } else if (typeof userRole === 'number') {
    judgement = `あなたの勝ち！${userRole}の目が役です。`;
  } else {
    judgement = '引き分け！';
  }

  // 表示する情報をセット
  const display = {
    userDice: userDice.join(', '),
    cpuDice: cpuDice.join(', '),
    userRole: userRole,
    cpuRole: cpuRole,
    judgement: judgement,
  };

  res.render('chinchiro', display);
});


app.listen(8080, () => console.log("Example app listening on port 8080!"));