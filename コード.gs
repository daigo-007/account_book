var CHANNEL_ACCESS_TOKEN = 'アクセストークン'

function doPost(e) {
//  Logger.log('in');
  // JSONをパース
  var reply_token = JSON.parse(e.postData.contents).events[0].replyToken;
  var user_message = JSON.parse(e.postData.contents).events[0].message.text;
  //  現在時刻を取得  
  var now = new Date();
  var now_h = now.getHours();
  var now_min = now.getMinutes();
  var now_mon = now.getMonth() + 1;
  var now_d = now.getDate();
  var now_y = now.getFullYear();
  /**************************************/
  var ss = SpreadsheetApp.getActiveSpreadsheet();       //  スプレッドシートを取得 
  var sheet = ss.getSheetByName('book');
  var count = sheet.getRange(1,7).getValue();                      //  最新の行数を取得  
  var balance = sheet.getRange(count,5).getValue();                //  残高を取得 
  //  コマンド
  var income = "in\/";                                 //  収入があったとき
  var spend = "out\/";                                 //  支出があったとき
  var check = "check\/";                                 //  残高を確認したいとき
  var command = "help\/";                               //　コマンドを確認したいとき*/
  // 送信されてきたメッセージを取得
  var get_message = user_message.split('/');
  var money;
  var today = now_y + "\/" + now_mon + "\/" + now_d;
  if(get_message.length == 2){
    money = get_message[1];
  }
  // 返信するためのトークンを取得
  if (typeof reply_token === 'undefined') {
    return;
  }
  // 返信するメッセージを配列で用意する
  var reply_messages;
 
  
    // 「ヘルプ」と入力されたときの返信メッセージ

   if (user_message.indexOf(income) == 0) {                     //収入
      balance += parseInt(money);
      sheet.getRange(count + 1, 3).setValue(money);
      sheet.getRange(count + 1, 5).setValue(balance);
      reply_messages = money + "円の収入がありました";
      sheet.getRange(count + 1, 2).setValue(today);
      sheet.getRange(1,7).setValue(count+1);
  } else if (user_message.indexOf(spend) == 0) {　　　　　　　　　　　　　//支出
      balance -= parseInt(money);
      sheet.getRange(count + 1, 4).setValue(money);
      sheet.getRange(count + 1, 5).setValue(balance);
      reply_messages = money + "円払いました";
      sheet.getRange(count + 1, 2).setValue(today);
      sheet.getRange(1,7).setValue(count+1);
  } else if (user_message.indexOf(check) == 0) {
      reply_messages = "残高は、" + balance + "円です。";
  } else if (user_message.indexOf(command) == 0) {
    reply_messages = "in/:収入\nout/:支出\ncheck/:残高を確認する";
  }
  else{
    reply_messages = "無駄話はやめてください";
  }
  // メッセージを返信
  var line_url = 'メッセージの返信先';
 
  UrlFetchApp.fetch(line_url, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': reply_token,
      'messages': [{
        'type': 'text',
        'text': reply_messages,
      }],
    }),
   });
  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}

