// Deklarera en tom array för kurser, för att kunna göra en kontroll ifall kurskod redan existerar
let coursesCheck: CourseInfo[] = [];

// Räknare för att kunna öka ID-värde
let nextId = 1;

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

// Funktion för att lägga till en ny kurs i localStorage
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
        //Skapa ett unikt ID för varje listelement som skapas. Detta för att kunna ändra datan senare
        const itemID = `course_${nextId++}`;

        const listItem = document.createElement('li');

        // Anger ID till LI-elementet
        listItem.id = itemID; 

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
                removeCourse(course, itemID);
                listItem.remove();
            });
            editButton.addEventListener('click', () => {
                editCourse(course, itemID);
            });
        }
    }
}

// Funktion för att ta bort en kurs från kurslistan och localStorage
function removeCourse(course: CourseInfo, itemID: string): void {
    let courses: CourseInfo[] = JSON.parse(localStorage.getItem('courses') || '[]');
    courses = courses.filter(c => c.code !== course.code);
    localStorage.setItem('courses', JSON.stringify(courses));
    coursesCheck = [];
}

// Funktion för att ändra en befintlig kurs
function editCourse(course: CourseInfo, itemID: string): void {
    // Visa ett formulär för redigering av kursinformationen
    const editForm = document.createElement('form');
    editForm.innerHTML = `
        <label for="editCode">Kurskod:</label>
        <input type="text" id="editCode" value="${course.code}" required>
        <label for="editName">Kursnamn:</label>
        <input type="text" id="editName" value="${course.name}" required>
        <label for="editProgression">Progression:</label>
        <select id="editProgression" required>
            <option value="A" ${course.progression === 'A' ? 'selected' : ''}>A</option>
            <option value="B" ${course.progression === 'B' ? 'selected' : ''}>B</option>
            <option value="C" ${course.progression === 'C' ? 'selected' : ''}>C</option>
        </select>
        <label for="editSyllabus">Kursplan (URL):</label>
        <input type="text" id="editSyllabus" value="${course.syllabus}" required>
        <button type="submit">Spara</button>
        <button type="button" class="cancel-btn">Avbryt</button>
    `;
    // Lägg till eventlyssnare för formuläret
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveCourseChanges(course, editForm, itemID);
    });

    // Lägg till eventlyssnare för avbrytningsknappen, tar bort formuläret för ändringar
    const cancelButton = editForm.querySelector('.cancel-btn');
    if (cancelButton) {
        cancelButton.addEventListener('click', () => {
            editForm.remove();
        });
    }

    // Lägg till formuläret på sidan
    courseList.appendChild(editForm);
}

// Funktion för att spara det ändrade värdet
function saveCourseChanges(oldCourse: CourseInfo, editForm: HTMLFormElement, itemID: string): void {
    const editedCourse: CourseInfo = {
        code: (document.querySelector('#editCode') as HTMLInputElement).value,
        name: (document.querySelector('#editName') as HTMLInputElement).value,
        progression: (document.querySelector('#editProgression') as HTMLSelectElement).value,
        syllabus: (document.querySelector('#editSyllabus') as HTMLInputElement).value
    }
    // Hitta <li> elementet som innehåller kursen och uppdatera innehållet
    const listItem = document.getElementById(itemID);
    if (listItem) {
        listItem.innerHTML = `
            <span>Kod: ${editedCourse.code}, Namn: ${editedCourse.name}, Progression: ${editedCourse.progression}, Syllabus: ${editedCourse.syllabus}</span><br>
            <button class="remove-btn" style="margin-top:15px;">Ta bort</button>
            <button class="edit-btn">Ändra</button>
        `;
        // Lägg till eventlyssnare för knapparna igen efter att innehållet har uppdaterats
        const removeButton = listItem.querySelector('.remove-btn');
        const editButton = listItem.querySelector('.edit-btn');
        if (removeButton && editButton) {
            removeButton.addEventListener('click', () => {
                removeCourse(editedCourse, itemID);
                listItem.remove();
            });
            editButton.addEventListener('click', () => {
                editCourse(editedCourse, itemID);
            });
        }
    }
    // Uppdatera kursobjektet med de nya värdena
    Object.assign(oldCourse, editedCourse);

    // Ta bort formuläret efter redigering
    editForm.remove();
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