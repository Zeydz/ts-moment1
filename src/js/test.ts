// Deklarera en tom array för kurser, för att kunna göra en kontroll
let coursesCheck: CourseInfo[] = [];

// Deklaration av variabler
const codeInputEl = document.getElementById("code") as HTMLInputElement;
const nameInputEl = document.getElementById("name") as HTMLInputElement;
const progInputEl = document.getElementById("progression") as HTMLInputElement;
const syllabusInputEl = document.getElementById("syllabus") as HTMLInputElement;
const courseList = document.getElementById("courseList") as HTMLLIElement;

// Interface for course information
interface CourseInfo {
    code: string;
    name: string;
    progression: string;
    syllabus: string;
}

// Funktion för att lägga till en ny kurs
function addCourse(course: CourseInfo): void {
    //Ladda in sparade kurser från localStorage
    let courses: CourseInfo[] = JSON.parse(localStorage.getItem('courses') || '[]');

    if (courses.some(c => c.code === course.code)) {
        console.error('Kurskoden existerar redan. Försök igen med en annan kod.');
        return;
    }

    //Lägg till kursen till listan
    courses.push(course);

    // Uppdatera localStorage med den nya listan
    localStorage.setItem('courses', JSON.stringify(courses));
    console.log('Lagt till kurs i listan');
}

// Funktion för att visa en kurs med knappar för att ta bort och ändra
function displayCourse(course: CourseInfo): void {
    if (courseList) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
        <span>Kod: ${course.code}, Namn: ${course.name}, Progression: ${course.progression}, Syllabus: ${course.syllabus}</span><br>
        <button class="remove-btn" style="margin-top:15px;">Ta bort</button>
        <button class="edit-btn">Ändra</button>
        `;
        courseList.appendChild(listItem);

        // Lägg till eventlyssnare för knapparna
        const removeButton = listItem.querySelector('.remove-btn');
        const editButton = listItem.querySelector('.edit-btn');
        if (removeButton && editButton) {
            removeButton.addEventListener('click', () => {
                removeCourse(course);
                listItem.remove();
            });
            editButton.addEventListener('click', () => {
                editCourse(course);
            });
        }
    }
}

// Funktion för att ta bort en kurs från kurslistan och localStorage
function removeCourse(course: CourseInfo): void {
    let courses: CourseInfo[] = JSON.parse(localStorage.getItem('courses') || '[]');
    courses = courses.filter(c => c.code !== course.code);
    localStorage.setItem('courses', JSON.stringify(courses));
    coursesCheck = [];
}

// Funktion för att ändra en befintlig kurs
function editCourse(course: CourseInfo): void {
    console.log('Ändra kurs:', course);
}

// Skickar med data till de andra funktionerna, nollställer värde
document.getElementById('addCourseForm')?.addEventListener('submit', (e) => {
    e.preventDefault();

    // Skapa ett nytt objekt
    const newCourse: CourseInfo = {
        code: codeInputEl.value,
        name: nameInputEl.value,
        progression: progInputEl.value,
        syllabus: syllabusInputEl.value
    };

    // Återställ formulärfälten till deras ursprungliga värden
    codeInputEl.value = '';
    nameInputEl.value = '';
    progInputEl.value = 'A';
    syllabusInputEl.value = '';

    // Kontrollera om kurskoden redan finns i listan
    if (coursesCheck.some(course => course.code === newCourse.code)) {
        console.error('Kurskoden existerar redan. Försök igen med en annan kod.');
        alert('Kurskoden existerar redan. Försök igen med en annan kod.');
        return;
    }

    // Kör funktioner och skickar med newCourse ifall if-satsen inte stoppar
    addCourse(newCourse);
    displayCourse(newCourse);

    // Lägg till den nya kursen i kontrollarrayen som används för att inte lägga till dubbletter
    coursesCheck.push(newCourse);
});

// Funktion för att ladda in sparade kurser från localStorage
function loadCourses(): CourseInfo[] {
    return JSON.parse(localStorage.getItem('courses') || '[]');
}

// Funktion för att ladda in alla kurser vid initialisering
function initializePage(): void {
    const savedCourses = loadCourses();

    // Visa alla sparade kurser på webbplatsen
    savedCourses.forEach(course => {
        displayCourse(course);
        // Lägg till den nya kursen i kontrollarrayen som används för att inte lägga till dubbletter
        coursesCheck.push(course);
    });
}

// Eventlistener för att ta bort innehåll, kallar på funktion
document.getElementById('remove')?.addEventListener('click', () => {
    clearCourses();
})

// Funktion för att ta bort innehåll från skärm & localStorage
function clearCourses(): void {
    localStorage.removeItem('courses');
    const courseList = document.getElementById('courseList');
    if (courseList) {
        courseList.innerHTML = '';
    }
    // Återställ kontrollarrayen som används för att inte lägga till dubbletter
    coursesCheck = [];
}

// Kör initializePage när sidan laddas
initializePage();