# Students-Management-Application-for-School
The Student Management Application for School is a comprehensive system designed to automate and manage daily school operations. It handles student enrollment, attendance, grading, schedules, and reports. With secure data access, role-based dashboards, and analytics.
# Student Management System

A simple website to help schools manage their students. Teachers can add students, mark attendance, give grades, and see reports. Students can login to check their own grades and attendance.

## What You Need

9 files total:
- login.html (start page)
- login-styles.css
- login-script.js
- index.html (teacher page)
- styles.css
- script.js (NOTE: You got this in 3 pieces - put them all together in one file)
- student-dashboard.html (student page)
- student-dashboard-styles.css
- student-dashboard-script.js

## How to Set Up

1. Make a new folder on your computer
2. Put all 9 files in that folder
3. Double-click on "login.html" to open it
4. That's it! No internet needed.

## Login Information

**For Teachers:**
- Username: admin
- Password: admin123

**For Students:**
- Student ID: Whatever ID the teacher gives you
- Password: student123

## What Teachers Can Do

When you login as a teacher, you can:

1. **Add Students** - Put in their name, email, phone, grade, and class
2. **Mark Attendance** - Click on each student to mark them present or absent
3. **Give Grades** - Add test scores, quiz marks, homework grades etc
4. **See Reports** - Check how many students you have, attendance percentage, average grades

## What Students Can Do

When you login as a student, you can:

1. **See Your Info** - Your name, ID, email, class
2. **Check Grades** - All your test scores and grades in different subjects
3. **View Attendance** - How many days you were present or absent
4. **See Charts** - Visual graphs showing your performance

## Step by Step Guide

### First Time Use (Teacher)

1. Open login.html
2. Click "Teacher Login"
3. Type: admin (username) and admin123 (password)
4. Click the Students tab
5. Click "+ Add Student" button
6. Fill in:
   - Student ID: S001
   - Name: akshaya
   - Email: akshaya525@gmail.com
   - Phone: 8247970498 
   - Grade: 10
   - Class: A
7. Click "Save Student"
8. Add more students the same way

### Marking Attendance

1. Click "Attendance" tab
2. You'll see today's date
3. Click on each student's status
   - It changes: Unmarked → Present → Absent
   - Colors: Gray → Green → Red
4. Click "Save Attendance" when done

### Adding Grades

1. Click "Grades" tab
2. Click "+ Add Grade"
3. Choose student from dropdown
4. Type subject name (Math, English, etc)
5. Choose exam type (Midterm, Final, Quiz)
6. Enter score (like 85 out of 100)
7. Click "Save Grade"

### For Students

1. Go to login page
2. Click "Student Login"
3. Enter your Student ID (like S001)
4. Enter password: student123
5. See your grades and attendance

## Common Problems

**Problem:** Login doesn't work
**Fix:** Make sure you typed the username and password correctly

**Problem:** Can't find my Student ID
**Fix:** Ask your teacher - they create the Student IDs

**Problem:** My data disappeared
**Fix:** Don't use "private" or "incognito" mode in your browser

**Problem:** Want to start fresh
**Fix:** Press F12, type this in console: localStorage.clear() then press Enter

## Technical Info

Made with: HTML, CSS, and JavaScript
Saves data in: Your web browser (no server needed)
Works on: Chrome, Firefox, Safari, Edge
Works on: Computer, tablet, phone

## Important Things to Know

- Always start by opening "login.html" first
- Keep all 9 files in the same folder
- Don't rename the files
- The website works offline (no wifi needed)
- Your data is saved automatically
- Only works on one computer (data is saved locally)

## Security Warning

This is a practice project for learning. If you want to use this for a real school, you need to:
- Add a proper database
- Make secure passwords
- Put it on a real server
- Add more security features

## Who This Is For

- Students learning to code
- School projects
- Practice building websites
- Understanding how login systems work

## Need Help?

1. Check all files are in same folder
2. Make sure file names match exactly
3. Use a modern browser (Chrome is best)
4. Press F12 to see if there are any errors

