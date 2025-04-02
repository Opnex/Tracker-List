// Selection of elements
const form = document.getElementById('tracker-form');
const descriptionInput = document.querySelector('.description');
const amountInput = document.querySelector('.amount');
const categorySelect = document.querySelector('.category');
const dateInput = document.querySelector('.date');
const expenseTableBody = document.querySelector('.expense-table-body');
const totalExpenses = document.querySelector('.total-expenses');
const categoryList = document.querySelector('.category-list');

// Initialize expenses from local storage or use an empty array
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
updateUI();

// Handle form submission
form.addEventListener('submit', (e) => {
    e.preventDefault(); 

    const description = descriptionInput.value;
    const amount = parseFloat(amountInput.value);
    const category = categorySelect.value;
    const date = dateInput.value;

    // Create a new expense object
    const expense = { description, amount, category, date };
    expenses.push(expense);
    saveExpenses();
    updateUI();

    // Clear input fields
    form.reset();
});

// Save expenses to local storage
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Update UI with expenses and total
function updateUI() {
    // Display expenses in table
    expenseTableBody.innerHTML = '';
    expenses.forEach((expense, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.description}</td>
            <td>$${expense.amount.toFixed(2)}</td>
            <td>${expense.category}</td>
            <td>${expense.date}</td>
            <td><button onclick="deleteExpense(${index})">Delete</button></td>
        `;
        expenseTableBody.appendChild(row);
    });

    // Calculate total expenses
    const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    totalExpenses.textContent = `$${total.toFixed(2)}`;

    // Calculate expenses by category
    const categorySummary = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {});

    categoryList.innerHTML = '';
    for (const [category, amount] of Object.entries(categorySummary)) {
        const item = document.createElement('li');
        item.textContent = `${category}: $${amount.toFixed(2)}`;
        categoryList.appendChild(item);
    }
}

// Delete an expense
function deleteExpense(index) {
    expenses.splice(index, 1);
    saveExpenses();
    updateUI();
}
