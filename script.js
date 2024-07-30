document.addEventListener('DOMContentLoaded', () => {
    loadExpenses();
    document.getElementById('submitButton').addEventListener('click', addExpense);
    document.getElementById('expenseTableBody').addEventListener('click', handleDeleteClick);
});

let totalAmount = 0;

function addExpense() {
    const expenseName = document.getElementById('expenseName').value.trim();
    const expenseAmount = parseFloat(document.getElementById('expenseAmount').value);

    if (!expenseName || isNaN(expenseAmount) || expenseAmount <= 0) {
        alert('Please enter a valid expense name and amount greater than 0.');
        return;
    }

    const tableBody = document.getElementById('expenseTableBody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>${expenseName}</td>
        <td>Rs.${expenseAmount.toFixed(2)}</td>
        <td><i class="fa fa-trash-o" style="font-size:36px"></i></td>
    `;

    tableBody.appendChild(newRow);

    totalAmount += expenseAmount;
    document.getElementById('totalAmount').textContent = totalAmount.toFixed(2);

    document.getElementById('expenseName').value = '';
    document.getElementById('expenseAmount').value = '';

    saveExpenses();
}

function saveExpenses() {
    const rows = document.querySelectorAll('#expenseTableBody tr');
    const expenses = [];

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const expense = {
            name: cells[0].textContent,
            amount: parseFloat(cells[1].textContent.replace('Rs.', ''))
        };
        expenses.push(expense);
    });

    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function loadExpenses() {
    const data = JSON.parse(localStorage.getItem('expenses') || '[]');
    totalAmount = 0; // Reset total amount

    const tableBody = document.getElementById("expenseTableBody");
    tableBody.innerHTML = ""; // Clear existing rows

    data.forEach(element => {
        if (element.hasOwnProperty('amount')) {
            totalAmount += parseFloat(element.amount);
        }
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${element.name}</td>
            <td>Rs.${element.amount.toFixed(2)}</td>
            <td><i class="fa fa-trash-o" style="font-size:36px"></i></td>
        `;
        tableBody.appendChild(newRow);
    });

    document.getElementById("totalAmount").textContent = totalAmount.toFixed(2);
}

function handleDeleteClick(event) {
    if (event.target.classList.contains('fa-trash-o')) {
        removeExpense(event.target);
    }
}

function removeExpense(deleteIcon) {
    const row = deleteIcon.closest('tr');
    const cells = row.querySelectorAll('td');
    const removedAmount = parseFloat(cells[1].textContent.replace('Rs.', ''));

    row.remove();

    totalAmount -= removedAmount;
    document.getElementById('totalAmount').textContent = totalAmount.toFixed(2);

    saveExpenses();
}
