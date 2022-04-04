(() => {
  const registerBtn = qs("#register");

  const errorEl = qs("#error");

  const usernameEl = qs("#username");

  const passwordEl = qs("#password");

  const confirmPasswordEl = qs("#confirmPassword");

  function sendRegisterForm(form) {
    fetchPost("/register", form, (data) => {
      if (data.success) return (window.location.href = "/login");
      errorEl.innerText = data.msg;
    });
  }

  registerBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const form = {
      username: usernameEl.value,
      password: passwordEl.value,
      confirmPassword: confirmPasswordEl.value,
    };

    if (form.password.length < 8 || form.confirmPassword.length < 8) {
      errorEl.innerText = "Password is too short";
      return;
    }

    if (form.password !== form.confirmPassword) {
      errorEl.innerText = "Passwords must match";
      return;
    }

    sendRegisterForm(form);
  });
})();
