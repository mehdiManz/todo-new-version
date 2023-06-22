"use strict";


const express = require("express");
const mime = require("mime");
const getCurrentDate = require("./date");

const app = express();
const port = 3000;

let items = [
  { id: 1, text: "Buy Food", checked: false },
  { id: 2, text: "Cook Food", checked: false },
  { id: 3, text: "Eat Food", checked: false },
];
let workItems = [];

app.set("view engine", "ejs");

app.use(
  "/public",
  express.static("public", {
    setHeaders: (res, path) => {
      res.setHeader("Content-Type", mime.getType(path));
    },
  })
);

app.use(express.urlencoded({ extended: true }));

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/", (req, res) => {
  const currentDay = getCurrentDate();

  res.render("list", { listTitle: currentDay, items: items });
});

app.post("/", (req, res) => {
  let item = req.body.newItem;
  if (item.trim() !== "") {
    if (req.body.list === "Work List") {
      workItems.push({ id: generateItemId(), text: item, checked: false });
      res.redirect("/work");
    } else {
      items.push({ id: generateItemId(), text: item, checked: false });
      res.redirect("/");
    }
  } else {
    res.redirect("/");
  }
});

app.get("/work", (req, res) => {
  res.render("list", { listTitle: "Work List", items: workItems });
});

app.post("/work", (req, res) => {
  let item = req.body.newItem;
  if (item.trim() !== "") {
    // Check if the input is not empty or only whitespace
    workItems.push({ id: generateItemId(), text: item, checked: false });
  }
  res.redirect("/work");
});

// ...

app.post("/crossoff", (req, res) => {
  const itemId = parseInt(req.body.itemId);
  const listName = req.body.listName;

  if (listName === "Work List") {
    workItems = workItems.filter((item) => item.id !== itemId);
    res.redirect("/work");
  } else {
    items = items.filter((item) => item.id !== itemId);
    res.redirect("/");
  }
});

// ...

function generateItemId() {
  return Math.floor(Math.random() * 1000000);
}

app.listen(port, () => {
  console.log(`Server is happily working on port ${port}`);
});
