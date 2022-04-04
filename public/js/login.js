(() => {
  const loginBtn = qs("#login");

  const errorEl = qs("#error");

  const usernameEl = qs("#username");

  const passwordEl = qs("#password");

  function sendLoginForm(form) {
    fetchPost("/login", form, (data) => {
      if (data.success) return (window.location.href = "/todos");
      errorEl.innerText = data.msg;
    });
  }

  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const form = {
      username: usernameEl.value,
      password: passwordEl.value,
    };

    sendLoginForm(form);
  });
})();
