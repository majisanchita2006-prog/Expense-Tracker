const form = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

function displayExpenses() {
    expenseList.innerHTML = "";

    let total = 0;

    document.getElementById("count").textContent = expenses.length;

    if (expenses.length === 0) {
        expenseList.innerHTML = '<p class="empty">No expenses added yet.</p>';
    }

    expenses.forEach((expense) => {
        total += expense.amount;

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
            displayExpenses();
        });

        item.append(details, amount, deleteButton);
        expenseList.appendChild(item);
    });

    document.getElementById("total").textContent =
        `₹${total.toFixed(2)}`;
}

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
        category
    });

    saveExpenses();
    displayExpenses();

    form.reset();
});

displayExpenses();