function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return document.querySelectorAll(selector);
}

async function fetchGet(action, callback) {
  try {
    const response = await fetch(action, {
      method: "GET",
    });

    const data = await response.json();

    callback(data);
  } catch (err) {
    console.log(err);
  }
}

async function fetchPost(action, body, callback) {
  try {
    const response = await fetch(action, {
      method: "POST",

      body: JSON.stringify(body),

      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    const data = await response.json();

    callback(data);
  } catch (err) {
    console.log(err);
  }
}

async function fetchDelete(action, callback) {
  try {
    const response = await fetch(action, {
      method: "DELETE",
    });

    const data = await response.json();

    callback(data);
  } catch (err) {
    console.log(err);
  }
}

async function fetchPut(action, body, callback) {
  try {
    const response = await fetch(action, {
      method: "PUT",

      body: JSON.stringify(body),

      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    const data = await response.json();

    callback(data);
  } catch (err) {
    console.log(err);
  }
}
