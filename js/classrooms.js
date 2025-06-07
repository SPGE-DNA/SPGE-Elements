// School classroom and subject data
const subjects = [
    { name: "Български език и литература", nameEn: "Bulgarian Language and Literature", teacher: "Анна Н. Александрова", room: "4.1" },
    { name: "Английски език", nameEn: "English Language", teacher: "Валя М. Касчиева", room: "2.3" },
    { name: "Математика", nameEn: "Mathematics", teacher: "Адриана С. Йорданова", room: "2.1 (Varies)" },
    { name: "Информационни технологии", nameEn: "Information Technology", teacher: "Диана Н. Иванова", room: "Computer Lab" },
    { name: "История и цивилизации", nameEn: "History and Civilizations", teacher: "Магдалена А. Стаменова", room: "3.6" },
    { name: "География и икономика", nameEn: "Geography and Economics", teacher: "Златомира Г. Кондзеровска", room: "4.7" },
    { name: "Философия", nameEn: "Philosophy", teacher: "Галина С. Мицева-Колева", room: "2.3 (Varies)" },
    { name: "Биология и здравно образование", nameEn: "Biology and Health Education", teacher: "Светла Г. Антонова", room: "3.5" },
    { name: "Физика и астрономия", nameEn: "Physics and Astronomy", teacher: "Мария К. Котева", room: "4.5" },
    { name: "Химия и опазване на околната среда", nameEn: "Chemistry and Environmental Protection", teacher: "Невенка В. Костова", room: "Chemistry Lab" },
    { name: "Физическо възпитание и спорт", nameEn: "Physical Education and Sports", teacher: "Станка И. Перфанова", room: "Sport Center" },
    { name: "Предприемачество (ОбПП)", nameEn: "Entrepreneurship", teacher: "Емилия И. Пенева", room: "4.6 (Varies)" }
];

const classrooms = [
    { number: "1.1", type: "regular" },
    { number: "1.2", type: "regular" },
    { number: "1.3", type: "regular" },
    { number: "1.4", type: "regular" },
    { number: "1.5", type: "regular" },
    { number: "1.6", type: "regular" },
    { number: "1.7", type: "regular" },
    { number: "2.1", type: "regular" },
    { number: "2.2", type: "regular" },
    { number: "2.3", type: "regular" },
    { number: "2.4", type: "regular" },
    { number: "2.5", type: "regular" },
    { number: "2.6", type: "regular" },
    { number: "2.7", type: "regular" },
    { number: "3.1", type: "regular" },
    { number: "3.2", type: "regular" },
    { number: "3.3", type: "regular" },
    { number: "3.4", type: "regular" },
    { number: "3.5", type: "regular" },
    { number: "3.6", type: "regular" },
    { number: "3.7", type: "regular" },
    { number: "4.1", type: "regular" },
    { number: "4.2", type: "regular" },
    { number: "4.3", type: "regular" },
    { number: "4.4", type: "regular" },
    { number: "4.5", type: "regular" },
    { number: "4.6", type: "regular" },
    { number: "4.7", type: "regular" },
    { number: "Sport Center", type: "special" },
    { number: "STEM Lab 1", type: "special" },
    { number: "STEM Lab 2", type: "special" },
    { number: "STEM Lab 3", type: "special" },
    { number: "Teachers Lounge", type: "special" },
    { number: "Medical Room", type: "special" },
    { number: "Resource Room", type: "special" },
    { number: "Director's Office", type: "special" },
    { number: "Storage Unit", type: "special" },
    { number: "Chemistry Lab", type: "special" },
    { number: "Computer Lab", type: "special" },
    { number: "Psychology Office", type: "special" }
];

// Initialize classroom and subject data
document.addEventListener('DOMContentLoaded', function() {
    setupTabs();
    populateSubjects();
    populateClassrooms();
});

// Setup tabs for subjects and classrooms
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            
            // Update active button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show selected tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === target + '-tab') {
                    content.classList.add('active');
                }
            });
        });
    });
}

// Populate subjects table
function populateSubjects() {
    const tableBody = document.querySelector('#subjects-tab tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    subjects.forEach(subject => {
        const row = document.createElement('tr');
        
        // Use the appropriate language for the subject name
        const subjectName = getCurrentLanguage() === 'bg' ? subject.name : subject.nameEn;
        
        row.innerHTML = `
            <td>${subjectName}</td>
            <td>${subject.teacher}</td>
            <td>${subject.room}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Populate classrooms grid
function populateClassrooms() {
    const grid = document.querySelector('.classroom-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    classrooms.forEach(classroom => {
        const item = document.createElement('div');
        item.className = `classroom-item ${classroom.type === 'special' ? 'special' : ''}`;
        
        let info = '';
        // Find any subjects taught in this classroom
        const classroomSubjects = subjects.filter(subject => 
            subject.room === classroom.number || 
            subject.room.includes(classroom.number)
        );
        
        if (classroomSubjects.length > 0) {
            // Display the first subject taught in this room
            const subjectName = getCurrentLanguage() === 'bg' 
                ? classroomSubjects[0].name 
                : classroomSubjects[0].nameEn;
                
            info = subjectName.length > 15 
                ? subjectName.substring(0, 15) + '...' 
                : subjectName;
        }
        
        item.innerHTML = `
            <div class="classroom-number">${classroom.number}</div>
            <div class="classroom-info">${info}</div>
        `;
        
        // Add click handler to show more details
        item.addEventListener('click', () => {
            showClassroomDetails(classroom);
        });
        
        grid.appendChild(item);
    });
}

// Show classroom details in a modal
function showClassroomDetails(classroom) {
    // Find subjects taught in this classroom
    const classroomSubjects = subjects.filter(subject => 
        subject.room === classroom.number || 
        subject.room.includes(classroom.number)
    );
    
    let subjectsHtml = '';
    if (classroomSubjects.length > 0) {
        subjectsHtml = '<h4>' + (getCurrentLanguage() === 'bg' ? 'Предмети:' : 'Subjects:') + '</h4><ul>';
        
        classroomSubjects.forEach(subject => {
            const subjectName = getCurrentLanguage() === 'bg' ? subject.name : subject.nameEn;
            subjectsHtml += `<li>${subjectName} - ${subject.teacher}</li>`;
        });
        
        subjectsHtml += '</ul>';
    }
    
    // Create a custom "element" for the classroom
    const classroomElement = {
        name: classroom.number,
        symbol: classroom.number.substring(0, 2),
        description: classroom.type === 'special' 
            ? (getCurrentLanguage() === 'bg' ? 'Специализирана стая' : 'Special purpose room')
            : (getCurrentLanguage() === 'bg' ? 'Стандартна класна стая' : 'Standard classroom'),
        category: classroom.type === 'special' ? 'science' : 'humanities',
        location: classroom.type === 'special' 
            ? (getCurrentLanguage() === 'bg' ? 'Специален етаж' : 'Special floor')
            : (getCurrentLanguage() === 'bg' ? 'Етаж ' + classroom.number.substring(0, 1) : 'Floor ' + classroom.number.substring(0, 1)),
        contact: classroomSubjects.length > 0 ? classroomSubjects[0].teacher : 'N/A',
        facts: classroomSubjects.map(subject => 
            (getCurrentLanguage() === 'bg' ? subject.name : subject.nameEn) + ' - ' + subject.teacher
        )
    };
    
    // Use the existing modal system to show the classroom
    openModal(classroomElement);
}

// Update language-dependent elements when language changes
document.addEventListener('languageChanged', function() {
    populateSubjects();
    populateClassrooms();
});
