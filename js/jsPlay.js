//מערך דו מימדי שכולל את האותיות שצריך לכל רמה בהתאמה
const levelsData = [
  [" "], 
  ["ח", "כ"],
  ["ג", "ל"],
  ["ד", "ש", " "],
  ["ע", "י"],
  ["נ", "מ"],
  ["ת", "ב"],
  ["צ", "ק", " "],
  ["ס", "ט"],
  ["ה", "ו"],
  ["א", "פ", " "],
  ["ר", "ף"],
  ["ם"], 
  ["ץ"], 
  ["ן"],
  [" "]
];

//הגדרת משתנים לטקסט המשחק
//לשלב רגיל
let stringPlay = "";
//לשלב 16 טקסט חופשי
let userText = "";


//קבלת מספר הרמה מהURL ורמת הקושי
const params = new URLSearchParams(location.search);
let level = parseInt(params.get("id"));//רמה
let textLength = parseInt(params.get("difficulty"));//רמת קושי 

//שליפת שם משתמש
let userName = localStorage.getItem("username");

//שליפת מ''ז
let userId = localStorage.getItem("userId");

// שליפת תוצאות של שלבים
let stageResults = JSON.parse(localStorage.getItem(`${userName} + ${userId} + marks`)) || [];

// השלמת המערך ל־16 תאים עם null אם חסרים
for (let i = 0; i <= 16; i++) {
  if (typeof stageResults[i] === 'undefined') {
    stageResults[i] = null;
  }
}

//=============================
//הפעלת המשחק
Play(level);
//==============================


function Play(level){
  //ברמה 16 אין צורך במחרוזת
  if (level != 16){
    //מחרוזת מוכנה למשחק
    stringPlay = generateString(level, levelsData, textLength);
  }
  //במצב של שלב 16
  else{
    do {
      stringPlay = prompt("הכנס טקסט בעברית בלבד");
    } while(isHebrow() || (isHebrow() == false && isClear()));
    stringPlay = stringPlay.trim().replaceAll("  "," ");//אם יש 2 רווחים
  }

  //משתנה לשמירת מס טעויות שעשה המשתמש
  let mistakeRef = { value: 0 };
  //התחלת טיימר
  startTime = Date.now();
  //משתנה לשמירה איפה אוחז ההקלדה
  currentIndex = 0; 
  //הטמעה ראשונית של המחרוזת במסך
  updateDisplay();
  //בדיקה אם האות שהוקלדה שווה לאות המודגשת
  window.addEventListener("keydown", event => pressMatch(event, mistakeRef));
}



//פונקצייה ליצירת מחרוזת

function generateString(level, levelsData, textLength){
   const allLetters = [];//מערך שיחזיק את כל האותיות שצריכות להיות ברמה זו


  //צבירת כל האותיות למערך זה
   for (let index = 0; index <= level; index++) {
    allLetters.push(...levelsData[index]);
   }

   // : יצירת מחרוזת רנדומלית באורך 50
   let resultString = "";
   for (let i = 0; i < textLength; i++) {
    const randomIndex = Math.floor(Math.random() * allLetters.length);//מס' רנדומלי בטווח של אורך המערך של אותיות שצריכות להיות ברמה
    const letter = allLetters[randomIndex];//בחירת האות המוגרלת מתוך המערך של האותיות

    //בדיקה אם אין 2 רווחים רצופים או רווח בתחילה או בסןף
    if (
      !(i === 0 && letter === " ") &&
      !(i > 0 && resultString[i - 1] === " " && letter === " ") &&
      !(i === textLength - 1 && letter === " ")
    ) {
    resultString += letter;//שרשור למחרוזת
    
    } else {
      i--; //אם מצא רווח בתחילהאו בסוף או רצופים
    }
}


   return resultString;
}


//עדכון במסך לפי מיקום המשתמש במשחק
function updateDisplay(){
  const container = document.querySelector('.before');
  if (currentIndex >= stringPlay.length) {
    // הגענו לסוף, מציגים את כל המחרוזת בלי הדגשה
    container.innerHTML = stringPlay;
  } else {
    let html = "";
    for(let i = 0; i < stringPlay.length; i++){
      if(i === currentIndex){
        // האות המודגשת - עטוף בspan עם קלאס הדגשה
        html += `<span class="big-letter">${stringPlay[i]}</span>`;
      } else {
        html += stringPlay[i];
      }
    }
    container.innerHTML = html;
  }
}

//פונקציה לבדיקה עם ההקשה נכונהובודקת גם אם המשתמש סיים לשחק רמה מסוימת
function pressMatch(event, mistakeRef) {
  if (event.key === stringPlay[currentIndex]) {//אם הקשה נכונה
    currentIndex++;
    const audioRight = new Audio('../audio/puin_low.mp3');
    audioRight.play();//הפעלת צליל על הקשה נכונה
    if (currentIndex == stringPlay.length){//אם סיים מחרוזת
      updateDisplay();
      //סיום טיימר
      const endTime  = Date.now();
      const time = Math.round((endTime - startTime) / 1000);
      //שליחה ליצרת אובייקט ציון
      const mark = createMark(time, mistakeRef);

      // שליחה להצגה של לוח ציון שלבי
      finishTablePerLevel(mark);
      }
    else   //עדיין באמצע השלב
      updateDisplay();
    }
  else{ //אם היה טעות
    mistakeRef.value++;
    const audioError = new Audio('../audio/error.mp3');
    audioError.play();//הפעלת צליל טעות
    document.querySelector("#border").classList.add("red_border");
    // טיימר שיכבה את המסגרתהאדומה
    let timer = setTimeout(() => {
      removeBorder();
    }, 350);

  }
}

//יצירת אובייקט של ציון שישמור רמה ,ציון,מהירות...
function createMark(time, mistakeRef){
//ממוצע כמה זמן לאות
const lettersPerSecond = stringPlay.length / time;
//כמה הצליח לדייק באחוזים
const accuracy = Math.max(0, (stringPlay.length - mistakeRef.value) / stringPlay.length); // ערך בין 0 ל־1
//ציון סופי
const score = Math.round(lettersPerSecond * 100 * accuracy);

  return {
    level,
    lettersPerSecond,
    accuracy,
    score,
  }

}

//הצגת טבלת תוצאות משחק לפי רמה בודדת
function finishTablePerLevel(mark){
    //console.log(stageResults);
    //הזרקת הנתונים לאלמנטים בטבלה
    document.getElementById('td-level').innerText = mark.level;
    document.getElementById('td-speed').innerText = mark.lettersPerSecond;
    document.getElementById('td-accuracy').innerText = mark.accuracy;
    document.getElementById('td-mark').innerText = mark.score;

    //הצגת הטבלה שהייתה מוסתרת עד עכשיו
    document.getElementById('popup-overlay').style.display = 'flex';

    //שמירת הרמה במערך להצגה בהמשך בטבלאת תוצאות
    saveMarkPerLevel(mark);
}


//שמירת נתונים
function saveMarkPerLevel(mark){
  if (level != 16)
    stageResults[level] = mark;
  //שמירת הנתונים בלוקל סטוראז
  localStorage.setItem(`${userName} + ${userId} + marks`, JSON.stringify(stageResults));
}

//להעברה דינאמית לרמה הבאה בלחיצה על הכפתור שיהיה בלוח הפופאפ
const nextLevel = level + 1;
const link = document.querySelector(".link-button-next");
link.href = `play.html?id=${nextLevel}&difficulty=${textLength}`;//בברירת מחדל מעביר את רמת הקושי שנבחרה לפני כן
if (nextLevel > 15)
  link.style.display = "none";


//בדיקה אם הטקסט מכיל מילים פוגעניות
function isClear(){
  if (stringPlay.includes("גרוע") || stringPlay.includes("מסריח") || stringPlay.includes("גועל") || stringPlay.includes("מטומטם")){
    alert("יש להכניס טקסט בלשון נקיה");
    return true;
  }
  return false;
}


//בדיקה אם הטקסט מכיל אותיות לא עבריות
function isHebrow(){
  for (let index = 0; index < stringPlay.length; index++) {
    if ((stringPlay[index]< 'א' || stringPlay[index]> 'ת') && stringPlay[index] != " "){
      alert("!!! יש להיכניס טקסט בעברית");
      return true;
    }
  }
  return false;
}

//מחיקת המסגרת
function removeBorder(){
  document.querySelector("#border").classList.remove("red_border");
}




