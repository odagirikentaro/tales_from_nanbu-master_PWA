const coefs = coefReader();
function coefReader() {
    let coefs = {};
    fetch('coefficients.csv')
        .then(response => response.text()) //レスポンスデータを取得
        .then(data => {
            // 改行文字でCSVデータを分割
            const lines = data.split('\n');      //splitで文字列を分割

            // ヘッダー行を解析して列名を取得　キャラクター,問1,問2,問3
            const headers = lines[0].split(',');


            // 各行のデータを処理 1つ目のキャラクターから始める
            for (let i = 1; i < lines.length; i++) {
                let values = lines[i].split(',');
                let character = values[0]; //キャラクター名

                // キャラクターごとのデータを初期化
                coefs[character] = {};

                // 列ごとのデータを代入　問1から問3まで
                for (let j = 1; j < headers.length; j++) {
                    let columnName = headers[j];
                    let value = parseInt(values[j]); // 文字列から数値に変換　数値「0,3,1」など

                    coefs[character][columnName] = value;
                }
            }
        })
        .catch(error => {
            console.error('データを取得できませんでした: ', error);
        });
    return coefs;
}


//csv読み込み
const questions = queReader();
function queReader() {
    let questions = [];
    fetch('questions.csv')
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n');
            for (let i = 1; i < lines.length; i++) {
                let values = lines[i].split(',');
                //let number = parseInt(values[0]); // 数値に変換
                let number = values[0];
                let text = values[1];

                // データをオブジェクトとして配列に追加
                questions.push({ "number": number, "text": text });
            }
            //console.log(questions);
        })
        .catch(error => {
            console.error('データを取得できませんでした: ', error);
        });
    return questions;
}


const tales = talesReader();
function talesReader() {
    let tales = [];
    fetch('tales.csv')
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n');
            for (let i = 1; i < lines.length; i++) {
                let values = lines[i].split(',');
                let nanbuTales = values[0];
                let character = values[1];
                let image = values[2];
                let explanation = values[3];
                let synopsis = values[4];
                let features = values[5];

                // データをオブジェクトとして配列に追加
                tales.push({ "昔ッコ": nanbuTales, "キャラクター": character, "画像": image, "解説": explanation, "あらすじ": synopsis, "特徴": features });
            }
            //console.log(tales);
        })
        .catch(error => {
            console.error('データを取得できませんでした: ', error);
        });
    return tales;
}

function btnLoad() {
    //const startbtn = document.querySelector(".startoption");
    startbtn.classList.add("fadeIn");
}

//3つの処理が終わってからスタートボタン表示
Promise.all([coefReader(), queReader(), talesReader()])
    .then(() => {
        console.log(coefs);
        console.log(questions);
        console.log(tales);
        btnLoad();
    })
    .catch(error => {
        console.error('処理でエラーが発生しました: ', error);
        alert('処理でエラーが発生しました');
    });

//---------------------------------------------------------------


const qnumber = document.getElementById("qnumber");     //番号
const qtext = document.getElementById("qtext");   //質問文

const choice = document.querySelector(".choices");   //3つの選択肢
const nextbox = document.querySelector(".nextbox");  //次へのハコ

const startbtn = document.querySelector(".startoption"); //始めるのハコ
const option = document.querySelector(".option");    //オプションのハコ
const next = document.getElementById("next"); //次へ　タイトル　ボタン
const file_area = document.getElementById("file_area"); //結果画像エリア

const synopsisbtn = document.querySelector(".synopsisbtn"); //あらすじボタン
const back = document.getElementById("back");
const taleTypebtn = document.querySelector(".taleTypebtn"); //タイプボタン
const taleType = document.getElementById("taleType");
const featurebtn = document.querySelector(".featurebtn"); //特徴ボタン
const feature = document.getElementById("feature");
const resultBtn = document.querySelector(".resultBtn"); //あらすじ　タイプ　特徴

const optionbox = document.querySelector(".optionbox");
const showbtn = document.querySelector(".showbtn");


//タイトル画面
function startGame() {
    startbtn.addEventListener("click", () => {
        choice.classList.add("fadeIn");
        option.classList.add("fadeIn");
        startbtn.classList.remove("fadeIn");
        cnt++;
        SetText(0);
        console.log("カウントは" + cnt);
    });
}

//スタート動作
startGame();
let cnt = 0;
let Answers = {};         //回答内容
let resultSentence = {};  //結果画面で表示されるキャラクターに関するテキスト
let i = 0;                //結果画面の状態
//back.addEventListener('click', showExplanation());


function SetText(cnt) {
    qnumber.innerHTML = questions[cnt].number;
    qtext.innerHTML = questions[cnt].text;
}

//もどる
function Return() {


    //再読み込み
    if (cnt === 1) {
        location.reload();
    }


    cnt = cnt - 1;
    SetText(cnt - 1);
    //alert(cnt);


    //const jsonObject = JSON.parse(serializedArray);
    //let myScore = localStorage.getItem("score");
    //let aaa = localStorage.saveKey;

    
    let myScore = localStorage.getItem("score");
    let Answers = JSON.parse(myScore);
    
    
    console.log(Answers["問" + cnt + ""]);
    const val2choice = { "1": "yes", "0": "neither", "-1": "no" };
    let choice2 = val2choice[Answers["問" + cnt + ""]]; //yesかnoかneither
    console.log(choice2);


    let form = document.getElementById(choice2); //選択を再現
    form.checked = true;


    delete Answers["問" + cnt + ""];
    
    let serializedArray = JSON.stringify(Answers);
    localStorage.setItem("score", serializedArray);
    

    console.log(Answers);
    console.log("カウントは" + cnt);

    //結果画面から「もどる」を選択したとき
    if (cnt === 10) {

        next.innerHTML = "つぎへ";
        choice.classList.add("fadeIn");
        file_area.removeChild(file_area.firstElementChild); //追加された画像を消す
        file_area.style.display = "block";

        //修正
        resultBtn.classList.remove("fadeIn");
        taleTypebtn.classList.remove("visible");
        synopsisbtn.classList.remove("visible");
        featurebtn.classList.remove("visible");
    }

}



function checkForm() {
    const form = document.getElementById("myForm");

    let selectedValue = form.querySelector('input[name="answer"]:checked');

    if (selectedValue) {
        let checkedValue = selectedValue.value;
        Answers["問" + cnt] = checkedValue;
        console.log(Answers); //Answerに値を
    }

}


//「つぎへ」を押したときフォーム取得
function getSelectedValue() {


    // フォーム要素を取得
    const form = document.getElementById("myForm");

    // ラジオボタン要素のNodeListを取得
    const radioButtons = form.elements.answer;

    let selectedValue = null;

    // NodeList内のラジオボタンをループ
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            selectedValue = radioButton.value;
            break;  // 選択値が見つかったらループを抜ける
        }
    }




    if (selectedValue !== null) {


        //選択した値をAnswersに
        //i++;

        Answers["問" + cnt] = selectedValue;


        
        let serializedArray = JSON.stringify(Answers);
        localStorage.setItem("score", serializedArray);
        let myScore = localStorage.getItem("score");
        console.log(myScore);
        
        console.log(Answers["問" + cnt + ""]);
        console.log(Answers);

        //alert("選択した値は: " + myScore);

        //alert(cnt);

        //問題を変える　
        if (cnt < questions.length) {
            SetText(cnt);
            cnt++;
            console.log("カウントは" + cnt);

            //ラジオボタンを未選択状態にする
            if (Answers["問" + cnt + ""] == null) {
                const radioGroup = document.getElementsByName('answer');
                radioGroup.forEach(radioButton => {
                    radioButton.checked = false;
                });
            } else {
                const val2choice = { "1": "yes", "0": "neither", "-1": "no" };
                let choice2 = val2choice[Answers["問" + cnt + ""]]; //yesかnoかneither
                console.log(choice2);
                let form = document.getElementById(choice2); //選択を再現
                form.checked = true;
            }

        } else if (cnt == questions.length + 1) {
            //結果画面で「つぎへ」ボタン（タイトルへ）を押すと再読み込み
            location.reload();
        } else {
            //10問目で「つぎへ」を押すと結果表示
            cnt++;
            let maxCharacter = caluculate();
            resultSet(maxCharacter);
            i = 0; //リザルトの表示
            //back.addEventListener('click', {name:maxCharacter, handleEvent:showExplanation});
            console.log(cnt);
        }
    } else {
        alert("何も選択されていません。");
    }
}






function caluculate() {


    let result = {}; // coefsと同じ形

    //coefsキャラ分繰り返す
    for (let character in coefs) {
        result[character] = {};
        for (let score in coefs[character]) {
            result[character][score] = coefs[character][score] * Answers[score];
        }
    }
    console.log(result);


    let totalResult = {};

    for (let character in result) {
        totalResult[character] = 0; // 各キャラクターの合計を初期化
        for (let Rscore in result[character]) {
            totalResult[character] += result[character][Rscore]; // 合計に値を加算
        }
    }
    console.log(totalResult);


    let maxValue = -Infinity; // 最大値の初期値をマイナス無限大に設定
    let randomResult = [];

    for (let character in totalResult) {
        if (totalResult[character] > maxValue) {
            //randomResult.push(character);
            maxValue = totalResult[character]; //最大値更新
        }
    }

    console.log(maxValue);

    for (let character in totalResult) {
        if (totalResult[character] === maxValue) {
            randomResult.push(character);
        }
    }


    console.log(randomResult);
    let maxCharacter = randomResult[Math.floor(Math.random() * randomResult.length)];

    alert(maxCharacter);
    //qnumber.innerHTML = "あなたは「" + maxCharacter + "」タイプ";
    //resultSet(maxCharacter); // キャラクターの解説
    return maxCharacter;
}




//結果表示
function resultSet(maxCharacter) {
    const characterName = maxCharacter;
    let explanation = "";
    let Rimage = "";
    let nanbuTales = "";
    let synopsis = "";
    let features = "";
    for (const character of tales) {
        if (character["キャラクター"] === characterName) {
            explanation = character["解説"];
            Rimage = character["画像"];
            nanbuTales = character["昔ッコ"];
            synopsis = character["あらすじ"];
            features = character["特徴"];
            resultSentence = {
                maxCharacter: maxCharacter,
                explanation: explanation,
                nanbuTales: nanbuTales,
                synopsis: synopsis,
                features: features
            };
            break;
        }
    }

    //画像のスペースを作る
    fetch(`images/${encodeURIComponent(Rimage)}`)
        .then(response => response.blob())
        .then(data => {

            const file_area = document.getElementById("file_area");
            const img_element = document.createElement("img");

            img_element.src = URL.createObjectURL(data);
            file_area.appendChild(img_element);

        });

    //～タイプを表示
    qnumber.innerHTML = "あなたは「" + maxCharacter + "」タイプ";
    qtext.innerHTML = explanation; //タイプの解説
    choice.classList.remove("fadeIn");

    //修正
    resultBtn.classList.add("fadeIn");
    featurebtn.classList.add("visible"); //特徴ボタンを表示
    synopsisbtn.classList.add("visible"); //あらすじボタンを表示
    //nextbox.classList.add("fadeOut");
    next.innerHTML = "タイトルへ";

    //「どんな話」を押したとき
    back.addEventListener('click', function () {

        //昔話のカウント 
        i = 1;
        qnumber.innerHTML = nanbuTales;
        qtext.innerHTML = synopsis;
        synopsisbtn.classList.remove("visible");
        taleTypebtn.classList.add("visible"); //「どんなタイプ」
        featurebtn.classList.add("visible"); //「どんなキャラ」
    }, false);

    //「どんなキャラ」を押したとき
    feature.addEventListener('click', function () {

        //特徴のカウント 
        i = 2;
        qnumber.innerHTML = maxCharacter;
        qtext.innerHTML = features;
        featurebtn.classList.remove("visible");
        taleTypebtn.classList.add("visible"); //「どんなタイプ」
        synopsisbtn.classList.add("visible"); //「どんな話」
    }, false);

    //「どんなタイプ」を押したとき
    taleType.addEventListener('click', function () {

        i = 0;
        qnumber.innerHTML = "あなたは「" + maxCharacter + "」タイプ";
        qtext.innerHTML = explanation;
        taleTypebtn.classList.remove("visible");
        synopsisbtn.classList.add("visible"); //「どんな話」
        featurebtn.classList.add("visible"); //「どんなキャラ」
    }, false);
}

/*
const Inquiry = {
    qnumber: "お問い合わせ",
    text: "<a href="https://creatorquest.jp/">CreatorQuest</a>へ"
}
*/

const PP = {
    number: "プライバシーポリシー",
    text: "本アプリでは診断のために回答データを使用しています。<br>回答データはアプリを終了した場合とタイトルに戻った場合にリセットされています。<br>その他のデータは取得や保存はしていません。"
}


//プライバシーポリシーをおしたとき
function showSentence(sentence) {
    console.log(cnt);
    console.log(resultSentence);
    console.log(questions.length);
    qnumber.innerHTML = sentence.number;
    qtext.innerHTML = sentence.text;
    optionbox.classList.add("fadeOut"); //はじめる、もどる、次へ
    choice.classList.remove("fadeIn"); //はい～～
    showbtn.classList.add("fadeIn");

    if (cnt == questions.length + 1) {
        file_area.style.display = "none";
        //修正
        resultBtn.classList.remove("fadeIn");
        /*
        synopsisbtn.classList.remove("fadeIn");
        taleTypebtn.classList.remove("fadeIn");
        featurebtn.classList.remove("fadeIn");
        */
    }
    //お問い合わせの「もどる」をクリック
    showbtn.addEventListener("click", () => {
        qnumber.innerHTML = "南部昔ッコ診断";
        qtext.innerHTML = "10コの簡単な質問に答えて、八戸地方の有名な昔話（昔ッコ）の登場人物との相性を診断してみましょう。";
        optionbox.classList.remove("fadeOut"); //はじめる、もどる、次へ
        showbtn.classList.remove("fadeIn");

        if (cnt <= questions.length) {
            qnumber.innerHTML = questions[cnt - 1].number;
            qtext.innerHTML = questions[cnt - 1].text;
            choice.classList.add("fadeIn"); //はい～～
        } else if (cnt == questions.length + 1 && i == 0) {
            //解説の画面
            console.log("解説");
            qnumber.innerHTML = "あなたは「" + resultSentence["maxCharacter"] + "」タイプ";
            qtext.innerHTML = resultSentence["explanation"]; //解説を表示
            resultBtn.classList.add("fadeIn");
            synopsisbtn.classList.add("visible");
            featurebtn.classList.add("visible");
            file_area.style.display = "block";
        } else if (cnt == questions.length + 1 && i == 1) {
            //昔話の画面
            console.log("昔話");
            qnumber.innerHTML = resultSentence["nanbuTales"];
            qtext.innerHTML = resultSentence["synopsis"]; //あらすじを表示
            resultBtn.classList.add("fadeIn");
            taleTypebtn.classList.add("visible");
            featurebtn.classList.add("visible");
            file_area.style.display = "block";
        } else if (cnt == questions.length + 1 && i == 2) {
            //特徴の画面
            console.log("特徴");
            qnumber.innerHTML = resultSentence["maxCharacter"];
            qtext.innerHTML = resultSentence["features"]; //特徴を表示
            resultBtn.classList.add("fadeIn");
            taleTypebtn.classList.add("visible");
            synopsisbtn.classList.add("visible");
            file_area.style.display = "block";
        }
    });
}


