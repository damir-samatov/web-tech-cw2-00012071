(() => {
  const todoForm = qs("#todoForm");

  const editTodoTitleEl = qs("#todoTitle");

  const editTodoTaskEl = qs("#todoTask");

  const editTodoPriorityEl = qs("#todoPriority");

  const todoSaveBtn = qs("#saveTodo");

  const createTodoBtn = qs("#createTodo");

  createTodoBtn.addEventListener("click", () => {
    todoForm.setAttribute("data-todo", "createTodo");
    todoForm.classList.add("show");
  });

  document.addEventListener("click", (e) => {
    const element = e.target;

    if (element.hasAttribute("data-delete")) {
      const id = element.getAttribute("data-delete");

      fetchDelete(`/todos/cancel/${id}`, (data) => {
        if (!data.success) return;
        window.location.href = "/todos";
      });
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
      });
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

    if (!body.title || !body.task || !body.priority) return;

    fetchPost(`/todos/create`, body, (data) => {
      if (!data.success) return;
      window.location.href = "/todos";
    });
  }
})();
