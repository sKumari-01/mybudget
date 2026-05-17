let expenses =
JSON.parse(localStorage.getItem("expenses"))
|| [];

let budget =
Number(localStorage.getItem("budget"))
|| 0;

const expenseList =
document.getElementById("expenseList");

const budgetAmount =
document.getElementById("budgetAmount");

const expenseAmount =
document.getElementById("expenseAmount");

const remainingAmount =
document.getElementById("remainingAmount");

const transactionCount =
document.getElementById("transactionCount");

let chart;

function saveData(){

  localStorage.setItem(
    "expenses",
    JSON.stringify(expenses)
  );

  localStorage.setItem(
    "budget",
    budget
  );
}

function updateSummary(){

  const totalExpense =
  expenses.reduce(
    (total,item)=>
    total + Number(item.amount),
    0
  );

  budgetAmount.innerText = budget;

  expenseAmount.innerText = totalExpense;

  remainingAmount.innerText =
  budget - totalExpense;

  transactionCount.innerText =
  expenses.length;
}

function renderExpenses(data){

  expenseList.innerHTML = "";

  data.forEach((expense,index)=>{

    const div =
    document.createElement("div");

    div.className =
    "expense-item";

    div.innerHTML = `

      <div class="expense-info">

        <h3>${expense.title}</h3>

        <p>
          ₹${expense.amount}
          •
          ${expense.category}
          •
          ${expense.date}
        </p>

      </div>

      <div class="action-buttons">

        <button class="edit-btn"
        onclick="editExpense(${index})">

          Edit

        </button>

        <button class="delete-btn"
        onclick="deleteExpense(${index})">

          Delete

        </button>

      </div>
    `;

    expenseList.appendChild(div);
  });

  renderChart(data);

  updateSummary();
}

function renderChart(data){

  const categories = {};

  data.forEach(exp=>{

    categories[exp.category] =
    (categories[exp.category] || 0)
    + Number(exp.amount);
  });

  const ctx =
  document.getElementById("expenseChart");

  if(chart){
    chart.destroy();
  }

  chart = new Chart(ctx,{

    type:"doughnut",

    data:{

      labels:Object.keys(categories),

      datasets:[{

        data:Object.values(categories),

        borderWidth:2
      }]
    },

    options:{

      responsive:true,

      plugins:{

        legend:{

          labels:{
            color:"white"
          }
        }
      }
    }
  });
}

document.getElementById("addExpenseBtn")
.addEventListener("click",()=>{

  const title =
  document.getElementById("title").value;

  const amount =
  document.getElementById("amount").value;

  const category =
  document.getElementById("category").value;

  const date =
  document.getElementById("date").value;

  if(!title || !amount || !date){

    alert("Please fill all fields");

    return;
  }

  expenses.push({

    title,
    amount,
    category,
    date
  });

  saveData();

  renderExpenses(expenses);

  document.getElementById("title").value = "";

  document.getElementById("amount").value = "";

  document.getElementById("date").value = "";
});

function deleteExpense(index){

  expenses.splice(index,1);

  saveData();

  renderExpenses(expenses);
}

function editExpense(index){

  const exp = expenses[index];

  document.getElementById("title").value =
  exp.title;

  document.getElementById("amount").value =
  exp.amount;

  document.getElementById("category").value =
  exp.category;

  document.getElementById("date").value =
  exp.date;

  deleteExpense(index);
}

document.getElementById("setBudgetBtn")
.addEventListener("click",()=>{

  budget =
  Number(
    document.getElementById("budgetInput").value
  );

  saveData();

  updateSummary();
});

document.getElementById("searchInput")
.addEventListener("input",(e)=>{

  const value =
  e.target.value.toLowerCase();

  const filtered =
  expenses.filter(exp=>

    exp.title.toLowerCase()
    .includes(value)

    ||

    exp.category.toLowerCase()
    .includes(value)
  );

  renderExpenses(filtered);
});

document.getElementById("filterCategory")
.addEventListener("change",(e)=>{

  const category =
  e.target.value;

  if(category === "All"){

    renderExpenses(expenses);

    return;
  }

  const filtered =
  expenses.filter(exp=>

    exp.category === category
  );

  renderExpenses(filtered);
});

document.getElementById("exportBtn")
.addEventListener("click",()=>{

  let csv =
  "Title,Amount,Category,Date\n";

  expenses.forEach(exp=>{

    csv +=
    `${exp.title},${exp.amount},${exp.category},${exp.date}\n`;
  });

  const blob =
  new Blob([csv],{
    type:"text/csv"
  });

  const url =
  URL.createObjectURL(blob);

  const a =
  document.createElement("a");

  a.href = url;

  a.download = "expenses.csv";

  a.click();
});

document.getElementById("themeBtn")
.addEventListener("click",()=>{

  document.body.classList
  .toggle("dark-mode");
});

renderExpenses(expenses);