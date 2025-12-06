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

//מציאת הרמות שעשו אותם
let levelsPlayed = stageResults
  .map((value, index) => value === null ? null : index)//אם נאל מכניס נאל אחרת אינדקס
  .filter(index => index !== null && index !=0 && index != 16)//שומר רק את המספרים(אלו שהיו מספרים לשעבר)
console.log(levelsPlayed);

//רמות ששיחקו בעבר נצבעים בכהה ואינם לחיצים
//עד שימחוק מהטבלה
let container = document.querySelector(".button-container");
for (let i = 0; i < levelsPlayed.length; i++) {
    let a = document.querySelector(`#level-${levelsPlayed[i]}`);//גישה לכפתור הספציפי לפי מה ששמור במערך 
    a.classList.add("played");
    a.addEventListener("click", function(e) {//מניעת לחיצה עליו
    e.preventDefault(); // מונע שליחת הטופס
    });
}

//סלקטור אוסף את הכפתורים
const radios = document.querySelectorAll('input[name="difficulty"]');

// מאזינים! לשינויים על כל רדיו
radios.forEach(radio => {
  radio.addEventListener('change', function(){
    updateLinks();//מעדכן כל הזמן את הכפתורים מה נבחר
  });
});

//עדכון לינקים לפי רמת קושי שנבחרה
function updateLinks() {
  let radioChoice = document.querySelector('input[name="difficulty"]:checked').value;
  const levelLinks = document.querySelectorAll('.level-box');//ריצה על כל הלינקים 
  levelLinks.forEach(link => {
    const url = new URL(link.href);//בלת לינק על בסיס הקיים
    url.searchParams.set('difficulty', radioChoice);//הוספת פרמטר - רמת קושי
    link.href = url.toString();//הכנסה ללינק בעמ'
  });
}

// מפעיל פעם אחת בתחילת הריצה
//"הברירת מחדל של הכפתורים הוא "קל
updateLinks();


