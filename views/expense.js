// console.log("rahul")
var editid;
const token = JSON.parse(localStorage.getItem("token"));
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

  axios
    .post("http://localhost:3000/expense/expenses", myObj, {
      headers: { authorisation: token.token },
    })
    .then((response) => {
      showondom(response.data);
      editid = null;
      document.getElementById("amount").value = "";
      document.getElementById("discription").value = "";
      document.getElementById("categery").value = "";
    })
    .catch((err) => console.log(err));
}
document.addEventListener("DOMContentLoaded", fatchlocaldata);
function fatchlocaldata() {
  // let datakeys = Object.keys(localStorage);
  axios
    .get("http://localhost:3000/expense/expenses", {
      headers: { authorisation: token.token },
    })
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
  li.classList.add("liitem");
  const deletebtn = document.createElement("button");
  const editbtn = document.createElement("button");
  deletebtn.className = "dbtn";
  deletebtn.innerHTML = "Delete";
  editbtn.className = "ebtn";
  editbtn.innerHTML = "Edit";
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
      .delete(lin, {
        headers: { authorisation: token.token },
      })
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
