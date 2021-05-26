const todoInput = document.querySelector(".todo-input");
const addTodo = document.querySelector(".add-todo");
const todoContainer = document.querySelector(".todo-container");
const todoItems = document.querySelector(".todo-items");
const count = document.querySelector("#count");
const active = document.querySelector(".active");
const headerTime = document.querySelector(".header-time");
const headerDate = document.querySelector(".header-date");
const clear = document.querySelector("#clear-completed");
let currPage = document.querySelector(".category");

let allTodos = [];
let todoCount = 0;
const editing = {
  isEditing: false,
  editID: "",
  editTag: null,
};

const renderTimeDateFn = () => {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    weekday: "long",
    month: "short",
  });

  const time = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return { date, time };
};

// setInterval(() => {
//   console.log(1++);
// }, 1000);

let i = 1;
setInterval(showTimer, 1000);

function showTimer() {
  const { date, time } = renderTimeDateFn();
  headerTime.textContent = time;
  headerDate.textContent = date;
}

showTimer();

todoInput.addEventListener("submit", (evt) => {
  evt.preventDefault();

  if (addTodo.value.trim() !== "") {
    // EDIT TODO
    if (editing.isEditing) {
      allTodos.map((item) => {
        if (item.id === editing.editID) {
          item.title = addTodo.value;
        }
        return item;
      });
      editing.editTag.textContent = addTodo.value;
      editing.editID = "";
      editing.isEditing = false;
      editing.editTag = null;
    } else {
      // ADD NEW TODO
      const { date, time } = renderTimeDateFn();

      const id = "" + Math.random();
      const newTodo = {
        id: id.substring(2, 10),
        title: addTodo.value,
        date,
        time,
        isComplete: false,
      };

      allTodos.push(newTodo);

      if (currPage.textContent !== "Completed") {
        renderTodo(newTodo);
      }

      todoContainer.style.display = "block";
    }
  }
  addTodo.value = "";
  todoCount++;
  const activeTodos = allTodos.filter((item) => !item.isComplete);
  count.textContent = activeTodos.length;
});

const renderTodo = (item) => {
  const markup = `<div class="item" id="${item.id}">
<input type="checkbox" id="checkbox-${item.id}" class="input"  />
<label for="checkbox-${item.id}" class="label circle" id="label-${item.id}">
    <img src="./images/icon-check.svg" />
</label>
<div class="item-content">
    <h4>${item.title}</h4>
    <div class="todo-time">

        <p>${item.date}</p>
        <p>${item.time}</p>
    </div>
</div>
<div class="item-cta">
    <button class="btn edit">Edit</button>
    <button class="btn delete">Delete</button>
</div>
</div>`;
  todoItems.insertAdjacentHTML("beforeend", markup);
};

todoItems.addEventListener("click", (evt) => {
  if (!evt.target.className.includes("edit")) {
    return;
  }
  const id = evt.target.parentElement.parentElement.id;
  editing.isEditing = true;
  editing.editID = id;
  editing.editTag =
    evt.target.parentElement.previousElementSibling.firstElementChild;

  addTodo.value = editing.editTag.textContent;
  addTodo.focus();
});

// DELETE TODO

todoItems.addEventListener("click", (evt) => {
  if (!evt.target.className.includes("delete")) {
    return;
  }

  const div = evt.target.parentElement.parentElement;
  const updatedTodos = allTodos.filter((item) => item.id !== div.id);
  allTodos = updatedTodos;

  todoItems.removeChild(div);
  if (allTodos.length < 1) {
    todoContainer.style.display = "none";
  }
  todoCount--;
  count.textContent = todoCount;
});

todoItems.addEventListener("click", (evt) => {
  if (evt.target.nodeName !== "INPUT") {
    return;
  }

  const isComplete = evt.target.checked;
  const id = evt.target.parentElement.id;
  if (isComplete) {
    toggleTodos(id, true);
  } else {
    toggleTodos(id, false);
  }

  if (currPage.textContent === "Active") {
    const div = evt.target.parentElement;
    todoItems.removeChild(div);
  }
  if (currPage.textContent === "Completed") {
    const div = evt.target.parentElement;
    todoItems.removeChild(div);
  }
});

// TOGGLE TODO

const toggleTodos = (id, boolean) => {
  allTodos.map((item) => {
    if (item.id === id) {
      item.isComplete = boolean;
    }
  });

  const label = document.querySelector(`#label-${id}`);
  label.style.backgroundImage = boolean
    ? "linear-gradient(to top left, #71bffc 50%, #a775f0 50%)"
    : "none";
  label.firstElementChild.style.opacity = boolean ? 1 : 0;
  label.nextElementSibling.firstElementChild.style.textDecoration = boolean
    ? "line-through"
    : "none";
};

// ALL PAGE
// const allPage = (evt) => {
//   currPage.classList.remove("category");
//   evt.target.classList.add("category");
//   currPage = evt.target;

//   todoItems.innerHTML = "";
//   allTodos.forEach(renderTodo);
//   showCompeletedTodo(allTodos);
// };

// ACTIVE PAGE
const activePage = (evt) => {
  currPage.classList.remove("category");
  evt.target.classList.add("category");
  currPage = evt.target;

  const activeTodos = allTodos.filter((item) => !item.isComplete);
  todoItems.innerHTML = "";
  activeTodos.forEach(renderTodo);
};

// Completed Page

const completedPage = (evt) => {
  console.log(allTodos);
  currPage.classList.remove("category");
  evt.target.classList.add("category");
  currPage = evt.target;

  const completetedTodos = allTodos.filter((item) => item.isComplete);
  // console.log(completetedTodos);
  todoItems.innerHTML = "";
  completetedTodos.forEach(renderTodo);

  showCompeletedTodo(completetedTodos);
};

const showCompeletedTodo = (arr) => {
  arr.forEach((item) => {
    if (item.isComplete) {
      const label = document.querySelector(`#label-${item.id}`);
      const input = document.querySelector(`#checkbox-${item.id}`);
      input.checked = true;
      console.log(input.checked);
      label.style.backgroundImage =
        "linear-gradient(to top left, #71bffc 50%, #a775f0 50%)";
      label.firstElementChild.style.opacity = 1;
      label.nextElementSibling.firstElementChild.style.textDecoration =
        "line-through";
    }
  });
};

// CLEAR COMPLETED

// clear.addEventListener("click", () => {
//   const updatedTodos = allTodos.filter((item) => !item.isComplete);
//   allTodos.map((item) => {
//     if (item.isComplete) {
//       const div = document.getElementById(`${item.id}`);
//       todoItems.removeChild(div);
//       // console.log(div);
//     }
//   });
//   allTodos = updatedTodos;
//   if (allTodos.length < 1) {
//     todoContainer.style.display = "none";
//   }
// });
