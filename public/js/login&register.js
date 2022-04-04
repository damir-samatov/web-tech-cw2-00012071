(() => {
  document.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^A-Za-z0-9_]/g, "");
  });

  const showPasswordToggleEl = qs("#showPassword");

  const passwordEls = qsa("[type=password]");

  showPasswordToggleEl.addEventListener("change", () => {
    for (el of passwordEls) {
      if (showPasswordToggleEl.checked) el.type = "text";
      else el.type = "password";
    }
  });
})();
