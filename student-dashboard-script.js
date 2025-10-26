// Check authentication
document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const userRole = localStorage.getItem('userRole');
    
    if (!loggedInUser || userRole !== 'student') {
        window.location.href = 'login.html';
        return;
    }
    
    loadStudentData();
    initializeEventListeners();
});

// Initialize Event Listeners
function initializeEventListeners() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
}

// Tab Switching
function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === tabName);
    });
}

// Load Student Data
function loadStudentData() {
    const studentData = JSON.parse(localStorage.getItem('studentData'));
    const studentId = localStorage.getItem('loggedInUser');
    
    if (!studentData) {
        window.location.href = 'login.html';
        return;
    }
    
    // Display student info
    document.getElementById('studentWelcome').textContent = `Welcome, ${studentData.name}`;
    document.getElementById('studentName').textContent = studentData.name;
    document.getElementById('studentIdDisplay').textContent = studentData.id;
    document.getElementById('studentGrade').textContent = `Grade ${studentData.grade}`;
    document.getElementById('studentClass').textContent = studentData.class;
    document.getElementById('studentEmail').textContent = studentData.email;
    
    // Load grades
    loadGrades(studentId);
    
    // Load attendance
    loadAttendance(studentId);
}

// Load Grades
function loadGrades(studentId) {
    const allGrades = JSON.parse(localStorage.getItem('grades') || '[]');
    const studentGrades = allGrades.filter(g => g.studentId === studentId);
    
    if (studentGrades.length === 0) {
        document.getElementById('gradesTableBody').innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <h3>No grades recorded yet</h3>
                    <p>Your grades will appear here once your teacher adds them</p>
                </td>
            </tr>
        `;
        document.getElementById('avgGrade').textContent = '0%';
        document.getElementById('totalSubjects').textContent = '0';
        document.getElementById('totalGrades').textContent = '0';
        return;
    }
    
    // Calculate statistics
    const totalPercentage = studentGrades.reduce((sum, g) => 
        sum + ((g.score / g.maxScore) * 100), 0
    );
    const avgGrade = totalPercentage / studentGrades.length;
    const subjects = [...new Set(studentGrades.map(g => g.subject))];
    
    document.getElementById('avgGrade').textContent = `${avgGrade.toFixed(1)}%`;
    document.getElementById('totalSubjects').textContent = subjects.length;
    document.getElementById('totalGrades').textContent = studentGrades.length;
    
    // Render grades table
    const tbody = document.getElementById('gradesTableBody');
    tbody.innerHTML = studentGrades.map(grade => {
        const percentage = ((grade.score / grade.maxScore) * 100).toFixed(1);
        const letterGrade = getLetterGrade(percentage);
        const gradeClass = getGradeClass(letterGrade);
        
        return `
            <tr>
                <td>${grade.subject}</td>
                <td>${grade.examType}</td>
                <td>${grade.score}/${grade.maxScore}</td>
                <td>${percentage}%</td>
                <td>${grade.date}</td>
                <td><span class="grade-badge ${gradeClass}">${letterGrade}</span></td>
            </tr>
        `;
    }).join('');
    
    // Render subject performance chart
    renderSubjectChart(studentGrades);
}

// Load Attendance
function loadAttendance(studentId) {
    const allAttendance = JSON.parse(localStorage.getItem('attendance') || '{}');
    
    let presentCount = 0;
    let absentCount = 0;
    let totalDays = 0;
    
    const attendanceRecords = [];
    
    Object.keys(allAttendance).forEach(date => {
        if (allAttendance[date][studentId]) {
            const status = allAttendance[date][studentId];
            totalDays++;
            
            if (status === 'present') {
                presentCount++;
            } else if (status === 'absent') {
                absentCount++;
            }
            
            attendanceRecords.push({ date, status });
        }
    });
    
    // Sort by date (newest first)
    attendanceRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Update statistics
    const attendanceRate = totalDays > 0 ? ((presentCount / totalDays) * 100).toFixed(1) : 0;
    document.getElementById('attendanceRate').textContent = `${attendanceRate}%`;
    document.getElementById('presentDays').textContent = presentCount;
    document.getElementById('absentDays').textContent = absentCount;
    document.getElementById('totalDays').textContent = totalDays;
    
    // Render attendance table
    const tbody = document.getElementById('attendanceTableBody');
    
    if (attendanceRecords.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="2" class="empty-state">
                    <h3>No attendance records</h3>
                    <p>Your attendance will be recorded by your teacher</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = attendanceRecords.map(record => {
        const statusClass = record.status === 'present' ? 'status-present' : 'status-absent';
        const statusText = record.status.charAt(0).toUpperCase() + record.status.slice(1);
        
        return `
            <tr>
                <td>${record.date}</td>
                <td><span class="attendance-status-badge ${statusClass}">${statusText}</span></td>
            </tr>
        `;
    }).join('');
}

// Render Subject Performance Chart
function renderSubjectChart(grades) {
    const subjectPerformance = {};
    
    grades.forEach(grade => {
        const percentage = (grade.score / grade.maxScore) * 100;
        
        if (!subjectPerformance[grade.subject]) {
            subjectPerformance[grade.subject] = {
                total: 0,
                count: 0
            };
        }
        
        subjectPerformance[grade.subject].total += percentage;
        subjectPerformance[grade.subject].count += 1;
    });
    
    const chartContainer = document.getElementById('subjectChart');
    let html = '<div style="display: grid; gap: 20px;">';
    
    Object.keys(subjectPerformance).forEach(subject => {
        const avg = subjectPerformance[subject].total / subjectPerformance[subject].count;
        const letterGrade = getLetterGrade(avg);
        
        html += `
            <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-weight: 600; font-size: 1.1rem;">${subject}</span>
                    <div>
                        <span style="color: #667eea; font-weight: 600; font-size: 1.1rem; margin-right: 10px;">${avg.toFixed(1)}%</span>
                        <span class="grade-badge ${getGradeClass(letterGrade)}">${letterGrade}</span>
                    </div>
                </div>
                <div style="background: #e2e8f0; height: 35px; border-radius: 8px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #667eea, #764ba2); height: 100%; width: ${avg}%; transition: width 0.5s ease; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;"></div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    chartContainer.innerHTML = html;
}

// Get Letter Grade
function getLetterGrade(percentage) {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
}

// Get Grade Class
function getGradeClass(letterGrade) {
    return `grade-${letterGrade.toLowerCase()}`;
}

// Logout Function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('userRole');
        localStorage.removeItem('studentData');
        window.location.href = 'login.html';
    }
}