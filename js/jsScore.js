
//שליפת שם משתמש
let userName = localStorage.getItem("username");

//שליפת מ''ז
let userId = localStorage.getItem("userId");

//שליפת מערך ציונים 
let stageResults = JSON.parse(localStorage.getItem(`${userName} + ${userId} + marks`));
//console.log(stageResults);

//העתקה למערך ממוין לפי ציונים
const sorted = stageResults
  .filter(item => item)//הכנסת אלו ששונים מnull בברירת מחדל זה מה שעושה
  .sort((a, b) => b.score - a.score);//מיון לפי הגובה
//console.log(sorted);



//הוספת שם המשתמש בראש הטבלה
document.querySelector(".title-name").innerText = userName;

//שליפת גוף טבלת השורות
let tBody = document.querySelector("#scoreBody");

//לולאה להכנסת הנתונים לטבלה
for (let i = 0; i < sorted.length; i++) {
    //בתנאי שהמקום במערך אינו ריק
    if (sorted[i] != null){
        //יצירת TR שורה
        let tr = document.createElement('tr');

        //יצירת TD תא
        let tdLevel = document.createElement('td');
        tdLevel.textContent = sorted[i].level;
        tdLevel.classList.add("data-label");

        //כנ''ל -תא
        let tdSpeed = document.createElement('td');
        tdSpeed.textContent = sorted[i].lettersPerSecond;
        tdSpeed.classList.add("data-label");

        //כנ''ל-תא
        let tdAccuracy = document.createElement('td');
        tdAccuracy.textContent = sorted[i].accuracy;
        tdAccuracy.classList.add("data-label");

        //כנ''ל-תא
        let tdMark = document.createElement('td');
        tdMark.textContent = sorted[i].score;
        tdMark.classList.add("data-label");

        //כנ''ל-תא
        let tdDelete = document.createElement('td');
        tdDelete.classList.add('delete-col');



        // יצירת כפתור מחיקה
        let btnDelete = document.createElement('button');
        btnDelete.classList.add('delete-button');
        btnDelete.setAttribute('aria-label', 'מחק שורה');
        btnDelete.addEventListener('click', () => {
            let index = sorted[i].level;//מציאת הרמה במערך הממוין כדי למחוק לפיו מהמערת המקורי)
            stageResults[index] = null; // מוחק איבר אחד במיקום i
            localStorage.setItem(`${userName} + ${userId} + marks`, JSON.stringify(stageResults));//שמירה לאחר השינוי
            location.reload();//רענון העמוד כדי שהטבלה תתעדכן

        });

        // הוספת אייקון 
        btnDelete.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="20" height="20">
            <path d="M3 6h18v2H3V6zm2 3h14l-1.5 12.5a1 1 0 0 1-1 .5H8a1 1 0 0 1-1-.5L5 9zm4 2v7h2v-7H9zm4 0v7h2v-7h-2z"/>
        </svg>
        `;

        // הוספת הכפתור לתא
        tdDelete.appendChild(btnDelete);

        //הכנסתו בתור ילדים לאלמנט TR שנוצר
        tr.append(tdLevel);
        tr.append(tdSpeed);
        tr.append(tdAccuracy);
        tr.append(tdMark);
        tr.append(tdDelete);
        //הכנסת TR לטבלה
        tBody.append(tr);
    }
}

