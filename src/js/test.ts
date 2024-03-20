
// Deklaration av variabler
const codeInputEl = document.getElementById("code") as HTMLInputElement;
const nameInputEl = document.getElementById("name") as HTMLInputElement;
const progInputEl = document.getElementById("progression") as HTMLInputElement;
const syllabusInputEl = document.getElementById("syllabus") as HTMLInputElement;

// Interface for course information
interface CourseInfo {
    code: string;
    name: string;
    progression: string;
    syllabus: string;
}

//Funktion för att lägga till en ny kurs
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
    const courseList = document.getElementById("courseList");

    if (courseList) {
        courseList.innerHTML += `
        <li> Kod: ${course.code}, Namn: ${course.name}, Progression: ${course.progression}, Syllabus: ${course.syllabus}
        </li>
        `
    }
}

document.getElementById('addCourseForm')?.addEventListener('submit', (e) => {
    e.preventDefault();

    /* Skapa ett nytt objekt */
    const newCourse: CourseInfo = {
        code: codeInputEl.value,
        name: nameInputEl.value,
        progression: progInputEl.value,
        syllabus: syllabusInputEl.value
    }

    addCourse(newCourse);
    displayCourse(newCourse);

    // Återställ formulärfälten till deras ursprungliga värden
    codeInputEl.value = '';
    nameInputEl.value = '';
    progInputEl.value = 'A';
    syllabusInputEl.value = '';
});
