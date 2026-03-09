# GitHub Issues Tracker

A simple web app to track GitHub issues with login, search, and filtering.

## 🔑 Demo Credentials
- **Username:** admin
- **Password:** admin123

## 🛠️ Tech Stack
- HTML
- CSS / Tailwind / DaisyUI
- JavaScript (Vanilla)

## ✨ Features

- Login with demo credentials
- View all issues in a 4-column card layout
- Filter issues by All, Open, and Closed tabs
- Search issues with debounce
- Create new issues with a modal form
- Color coded priority badges (High, Medium, Low)
- Green border for open issues, purple for closed
- Loading spinner while fetching data
- Responsive design

## 📡 API Endpoints
- All Issues: https://phi-lab-server.vercel.app/api/v1/lab/issues
- Single Issue: https://phi-lab-server.vercel.app/api/v1/lab/issue/{id}
- Search: https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q={searchText}

## ❓ JavaScript Concepts

**1. What is the difference between var, let, and const?**
- `var`: A variable can be declared repeatedly with the same name.
- `let`: Its value can be changed if necessary, but it cannot be declared twice with the same name in the same block.
- `const`: Once its value is determined, it cannot be changed again.

**2. What is the spread operator (...)?**
- It is expressed with three dots.
- Its function is to unpack an array or object.
- It can be used to concatenate multiple arrays and objects together.

**3. What is the difference between map(), filter(), and forEach()?**
- `forEach()`: Loops over each element of the array once. It does not return anything, it is only used to display or print data.
- `map()`: Creates a completely new array by modifying each element of the array.
- `filter()`: Finds data from an array based on a specific condition.

**4. What is an arrow function?**
- This is a modern and concise way of writing functions.
- The `=>` symbol is used instead of the `function` keyword.

**5. What are template literals?**
- An advanced way of writing strings where backticks are used instead of single or double quotes.
- Allows variables or dynamic code to be placed directly within the string using `${variable}`.