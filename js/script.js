// Variable Declaration //

const myModalElement = document.getElementById("MyModal");
const Mymodal = new bootstrap.Modal(myModalElement);
const btnAdd = document.getElementById("btnAdd");
const txtTask = document.getElementById("task");
const selectStatus = document.getElementById("status");
const taskForm = document.getElementById("taskForm");
const btnSave = document.getElementById("btnSave");
const modelTitle = document.getElementById("ModelTitle");
const searchInput = document.getElementById("Searchinput");

// Add Data //

btnAdd.addEventListener("click", function () {
  modelTitle.innerHTML = "Add New Task";
  txtTask.value = "";
  selectStatus.value = "";
  Mymodal.show();
});

// LocalStorage Save //

function GetTasks() {
  let tasks = [];
  if (localStorage.getItem("task")) {
    tasks = JSON.parse(localStorage.getItem("task"));
  }
  return tasks;
}

// Task Details //

function handleTaskDetails(isForSearch = 0, filteredTask = []) {
  let Data = [];
  if (isForSearch == 0) {
    Data = GetTasks();
  } else {
    Data = filteredTask;
  }
  const Datalist = document.getElementById("DataList");
  Datalist.innerHTML = "";
  Data.map((data, index) => {
    const row = `
    <tr>
        <td>${index + 1}</td>
        <td>${data.taskName}</td>
        <td>${data.status}</td>
        <td><a href="#" class="text-primary border border-primary py-1 px-2" onclick="handleEditTask(${
          data.id
        })"><i class="bi bi-pencil-square"></i></a></td>
        <td><a href="#" class="text-danger border border-danger py-1 px-2" onclick="handleDeletedata(${
          data.id
        })"><i class="bi bi-trash"></i></a></td>

    </tr>`;
    Datalist.innerHTML += row;
  });
}

// Save Data //

function handleSaveData(task) {
  localStorage.setItem("task", JSON.stringify(task));
}

// Delete Data //

function handleDeletedata(taskid) {
  if (confirm("Are You Sure to Delete.")) {
    const Data = GetTasks();
    const UpdateData = Data.filter((task) => task.id !== taskid);
    handleSaveData(UpdateData);
    handleTaskDetails();
  }
}

//Form Data Submit //

taskForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const taskname = txtTask.value;
  const selectedStatus = selectStatus.value;
  const taskId = Number(btnSave.getAttribute("data-taskid"));
  if (taskname && selectedStatus) {
    if (taskId) {
      // Task Update //
      handleUpdateTask(taskId, taskname, selectedStatus);
    } else {
      handleAddtask(taskname, selectedStatus);
    }
    Mymodal.hide();
  } else {
    alert("please enter task name && select status");
  }
});

// Add Task//

function handleAddtask(taskName, status) {
  const Data = GetTasks();
  const newTask = {
    id: Date.now(),
    taskName,
    status,
  };
  Data.push(newTask);
  handleSaveData(Data);
  handleTaskDetails();
}

// Update Task

function handleUpdateTask(id, taskName, status) {
  const Data = GetTasks();
  const UpdatedData = Data.map((task) => {
    if (task.id == id) {
      task.taskName = taskName;
      task.status = status;
    }
    return task;
  });
  handleSaveData(UpdatedData);
  handleTaskDetails();
}

// Edit Task

function handleEditTask(id) {
  const Data = GetTasks();
  const task = Data.find((task) => task.id == id);
  if (task) {
    txtTask.value = task.taskName;
    selectStatus.value = task.status;
    btnSave.setAttribute("data-taskid", task.id);
    modelTitle.innerHTML = "Update Task";
    Mymodal.show();
  }
}

//Search list

searchInput.addEventListener("input", function () {
  const searchQuery = this.value.toLowerCase();
  const Data = GetTasks();
  const filterTask = Data.filter((task) =>
    task.taskName.toLowerCase().includes(searchQuery)
  );
  handleTaskDetails(1, filterTask);
});

handleTaskDetails();
