document.addEventListener('DOMContentLoaded', () => {
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
    let expenses = [];
    try {
        const storedExpenses = localStorage.getItem('expenses');
        if (storedExpenses) {
            expenses = JSON.parse(storedExpenses);
            // Filter out invalid expenses
            expenses = expenses.filter(expense => 
                expense && 
                typeof expense.amount === 'number' && 
                !isNaN(expense.amount)
            );
        }
    } catch (error) {
        console.error('Error loading expenses from localStorage:', error);
        expenses = []; // Reset to empty array if parsing fails
    }
    console.log('Loaded expenses:', expenses); // Debug

    // Initial UI update
    updateUI();

    // Handle form submission
    if (form) {
        form.addEventListener('submit', handleSubmit);
    } else {
        console.error('Form not found in the DOM');
    }

    // Event delegation for delete buttons
    expenseTableBody.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const index = e.target.dataset.index;
            deleteExpense(index);
        }
    });

    function handleSubmit(e) {
        e.preventDefault();
        console.log('Form submitted');

        // Validation
        if (!descriptionInput.value.trim() || 
            !amountInput.value.trim() || 
            categorySelect.value === '' || 
            !dateInput.value) {
            alert('Please fill out all fields before submitting.');
            console.log('Validation failed:', {
                description: descriptionInput.value,
                amount: amountInput.value,
                category: categorySelect.value,
                date: dateInput.value
            });
            return;
        }

        const amount = parseFloat(amountInput.value);
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid positive amount.');
            return;
        }

        const description = descriptionInput.value.trim();
        const category = categorySelect.value;
        const date = dateInput.value;

        console.log('New expense:', { description, amount, category, date });

        const expense = { description, amount, category, date };
        expenses.push(expense);
        saveExpenses();
        updateUI();

        form.reset();
    }

    function saveExpenses() {
        try {
            localStorage.setItem('expenses', JSON.stringify(expenses));
            console.log('Expenses saved:', expenses);
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    function updateUI() {
        if (!expenseTableBody || !totalExpenses || !categoryList) {
            console.error('One or more UI elements not found');
            return;
        }

        expenseTableBody.innerHTML = '';
        expenses.forEach((expense, index) => {
            const row = document.createElement('tr');
            // Ensure amount is a valid number, default to 0 if not
            const amount = (typeof expense.amount === 'number' && !isNaN(expense.amount)) 
                ? expense.amount 
                : 0;
            row.innerHTML = `
                <td>${expense.description || 'Unknown'}</td>
                <td>$${amount.toFixed(2)}</td>
                <td>${expense.category || 'Uncategorized'}</td>
                <td>${expense.date || 'No date'}</td>
                <td><button data-index="${index}">Delete</button></td>
            `;
            expenseTableBody.appendChild(row);
        });

        const total = expenses.reduce((acc, expense) => {
            const amount = (typeof expense.amount === 'number' && !isNaN(expense.amount)) 
                ? expense.amount 
                : 0;
            return acc + amount;
        }, 0);
        totalExpenses.textContent = `$${total.toFixed(2)}`;

        const categorySummary = expenses.reduce((acc, expense) => {
            const amount = (typeof expense.amount === 'number' && !isNaN(expense.amount)) 
                ? expense.amount 
                : 0;
            const category = expense.category || 'Uncategorized';
            acc[category] = (acc[category] || 0) + amount;
            return acc;
        }, {});

        categoryList.innerHTML = '';
        for (const [category, amount] of Object.entries(categorySummary)) {
            const item = document.createElement('li');
            item.textContent = `${category}: $${amount.toFixed(2)}`;
            categoryList.appendChild(item);
        }
    }

    function deleteExpense(index) {
        console.log('Deleting expense at index:', index);
        expenses.splice(index, 1);
        saveExpenses();
        updateUI();
    }
});