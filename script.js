// Data Storage
let students = [];
let attendance = {};
let grades = [];
let editingStudentId = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    const loggedInUser = localStorage.getItem('loggedInUser');
    const userRole = localStorage.getItem('userRole');
    
    if (!loggedInUser || userRole !== 'teacher') {
        window.location.href = 'login.html';
        return;
    }
    
    // Add logout button to header
    addLogoutButton();
    
    loadData();
    initializeEventListeners();
    setTodayDate();
    renderStudents();
    renderAttendance();
    renderGrades();
    updateReports();
});

// Add logout button
function addLogoutButton() {
    const header = document.querySelector('.header');
    const loggedInUser = localStorage.getItem('loggedInUser');
    
    header.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h1>🎓 Student Management System</h1>
                <p class="subtitle">Manage Students, Attendance & Grades | Welcome, ${loggedInUser}</p>
            </div>
            <button class="btn" style="background: rgba(255,255,255,0.2); color: white; border: 2px solid white;" onclick="logout()">Logout</button>
        </div>
    `;
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('userRole');
        window.location.href = 'login.html';
    }
}

// Load data from localStorage
function loadData() {
    const savedStudents = localStorage.getItem('students');
    const savedAttendance = localStorage.getItem('attendance');
    const savedGrades = localStorage.getItem('grades');
    
    if (savedStudents) students = JSON.parse(savedStudents);
    if (savedAttendance) attendance = JSON.parse(savedAttendance);
    if (savedGrades) grades = JSON.parse(savedGrades);
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('attendance', JSON.stringify(attendance));
    localStorage.setItem('grades', JSON.stringify(grades));
}

// Initialize Event Listeners
function initializeEventListeners() {
    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    
    // Students
    document.getElementById('addStudentBtn').addEventListener('click', showStudentForm);
    document.getElementById('cancelBtn').addEventListener('click', hideStudentForm);
    document.getElementById('studentForm').addEventListener('submit', handleStudentSubmit);
    document.getElementById('searchStudent').addEventListener('input', (e) => renderStudents(e.target.value));
    
    // Attendance
    document.getElementById('attendanceDate').addEventListener('change', renderAttendance);
    document.getElementById('gradeFilter').addEventListener('change', renderAttendance);
    document.getElementById('classFilter').addEventListener('change', renderAttendance);
    document.getElementById('saveAttendanceBtn').addEventListener('click', saveAttendance);
    
    // Grades
    document.getElementById('addGradeBtn').addEventListener('click', showGradeForm);
    document.getElementById('cancelGradeBtn').addEventListener('click', hideGradeForm);
    document.getElementById('gradeForm').addEventListener('submit', handleGradeSubmit);
    document.getElementById('searchGrade').addEventListener('input', (e) => renderGrades(e.target.value));
}

// Tab Switching
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === tabName);
    });
    
    // Refresh data when switching tabs
    if (tabName === 'attendance') {
        renderAttendance();
        populateClassFilter();
    } else if (tabName === 'grades') {
        renderGrades();
        populateStudentDropdown();
    } else if (tabName === 'reports') {
        updateReports();
    }
}

// Set today's date
function setTodayDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('attendanceDate').value = today;
    document.getElementById('gradeDate').value = today;
}

// Student Functions
function showStudentForm() {
    document.getElementById('studentFormContainer').classList.remove('hidden');
    document.getElementById('formTitle').textContent = 'Add New Student';
    document.getElementById('studentForm').reset();
    document.getElementById('studentId').disabled = false;
    editingStudentId = null;
}

function hideStudentForm() {
    document.getElementById('studentFormContainer').classList.add('hidden');
    document.getElementById('studentForm').reset();
    editingStudentId = null;
}

function handleStudentSubmit(e) {
    e.preventDefault();
    
    const student = {
        id: document.getElementById('studentId').value,
        name: document.getElementById('studentName').value,
        email: document.getElementById('studentEmail').value,
        phone: document.getElementById('studentPhone').value,
        grade: document.getElementById('studentGrade').value,
        class: document.getElementById('studentClass').value
    };
    
    if (editingStudentId) {
        const index = students.findIndex(s => s.id === editingStudentId);
        students[index] = student;
        showToast('Student updated successfully!', 'success');
    } else {
        if (students.some(s => s.id === student.id)) {
            showToast('Student ID already exists!', 'error');
            return;
        }
        students.push(student);
        showToast('Student added successfully!', 'success');
    }
    
    saveData();
    renderStudents();
    hideStudentForm();
}

function editStudent(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;
    
    document.getElementById('studentId').value = student.id;
    document.getElementById('studentName').value = student.name;
    document.getElementById('studentEmail').value = student.email;
    document.getElementById('studentPhone').value = student.phone;
    document.getElementById('studentGrade').value = student.grade;
    document.getElementById('studentClass').value = student.class;
    
    document.getElementById('formTitle').textContent = 'Edit Student';
    document.getElementById('studentId').disabled = true;
    document.getElementById('studentFormContainer').classList.remove('hidden');
    editingStudentId = id;
}

function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student?')) return;
    
    students = students.filter(s => s.id !== id);
    grades = grades.filter(g => g.studentId !== id);
    
    // Remove attendance records
    Object.keys(attendance).forEach(date => {
        if (attendance[date][id]) {
            delete attendance[date][id];
        }
    });
    
    saveData();
    renderStudents();
    showToast('Student deleted successfully!', 'success');
}

function renderStudents(searchTerm = '') {
    const tbody = document.getElementById('studentsTableBody');
    
    let filteredStudents = students;
    if (searchTerm) {
        filteredStudents = students.filter(s => 
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.class.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    if (filteredStudents.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <h3>No students found</h3>
                    <p>Add your first student to get started</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filteredStudents.map(student => `
        <tr>
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.phone}</td>
            <td>Grade ${student.grade}</td>
            <td>${student.class}</td>
            <td>
                <button class="btn btn-edit" onclick="editStudent('${student.id}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteStudent('${student.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}// CONTINUE FROM PART 1 - ADD THIS CODE TO THE END OF PART 1

// Attendance Functions
function populateClassFilter() {
    const classFilter = document.getElementById('classFilter');
    const classes = [...new Set(students.map(s => s.class))];
    
    classFilter.innerHTML = '<option value="">All Classes</option>' + 
        classes.map(c => `<option value="${c}">${c}</option>`).join('');
}

function renderAttendance() {
    const tbody = document.getElementById('attendanceTableBody');
    const date = document.getElementById('attendanceDate').value;
    const gradeFilter = document.getElementById('gradeFilter').value;
    const classFilter = document.getElementById('classFilter').value;
    
    let filteredStudents = students;
    
    if (gradeFilter) {
        filteredStudents = filteredStudents.filter(s => s.grade === gradeFilter);
    }
    
    if (classFilter) {
        filteredStudents = filteredStudents.filter(s => s.class === classFilter);
    }
    
    if (filteredStudents.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    <h3>No students found</h3>
                    <p>Add students or adjust filters</p>
                </td>
            </tr>
        `;
        return;
    }
    
    if (!attendance[date]) {
        attendance[date] = {};
    }
    
    tbody.innerHTML = filteredStudents.map(student => {
        const status = attendance[date][student.id] || 'unmarked';
        return `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>Grade ${student.grade}</td>
                <td>${student.class}</td>
                <td>
                    <span class="attendance-status ${status}" 
                          onclick="toggleAttendance('${student.id}', '${date}')">
                        ${status.toUpperCase()}
                    </span>
                </td>
            </tr>
        `;
    }).join('');
}

function toggleAttendance(studentId, date) {
    if (!attendance[date]) {
        attendance[date] = {};
    }
    
    const current = attendance[date][studentId] || 'unmarked';
    const next = current === 'unmarked' ? 'present' : 
                 current === 'present' ? 'absent' : 'unmarked';
    
    attendance[date][studentId] = next;
    renderAttendance();
}

function saveAttendance() {
    saveData();
    showToast('Attendance saved successfully!', 'success');
    updateReports();
}

// Grade Functions
function populateStudentDropdown() {
    const select = document.getElementById('gradeStudentId');
    select.innerHTML = '<option value="">Select Student</option>' + 
        students.map(s => `<option value="${s.id}">${s.id} - ${s.name}</option>`).join('');
}

function showGradeForm() {
    document.getElementById('gradeFormContainer').classList.remove('hidden');
    populateStudentDropdown();
}

function hideGradeForm() {
    document.getElementById('gradeFormContainer').classList.add('hidden');
    document.getElementById('gradeForm').reset();
}

function handleGradeSubmit(e) {
    e.preventDefault();
    
    const grade = {
        id: Date.now().toString(),
        studentId: document.getElementById('gradeStudentId').value,
        subject: document.getElementById('subjectName').value,
        examType: document.getElementById('examType').value,
        score: parseFloat(document.getElementById('score').value),
        maxScore: parseFloat(document.getElementById('maxScore').value),
        date: document.getElementById('gradeDate').value
    };
    
    grades.push(grade);
    saveData();
    renderGrades();
    hideGradeForm();
    showToast('Grade added successfully!', 'success');
}

function deleteGrade(id) {
    if (!confirm('Are you sure you want to delete this grade?')) return;
    
    grades = grades.filter(g => g.id !== id);
    saveData();
    renderGrades();
    showToast('Grade deleted successfully!', 'success');
}

function renderGrades(searchTerm = '') {
    const tbody = document.getElementById('gradesTableBody');
    
    let filteredGrades = grades.map(grade => {
        const student = students.find(s => s.id === grade.studentId);
        return {
            ...grade,
            studentName: student ? student.name : 'Unknown'
        };
    });
    
    if (searchTerm) {
        filteredGrades = filteredGrades.filter(g => 
            g.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            g.subject.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    if (filteredGrades.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    <h3>No grades found</h3>
                    <p>Add grades to track student performance</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filteredGrades.map(grade => {
        const percentage = ((grade.score / grade.maxScore) * 100).toFixed(1);
        return `
            <tr>
                <td>${grade.studentId}</td>
                <td>${grade.studentName}</td>
                <td>${grade.subject}</td>
                <td>${grade.examType}</td>
                <td>${grade.score}/${grade.maxScore}</td>
                <td>${percentage}%</td>
                <td>${grade.date}</td>
                <td>
                    <button class="btn btn-danger" onclick="deleteGrade('${grade.id}')">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
}

// Reports Functions
function updateReports() {
    // Total Students
    document.getElementById('totalStudents').textContent = students.length;
    
    // Today's Attendance
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = attendance[today] || {};
    const presentCount = Object.values(todayAttendance).filter(status => status === 'present').length;
    const totalMarked = Object.keys(todayAttendance).length;
    const attendancePercentage = totalMarked > 0 ? ((presentCount / totalMarked) * 100).toFixed(1) : 0;
    document.getElementById('todayAttendance').textContent = `${attendancePercentage}%`;
    
    // Average Grade
    if (grades.length > 0) {
        const avgGrade = grades.reduce((sum, g) => sum + ((g.score / g.maxScore) * 100), 0) / grades.length;
        document.getElementById('averageGrade').textContent = `${avgGrade.toFixed(1)}%`;
    } else {
        document.getElementById('averageGrade').textContent = '0%';
    }
    
    // Total Grades
    document.getElementById('totalGrades').textContent = grades.length;
    
    // Grade Distribution
    renderGradeDistribution();
    
    // Attendance Summary
    renderAttendanceSummary();
}

function renderGradeDistribution() {
    const container = document.getElementById('gradeDistribution');
    
    if (grades.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #a0aec0;">No grade data available</p>';
        return;
    }// CONTINUE FROM PART 2 - ADD THIS CODE TO THE END OF PART 2

    const classGrades = {};
    
    grades.forEach(grade => {
        const student = students.find(s => s.id === grade.studentId);
        if (student) {
            if (!classGrades[student.class]) {
                classGrades[student.class] = [];
            }
            classGrades[student.class].push((grade.score / grade.maxScore) * 100);
        }
    });
    
    let html = '<div style="display: grid; gap: 15px;">';
    
    Object.keys(classGrades).forEach(className => {
        const avg = classGrades[className].reduce((a, b) => a + b, 0) / classGrades[className].length;
        const barWidth = avg;
        
        html += `
            <div style="margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span style="font-weight: 600;">${className}</span>
                    <span style="color: #667eea; font-weight: 600;">${avg.toFixed(1)}%</span>
                </div>
                <div style="background: #e2e8f0; height: 30px; border-radius: 8px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #667eea, #764ba2); height: 100%; width: ${barWidth}%; transition: width 0.5s ease;"></div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function renderAttendanceSummary() {
    const container = document.getElementById('attendanceSummary');
    
    const dates = Object.keys(attendance).sort().slice(-7);
    
    if (dates.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #a0aec0;">No attendance data available</p>';
        return;
    }
    
    let html = '<div style="display: grid; gap: 15px;">';
    
    dates.forEach(date => {
        const dayAttendance = attendance[date];
        const total = Object.keys(dayAttendance).length;
        const present = Object.values(dayAttendance).filter(s => s === 'present').length;
        const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;
        
        html += `
            <div style="margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span style="font-weight: 600;">${date}</span>
                    <span style="color: #667eea; font-weight: 600;">${present}/${total} (${percentage}%)</span>
                </div>
                <div style="background: #e2e8f0; height: 30px; border-radius: 8px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #48bb78, #38a169); height: 100%; width: ${percentage}%; transition: width 0.5s ease;"></div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}