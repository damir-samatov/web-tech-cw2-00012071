function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return document.querySelectorAll(selector);
}

const showPasswordToggleEl = qs("#showPassword");

const passwordEls = qsa("[type=password]");

showPasswordToggleEl.addEventListener("change", () => {
  for (el of passwordEls) {
    if (showPasswordToggleEl.checked) el.type = "text";
    else el.type = "password";
  }
});
