(() => {
  const logoutBtn = qs("#logout");

  const todoForm = qs("#todoForm");

  const editTodoTitleEl = qs("#todoTitle");

  const editTodoTaskEl = qs("#todoTask");

  const editTodoPriorityEl = qs("#todoPriority");

  const todoSaveBtn = qs("#saveTodo");

  const createTodoBtn = qs("#createTodo");

  const cancelSaveBtn = qs("#cancelSave");

  logoutBtn.addEventListener("click", () => {
    fetchDelete("/logout", (data) => {
      if (!data.success) return;
      window.location.href = "/login";
    });
  });

  cancelSaveBtn.addEventListener("click", () => {
    todoForm.classList.remove("show");
    createTodoBtn.classList.remove("hide");
  });

  createTodoBtn.addEventListener("click", () => {
    todoForm.setAttribute("data-todo", "createTodo");
    todoForm.classList.add("show");
    createTodoBtn.classList.add("hide");
  });

  document.addEventListener("click", (e) => {
    const element = e.target;

    if (element.hasAttribute("data-cancel")) {
      const id = element.getAttribute("data-cancel");

      fetchDelete(`/todos/cancel/${id}`, (data) => {
        if (!data.success) return;
        window.location.href = "/todos";
      });
      return;
    }

    if (element.hasAttribute("data-complete")) {
      const id = element.getAttribute("data-complete");

      fetchDelete(`/todos/complete/${id}`, (data) => {
        if (!data.success) return;
        window.location.href = "/todos";
      });
      return;
    }

    if (element.hasAttribute("data-todo")) {
      const id = element.getAttribute("data-todo");
      fetchGet(`/todos/${id}`, (data) => {
        if (!data.success) return;

        const todo = data.todo;

        todoForm.setAttribute("data-todo", id);

        editTodoTitleEl.value = todo.title;

        editTodoTaskEl.value = todo.task;

        editTodoPriorityEl.value = todo.priority;

        todoForm.classList.add("show");
        createTodoBtn.classList.add("hide");
      });
      return;
    }
  });

  todoSaveBtn.addEventListener("click", (e) => {
    const id = todoForm.getAttribute("data-todo");

    if (!id) return;

    if (id === "createTodo") return createNewTodo();

    const body = {
      title: editTodoTitleEl.value,
      task: editTodoTaskEl.value,
      priority: editTodoPriorityEl.value,
    };

    const { title, task, priority } = body;

    if (title.trim() === "" || task.trim() === "" || priority.trim() === "") {
      return;
    }
    console.log("clicked");

    fetchPut(`/todos/edit/${id}`, body, (data) => {
      if (!data.success) return;
      window.location.href = "/todos";
    });
  });

  function createNewTodo() {
    const body = {
      title: editTodoTitleEl.value,
      task: editTodoTaskEl.value,
      priority: editTodoPriorityEl.value,
    };

    const { title, task, priority } = body;

    if (title.trim() === "" || task.trim() === "" || priority.trim() === "") {
      return;
    }

    fetchPost(`/todos/create`, body, (data) => {
      if (!data.success) return;
      window.location.href = "/todos";
    });
  }
})();
