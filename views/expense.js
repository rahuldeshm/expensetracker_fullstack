// console.log("rahul")
var editid;
var form = document.getElementById("addForm");
var expancelist = document.getElementById("expances");
form.addEventListener("submit", addExpance);
function addExpance(e) {
  e.preventDefault();

  var newamount = document.getElementById("amount").value;
  var newdiscription = document.getElementById("discription").value;
  var newcategery = document.getElementById("categery").value;

  let myObj = {
    id: editid,
    price: newamount,
    description: newdiscription,
    categary: newcategery,
  };
  if (editid) {
    axios
      .post("http://localhost:3000/expense/expenses", myObj)
      .then((response) => {
        showondom(response.data);
        editid = null;
        document.getElementById("amount").value = "";
        document.getElementById("discription").value = "";
        document.getElementById("categery").value = "";
      })
      .catch((err) => console.log(err));
  } else {
    axios
      .post("http://localhost:3000/expense/expenses", myObj)
      .then((response) => {
        showondom(response.data);
        document.getElementById("amount").value = "";
        document.getElementById("discription").value = "";
        document.getElementById("categery").value = "";
      })
      .catch((err) => console.log(err));
  }
}
document.addEventListener("DOMContentLoaded", fatchlocaldata);
function fatchlocaldata() {
  // let datakeys = Object.keys(localStorage);
  axios
    .get("http://localhost:3000/expense/expenses")
    .then((response) => {
      // data=response;
      console.log(response.data);
      response.data.map((e) => {
        showondom(e);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
function showondom(Obj) {
  console.log("showondom");
  var li = document.createElement("div");
  li.classList.add("form", "rounded", "border", "shadow", "p-4");
  const deletebtn = document.createElement("button");
  const editbtn = document.createElement("button");
  deletebtn.className = "dbtn";
  deletebtn.innerHTML = "Delete Expance";
  editbtn.className = "ebtn";
  editbtn.innerHTML = "Edit Expance";
  li.innerHTML =
    " Expance amount : " +
    Obj.price +
    "<br>" +
    " Discription : " +
    Obj.description +
    "<br>" +
    "categary : " +
    Obj.categary +
    "<br>";
  li.appendChild(deletebtn);
  li.appendChild(editbtn);
  expancelist.appendChild(li);
  deletebtn.onclick = () => {
    let lin = `http://localhost:3000/expense/expenses/${Obj.id}`;
    axios
      .delete(lin)
      .then((response) => {
        expancelist.removeChild(li);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //adding functionality to editbutton
  editbtn.onclick = () => {
    editid = Obj.id;
    document.getElementById("amount").value = Obj.price;
    document.getElementById("discription").value = Obj.description;
    document.getElementById("categery").value = Obj.categary;
    expancelist.removeChild(li);
  };
}
