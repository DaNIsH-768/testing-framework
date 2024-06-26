const assert = require("assert");

it("Has a text input", async () => {
  const dom = await render("index.html");

  const input = dom.window.document.querySelector("input");
  assert(input);
});

it("shows a success message with valid email", async () => {
  const dom = await render("index.html");

  const email = "abc@xyz.com";

  const input = dom.window.document.querySelector("input");
  input.value = email;
  dom.window.document
    .querySelector("form")
    .dispatchEvent(new dom.window.Event("submit"));

  const h1 = dom.window.document.querySelector("h1");
  assert.strictEqual(h1.innerHTML, "Looks good!");
});

it("shows a fail message with invalid email", async () => {
  const dom = await render("index.html");

  const email = "abcxyz.com";

  const input = dom.window.document.querySelector("input");
  input.value = email;
  dom.window.document
    .querySelector("form")
    .dispatchEvent(new dom.window.Event("submit"));

  const h1 = dom.window.document.querySelector("h1");
  assert.strictEqual(h1.innerHTML, "Invalid email");
});
