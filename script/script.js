"use strict";
//inputs
const transactionEl = document.getElementById("transaction");
const amountEl = document.getElementById("amount");
const transactionTrackerEl = document.getElementById("transaction-tracker");
const submitEl = document.getElementById("submit");
//outputs
const listContainer = document.getElementById("list-container");
const balanceContainer = document.getElementById("balance");
const alertEl = document.getElementById("alert");
//global variable
// let items = [
// { id: 1, transaction: "Salary", amount: 15000 }
// ];

let items = localStorage.getItem("transaction")
  ? JSON.parse(localStorage.getItem("transaction"))
  : [];

let balance = null;
let negativeValue = 0;

const successToast = () => {
  alertEl.classList.remove("danger");

  alertEl.style.display = "block";
  alertEl.classList.add("success");
  alertEl.innerText = `✔ Transaction Added`;
};

const delToast = () => {
  alertEl.style.display = "block";
  alertEl.classList.add("danger");
  alertEl.innerText = `✔ Transaction Deleted`;
};

const toastHide = () => {
  alertEl.style.display = "none";
  alertEl.classList.remove("success");
};

//functions
const init = () => {
  getData(items);
  balanceTemplate();
};

const getData = (item) => {
  listContainer.innerHTML = "";

  item.forEach((element) => {
    listTemplate(element);
  });
};

const makeTransactionCaps = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const makeCommonAmount = (str) => {
  if (str.charAt(0) === "-") {
    return str.slice(1);
  } else {
    return str;
  }
};

const listTemplate = (item) => {
  const { id, transaction, amount } = item;
  const type = amount > 0 ? "plus" : "minus";
  const list = document.createElement("div");
  list.classList.add("list");
  list.innerHTML = `
    <span class="${type}">
    <h4>${makeTransactionCaps(transaction)}</h4>
    <p>₹${makeCommonAmount(amount.toFixed(2))}</p>
    </span>
    <button onClick="deleteRow(${id})" class='btn del'>X</button>
    `;
  listContainer.appendChild(list);
};

const deleteRow = (id) => {
  items = items.filter((item) => item.id !== id);
  console.log(items);
  localStorage.setItem("transaction", JSON.stringify(items));
  delToast();
  setTimeout(() => {
    toastHide();
  }, 2000);
  getData(items);
  balanceTemplate(items);
};

const balanceTemplate = () => {
  // Filter items with negative values
  const negativeItems = items
    .filter((item) => item.amount < 0)
    .reduce((total, item) => total + item.amount, 0);

  // Filter items with positive values
  const positiveItems = items
    .filter((item) => item.amount > 0)
    .reduce((total, item) => total + item.amount, 0);

  balance = Number(positiveItems) + negativeItems;
  console.log(negativeItems);
  console.log(Number(positiveItems));
  console.log(balance);

  balanceContainer.innerHTML = `<p class="balance-amount">Balance: ${balance.toFixed(
    2
  )}</p> 
    <p class="expense-amount">Expenses: ${negativeItems.toFixed(2)}</p>`;
};

const nullishValue = () => {
  transactionEl.value = null;
  amountEl.value = null;
  transactionTrackerEl.value = "Select your action";
};

//events
submitEl.addEventListener("click", () => {
  const transaction = transactionEl.value;
  const amount = Number(amountEl.value);
  const tracker = transactionTrackerEl.value;

  if (tracker === "expense") {
    negativeValue = -amount;
  }
  // console.log(transaction, ":", tracker === "expense" ? negativeValue : amount)
  const newData = {
    id: Date.now(),
    transaction: transaction,
    amount: tracker === "expense" ? negativeValue : amount,
  };

  console.log(newData);
  items.push(newData);

  localStorage.setItem("transaction", JSON.stringify(items));

  console.log(items);
  balanceTemplate();
  nullishValue();
  successToast();
  setTimeout(() => {
    toastHide();
  }, 2000);
  getData(items);
});

//initial settings
init();
