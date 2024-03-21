
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
        console.error('Kurskoden existerar redan. Försök igen med en annan kod.')
        return;
    }

    //Lägg till kursen till listan
    courses.push(course);

    // Uppdatera localStorage med den nya listan
    localStorage.setItem('courses', JSON.stringify(courses));
    console.log('Lagt till kurs i listan');
}

// Visar kurser på webbplatsen
function displayCourse(course: CourseInfo): void {
    
    if (courseList) {
        courseList.innerHTML += `
        <li> Kod: ${course.code}, Namn: ${course.name}, Progression: ${course.progression}, Syllabus: ${course.syllabus}
        </li>
        `
    }
}
// Skickar med data till de andra funktionerna, nollställer värde
document.getElementById('addCourseForm')?.addEventListener('submit', (e) => {
    e.preventDefault();

    /* Skapa ett nytt objekt */
    const newCourse: CourseInfo = {
        code: codeInputEl.value,
        name: nameInputEl.value,
        progression: progInputEl.value,
        syllabus: syllabusInputEl.value
    }
    //Kör funktioner och skickar med newCourse
    addCourse(newCourse);
    displayCourse(newCourse);

    // Återställ formulärfälten till deras ursprungliga värden
    codeInputEl.value = '';
    nameInputEl.value = '';
    progInputEl.value = 'A';
    syllabusInputEl.value = '';
});

//Funktion för att ladda in sparade kurser från localStorage
function loadCourses(): CourseInfo[] {
    return JSON.parse(localStorage.getItem('courses') || '[]');
}

// Funktion för att ladda in alla kurser vid initialisering
function initializePage(): void {
    const savedCourses = loadCourses();

    // Visa alla sparade kurser på webbplatsen
    savedCourses.forEach(course => {
        displayCourse(course);
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
}

// Kör initializePage när sidan laddas
initializePage();