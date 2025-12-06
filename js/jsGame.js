// localStorage.removeItem("bashy123456789Marks");

const idInput = document.querySelector("#id");//קבלת מ''ז
const nameInput = document.querySelector("#name");//קבלת שם משתמש
const button = document.querySelector("#notDisplay");//קבלת כפתור השליחה 
const para = document.querySelector('#p');//קבלת הטקסט של הכנסת נתונים נכונים

const idPattern = /^\d{9}$/;//שיכיל  מספרים בלבד עד 9 ספרות
const namePattern = /^[A-Za-zא-ת]{1,}$/;//שיכיל אותיות אנגלית עברית בלבד

//input פונקציה לבדיקה ע''י מאזין על כל 
//  אם הערכים כרגע נכונים
//ואם הכפתור יכול להיות נלחץ
function checkInputs() {
    const id = idInput.value;
    const name = nameInput.value;

    //אם הם נכונים לפי התבנית למעלה
    if (idPattern.test(id) && namePattern.test(name)) {
        button.disabled = false;//כפתור לחיץ
        para.style.display = 'none';//הכיתוב מוסר

          }


    else {
        button.disabled = true;//לא לחיץ
        para.style.display = 'block';//הכיתוב נשאר
    }
}

// מאזינים לקלט בשני השדות
idInput.addEventListener("input", checkInputs);
nameInput.addEventListener("input", checkInputs);

button.addEventListener("click", function(e) {
  e.preventDefault(); // מונע שליחת הטופס
  const name = nameInput.value;
  const id = idInput.value;

  // שמירת שם משתמש
  localStorage.setItem("username", name);
  localStorage.setItem("userId", id);

  //בסוף מעביר לעמ' הבא - השלבים
  location.href = "html/levels.html";
});

