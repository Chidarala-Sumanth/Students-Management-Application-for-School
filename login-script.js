// Check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const userRole = localStorage.getItem('userRole');
    
    if (loggedInUser && userRole) {
        redirectToDashboard(userRole);
    }
});

// Show/Hide Forms
function showRoleSelection() {
    document.getElementById('roleSelection').style.display = 'grid';
    document.getElementById('teacherLoginForm').classList.add('hidden');
    document.getElementById('studentLoginForm').classList.add('hidden');
}

function showLoginForm(role) {
    document.getElementById('roleSelection').style.display = 'none';
    
    if (role === 'teacher') {
        document.getElementById('teacherLoginForm').classList.remove('hidden');
        document.getElementById('studentLoginForm').classList.add('hidden');
    } else {
        document.getElementById('studentLoginForm').classList.remove('hidden');
        document.getElementById('teacherLoginForm').classList.add('hidden');
    }
}

// Teacher Login Handler
function handleTeacherLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('teacherUsername').value;
    const password = document.getElementById('teacherPassword').value;
    const remember = document.getElementById('teacherRemember').checked;
    
    // Demo credentials - In production, this should be server-side validation
    if (username === 'admin' && password === 'admin123') {
        // Store login session
        localStorage.setItem('loggedInUser', username);
        localStorage.setItem('userRole', 'teacher');
        
        if (remember) {
            localStorage.setItem('rememberMe', 'true');
        }
        
        showToast('Login successful! Redirecting...', 'success');
        
        setTimeout(() => {
            redirectToDashboard('teacher');
        }, 1500);
    } else {
        showToast('Invalid username or password!', 'error');
    }
}

// Student Login Handler
function handleStudentLogin(event) {
    event.preventDefault();
    
    const studentId = document.getElementById('studentId').value;
    const password = document.getElementById('studentPassword').value;
    const remember = document.getElementById('studentRemember').checked;
    
    // Get students from localStorage
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const student = students.find(s => s.id === studentId);
    
    // Demo password - In production, each student should have their own password
    if (student && password === 'student123') {
        // Store login session
        localStorage.setItem('loggedInUser', studentId);
        localStorage.setItem('userRole', 'student');
        localStorage.setItem('studentData', JSON.stringify(student));
        
        if (remember) {
            localStorage.setItem('rememberMe', 'true');
        }
        
        showToast('Login successful! Redirecting...', 'success');
        
        setTimeout(() => {
            redirectToDashboard('student');
        }, 1500);
    } else if (!student) {
        showToast('Student ID not found!', 'error');
    } else {
        showToast('Invalid password!', 'error');
    }
}

// Redirect to appropriate dashboard
function redirectToDashboard(role) {
    if (role === 'teacher') {
        window.location.href = 'index.html';
    } else {
        window.location.href = 'student-dashboard.html';
    }
}

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('loginToast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}