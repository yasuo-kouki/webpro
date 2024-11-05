# webpro_06
# お腹すいた〜〜〜〜〜〜〜〜〜〜
(# 見出し)
## このプロフラムについて
## ファイル一覧

ファイル名 | 説明
-|-
app5.js | プログラム本体
public/janken.html | じゃんけんの開始画面
views / janken | じゃんけんのテンプレート

```javascript
console.log("Hello");
```
## 使用手順
1. ```app5.js``` を起動する
1. Webブラウザでlocalhost:8080/public/janken.htmlにアクセスする
1. 自分の手を入力する

```mermaid
flowchart TD;
開始 --> 終了;
```
```mermaid
flowchart TD;

start["開始"];
end1["終了"]
if{"条件に合うか"}
win["勝ち"]
loose["負け"]

start --> if
if -->|yes| win
win --> end1
if -->|no| loose
loose --> end1
```



```mermaid
graph TD
  start["開始"]
  end1["終了"]
  if{"(hand が 'グー' かつ cpu が 'チョキ') または<br>(hand が 'チョキ' かつ cpu が 'パー') または<br>(hand が 'パー' かつ cpu が 'グー')"}
  win["勝ち"]
  loose["負け"]
  tie["あいこ"]

  start --> if
  if -->|yes| win
  win --> end1
  if -->|no| if_tie{"hand == cpu"}
  if_tie -->|yes| tie
  tie --> end1
  if_tie -->|no| loose
  loose --> end1

```