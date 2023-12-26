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
            // coefsオブジェクトにデータが格納される
            //console.log(coefs);
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
                const values = lines[i].split(',');
                //const number = parseInt(values[0]); // 数値に変換
                const number = values[0];
                const text = values[1];

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
    console.log("スタートボタン表示");
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
    });


const quiz = document.getElementById("qnumber");     //番号
const quiztext = document.getElementById("qtext");   //質問文
const choice = document.querySelector(".choices");   //3つの選択肢
const nextbox = document.querySelector(".nextbox");  //次へのハコ
const startbtn = document.querySelector(".startoption"); //始めるのハコ
const option = document.querySelector(".option");    //オプションのハコ
const next = document.getElementById("next"); //次へ　タイトル　ボタン
const file_area = document.getElementById("file_area"); //結果画像エリア
const explanationbox = document.querySelector(".explanationbtn"); //解説ボタン
const back = document.getElementById("back");
const taleTypebtn = document.querySelector(".taleTypebtn");
const taleType = document.getElementById("taleType");
const optionbox = document.querySelector(".optionbox");
const showbtn = document.querySelector(".showbtn");


//タイトル画面
function startGame() {
    startbtn.addEventListener("click", () => {
        choice.classList.add("fadeIn");
        option.classList.add("fadeIn");
        startbtn.classList.remove("fadeIn");
        cnt++;
        Set(0);
        console.log("カウントは" + cnt);
    });
}

//スタート動作
startGame();
let cnt = 0;
let Answers = {};
//let i = 0;
//back.addEventListener('click', showExplanation());


function Set(cnt) {
    quiz.innerHTML = questions[cnt].number;
    quiztext.innerHTML = questions[cnt].text;
}

//もどる
function Return() {


    //再読み込み
    if (cnt == 1) {
        location.reload();
    }


    cnt = cnt - 1;
    Set(cnt - 1);
    //alert(cnt);


    //const jsonObject = JSON.parse(serializedArray);
    //let myScore = localStorage.getItem("score");
    //let aaa = localStorage.saveKey;
    let myScor = localStorage.getItem("score");
    let Answers = JSON.parse(myScor);
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
    if (cnt == 10) {
        next.innerHTML = "つぎへ";
        choice.classList.add("fadeIn");
        file_area.removeChild(file_area.firstElementChild); //追加された画像を消す
        explanationbox.classList.remove("fadeIn");
        file_area.style.display = "block";
        taleTypebtn.classList.remove("fadeIn");
    }

}

//ラジオボタンクリックしたときの～～
/*document.querySelector('input[type="submit"]').addEventListener('click', function (event) {
    event.preventDefault();
});*/


function checkForm() {
    const form = document.getElementById("myForm");

    let selectedValue = form.querySelector('input[name="answer"]:checked');

    if (selectedValue) {
        let checkedValue = selectedValue.value;
        Answers["問" + cnt] = checkedValue;
        console.log(Answers); //Answerに値を
    }

}


//フォーム取得
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

        //alert("選択した値は: " + myScore);

        //alert(cnt);

        //問題を変える　
        if (cnt < questions.length) {
            Set(cnt);
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

            location.reload();
        } else {
            cnt++;
            let maxCharacter = caluculate();
            resultSet(maxCharacter);
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
    //quiz.innerHTML = "あなたは「" + maxCharacter + "」タイプ";
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
    for (const character of tales) {
        if (character["キャラクター"] === characterName) {
            explanation = character["解説"];
            Rimage = character["画像"];
            nanbuTales = character["昔ッコ"];
            synopsis = character["あらすじ"];
            break;
        }
    }

    fetch(`images/${encodeURIComponent(Rimage)}`)
        .then(response => response.blob())
        .then(data => {

            const file_area = document.getElementById("file_area");
            const img_element = document.createElement("img");

            img_element.src = URL.createObjectURL(data);
            file_area.appendChild(img_element);

        });

    quiz.innerHTML = "あなたは「" + maxCharacter + "」タイプ";
    quiztext.innerHTML = explanation;
    choice.classList.remove("fadeIn");
    //explanationbox.classList.remove("fadeOut"); //解説ボタンを表示
    explanationbox.classList.add("fadeIn");
    //nextbox.classList.add("fadeOut");
    next.innerHTML = "タイトルへ";

    back.addEventListener('click', function () {

        quiz.innerHTML = nanbuTales;
        quiztext.innerHTML = synopsis;
        explanationbox.classList.remove("fadeIn");
        taleTypebtn.classList.add("fadeIn");

    }, false);

    taleType.addEventListener('click', function () {

        quiz.innerHTML = "あなたは「" + maxCharacter + "」タイプ";
        quiztext.innerHTML = explanation;
        explanationbox.classList.add("fadeIn");
        taleTypebtn.classList.remove("fadeIn");


    }, false);
}






function showInquiry() {
    quiz.innerHTML = "お問い合わせ";
    quiztext.innerHTML = "0120";
    optionbox.classList.add("fadeOut"); //はじめる、もどる、次へ
    choice.classList.remove("fadeIn"); //はい～～
    showbtn.classList.add("fadeIn");
    showbtn.addEventListener("click", () => {
        quiz.innerHTML = "南部昔ッコ診断";
        quiztext.innerHTML = "10コの簡単な質問に答えて、八戸地方の有名な昔話（昔ッコ）の登場人物との相性を診断してみましょう。";
        optionbox.classList.remove("fadeOut"); //はじめる、もどる、次へ
        showbtn.classList.remove("fadeIn");
        if (cnt >= 1) {
            quiz.innerHTML = questions[cnt - 1].number;
            quiztext.innerHTML = questions[cnt - 1].text;
            choice.classList.add("fadeIn"); //はい～～
        }
    });
}

function showPP() {
    console.log("プライバシーポリシー");
}
