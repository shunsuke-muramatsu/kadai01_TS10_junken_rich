
// $(".game-start").on("click", function(){
// // コンピューター側 出し手 //
//     var com = Math.floor(Math.random() * 3);
// // プレイヤー側 出し手 //
//     var player = "" ;//最初は手札(ぐー・ちょき・パーを持たせない)

// if(com === player) {
//     console.log("あいこです");
//     $(".a").html("あいこ");
//     $(".janken-display").html("あいこ")

// } else if (com === 0 && player === 1 || com === 1 && player === 2 || com === 2 || player === 0 ){
//     console.log("あなたの負けです");
//     $(".a").html("負け");
    
// } else if (com === 0 && player === 2 ){
//     console.log("あなたの勝ちです");
//     $(".a").html("勝ち");

// } 

// })

// コンピューター側 出し手 //
// $(".game-status").on("click", function (){
// var random = Math.floor(Math.random() * 3);

// if(random === 0) {
//     console.log("0が出ました");
//     $(".janken-display").html("✊");

// } else if (random === 1){
//     console.log("1が出ました");
//     $(".janken-display").html("✌️");

// } else if (random === 2){
//     console.log("2が出ました");
//     $(".janken-display").html("✋");

// } 

// })

// やりたいことが実現できない...どうしようかな。帰ろっと。10/31


// 4.追加11/12(木)
function result(){
  $("#light-win").css("color","red");
}




// --- 3.[追加11/4(水)] マスを順番に光らせる演出関数 ---
function roulette() {
  var count = 0;       // 今何回光ったかを数える（速度や終了の判定用） 1少ない
  var currentNum = 1;  // 今光っている data-payout の番号（1〜12）
  
// 最終的に止まる位置をランダムにする
  var steps = Math.floor(Math.random() * 12) + 24;  // 2周以上回回したい
  console.log(steps + "ランダム");

  window.myGlobalVar = steps // グローバル変数に変換したかったけどよくわからず...
  console.log(myGlobalVar);

  // 100ミリ秒ごとに光るマスを移動させる、ように見せる
  var effectTimer = setInterval(function() {

    //一旦すべてのマスの光（activeクラス）を消す
    $(".square-item").removeClass("active");
    
    //今の番号（currentNum）のマスだけを光らせる
    $(`.square-item[data-payout="${currentNum}"]`).addClass("active");
    console.log(currentNum + "今");
    
    //次のために番号を1進める。12の次は1に戻るようにループ処理
    //currentNum % 12に1を足して、余りを1~12に調整
    currentNum = (currentNum % 12 + 1);
    console.log(currentNum + "A");
    count++; // 0から12まで足し続ける
    console.log(count++ + "足す");
    
    $(".shuter-hole").text(currentNum-1); // 獲得枚数を表示する
    $(".shuter-label").text("Pゲット!");
    $(".shuter-hole").css("color", "gray");
    currentNum ++ ;
 // ランダムで出た回数（steps）に達したらストップ！
    if (count >= steps) {
      clearInterval(effectTimer);  // clearIntervalを多用!光を止める。
      var finalWinNum = $(`.square-item.active`).attr("data-payout"); // ストップした数のdata-payoutの値を掴む
      console.log(finalWinNum + "final")
    }
    
  }, 100); //
}

// 改めて調べてみる。11/3
// 配列で作ってみる。

// グローバルスコープ ※どこからでもアクセス可
var hands = ["✊", "✌️", "✋"]; // 0番スタート 0,1,2
var index = 0;
var timerId = null; //タイマーを管理する変数

// 1.コンピューター側の操作 スタートとシャッフル
$(".game-start").on("click", function(){
// すでに動いている場合は、二重に動かないように一度クリア
    if(timerId != null){ // timerId != null はnullではない。否定。何か入っている、ということ
        clearInterval(timerId);
    }
    timerId = setInterval(function(){ // setIntervalで繰り返す・おぉ関数を変数に入れられるんだ!!
    // 今の絵文字(テキスト)を取得する
    var currentHand = hands[index];
    $(".janken-display").text(currentHand);
    //インデックスをループさせる
    index = (index + 1) % hands.length;
    console.log(index + "出し手");
    // console.log(index + "スライド"); // ずっとスライドしている。ループしている。
}, 300);    
})

// 2.プレイヤー側の操作 手を選ぶとストップする。そして勝敗を決める。
$(".player-btn").on("click", function() {
  // シャッフルを止める
//clearInterval(timerId); // setIntervalの繰り返し処理を停止する

// ボタンの有効・無効を元に戻す
$(".game-start").prop("disabled", false);

// お互いの手を取得する
var playerHand = $(this).attr("data-hand"); // 今クリックされたボタン(this)のdata-hand を取得(attr.)
var cpuHand = $(".janken-display").text();       // 今画面に出ているCPUの手を取得

// 勝敗の判定ロジックを作る。
var result = "";

if(playerHand === cpuHand) {
    result = "あいこ！";
    console.log(result);
    $(".game-start").text("もう一回");

} else if (
    (playerHand === "✊" && cpuHand === "✌️") ||
    (playerHand === "✌️" && cpuHand === "✋") ||
    (playerHand === "✋" && cpuHand === "✊")) 
    {
    result = "勝ち！";
    console.log(result);
    $(".game-start").text("やったね");
    clearInterval(timerId);
// 勝った時だけイベント（演出）を呼び出す！
    roulette(); // 光らせるイベントの関数が必要だ!明日考えよう
    
  } else if(
(playerHand === "✊" && cpuHand === "✋") ||
(playerHand === "✌️" && cpuHand === "✊") ||
(playerHand === "✋" && cpuHand === "✌️")
  ){
    result = "負け";
    console.log(result);
    $(".game-start").text("残念!!");
    clearInterval(timerId);
  } 
    // 結果を画面に表示
  $(".result").text(result);
  $(".janken-display").text(cpuHand);   
  });

// 4.ゲームをリセットする。
$(".game-reset").on("click", function(){
    $(".game-start").text("スタート");
    location.reload(); // 画面リロード
    $(".result").text("");
})

//   // --- [追加11/4(水)] マスを順番に光らせる演出関数 ---
// function roulette() {
//   var count = 0;       // 今何回光ったかを数える（速度や終了の判定用）
//   var currentNum = 1;  // 今光っている data-payout の番号（1〜12）
  
// // これにより、最終的に止まる位置が毎回完全にランダムになります！
//   var steps = Math.floor(Math.random() * 12) + 24; 

//   // 0.05秒（50ミリ秒）ごとに高速で光るマスを移動させる
//   var effectTimer = setInterval(function() {
    

//     // 1. 一旦すべてのマスの光（activeクラス）を消す
//     $(".square-item").removeClass("active");
    
//     // 2. 今の番号（currentNum）のマスだけを光らせる
//     $(`.square-item[data-payout="${currentNum}"]`).addClass("active");
    
//     // 3. 次のために番号を1進める。12の次は1に戻るようにループ処理
//     // （currentNum % 12）に1を足すと、1→2→...→12→1→2 ときれいにループします
//     currentNum = (currentNum % 12) + 1;
    
//     count++;
    
//     // 4. 36回光ったら（12マス × 3周 ＝ 3周分回ったら）タイマーを止める
//  // 🎲 あらかじめランダムで決めた回数（totalSteps）に達したらストップ！
//     if (count >= steps) {
//       clearInterval(effectTimer);
      
//       // 次の currentNum を決める計算の手前で止まっているので、
//       // 実際に最後に光ったマスの番号（1〜12）がこれで正確に取得できます
//       var finalWinNum = $(`.square-item.active`).attr("data-payout");
      
//       // 結果を画面に追加で表示（例）
//       $(".junken-display").append(`<br>【当選番号：${finalWinNum}番】`);
//     }
    
//   }, 50); // 50ミリ秒 ＝ 超高速（0.05秒）
// }
