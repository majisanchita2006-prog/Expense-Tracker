const form = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const monthFilter = document.getElementById("month-filter");

// Load saved expenses
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// Give older expenses a date so they can be displayed and deleted
expenses = expenses.map(expense => ({
    ...expense,
    date: expense.date || new Date().toISOString(),
    id: expense.id || Date.now() + Math.random()
}));

function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Generate month dropdown
function loadMonths() {
    const now = new Date();

    for (let i = 0; i < 12; i++) {
        const date = new Date(
            now.getFullYear(),
            now.getMonth() - i,
            1
        );

        const year = date.getFullYear();
        const month = date.getMonth();

        const option = document.createElement("option");

        option.value = `${year}-${String(month + 1).padStart(2, "0")}`;

        option.textContent = date.toLocaleString("en-IN", {
            month: "long",
            year: "numeric"
        });

        monthFilter.appendChild(option);
    }

    monthFilter.selectedIndex = 1;
}

// Update overall summary
function updateSummary() {
    const total = expenses.reduce(
        (sum, expense) => sum + expense.amount, 0
    );

    document.getElementById("total").textContent =
        `₹${total.toFixed(2)}`;

    document.getElementById("count").textContent =
        expenses.length;
}

// Display monthly expenses
function displayExpenses() {
    expenseList.innerHTML = "";

    const selectedMonth = monthFilter.value;

    const filteredExpenses = expenses.filter(expense => {
        const date = new Date(expense.date);

        const expenseMonth =
            `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

        return expenseMonth === selectedMonth;
    });

    const monthlyTotal = filteredExpenses.reduce(
        (sum, expense) => sum + expense.amount, 0
    );

    document.getElementById("monthly-total").textContent =
        `₹${monthlyTotal.toFixed(2)}`;

    if (filteredExpenses.length === 0) {
        expenseList.innerHTML =
            '<p class="empty">No expenses found for this month.</p>';
    }

    filteredExpenses.forEach(expense => {
        const item = document.createElement("div");
        item.className = "expense-item";

        const details = document.createElement("div");

        const title = document.createElement("strong");
        title.textContent = expense.name;

        const category = document.createElement("p");
        category.textContent = expense.category;

        details.append(title, category);

        const amount = document.createElement("strong");
        amount.textContent = `₹${expense.amount.toFixed(2)}`;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            expenses = expenses.filter(e => e.id !== expense.id);

            saveExpenses();
            updateSummary();
            displayExpenses();
        });

        item.append(details, amount, deleteButton);
        expenseList.appendChild(item);
    });
}

// Add expense
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const amount = Number(document.getElementById("amount").value);
    const category = document.getElementById("category").value;

    if (!name || !Number.isFinite(amount) || amount <= 0 || !category) {
        alert("Please enter valid expense details.");
        return;
    }

    expenses.push({
        id: Date.now() + Math.random(),
        name,
        amount,
        category,
        date: new Date().toISOString()
    });

    saveExpenses();

    form.reset();
    updateSummary();
    displayExpenses();
});

// Month filter
monthFilter.addEventListener("change", displayExpenses);

// Refresh button
document.getElementById("refresh-btn").addEventListener("click", () => {
    expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    updateSummary();
    displayExpenses();
});

// Clear all expenses
document.getElementById("clear-btn").addEventListener("click", () => {
    if (expenses.length === 0) {
        alert("There are no expenses to clear.");
        return;
    }

    const confirmClear = confirm(
        "Are you sure you want to delete ALL expenses? This cannot be undone."
    );

    if (confirmClear) {
        expenses = [];

        saveExpenses();
        updateSummary();
        displayExpenses();

        alert("All expenses have been cleared!");
    }
});

// Initialize application
loadMonths();
saveExpenses();
updateSummary();
displayExpenses();
