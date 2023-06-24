function signUpHandler(e) {
  e.preventDefault();
  console.log("sign up");
  if (e.target.password.value === e.target.cpassword.value) {
    axios
      .post("http://localhost:3000/auth/signup", {
        username: e.target.txt.value,
        email: e.target.email.value,
        phone: e.target.phone.value,
        password: e.target.password.value,
      })
      .then((res) => {
        console.log(res.data);
        document.getElementById("username").value = "";
        document.getElementById("semail").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("spassword").value = "";
        document.getElementById("scpassword").value = "";
        document.getElementById("chk").checked = true;
        alert("Successfully created account login to continue.");
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      });
  } else {
    alert("Password and confirm Password doesn't match ...!");
  }
}
function loginHandler(e) {
  e.preventDefault();
  console.log("login");
  axios
    .post("http://localhost:3000/auth/signin", {
      email: e.target.email.value,
      password: e.target.password.value,
    })
    .then((res) => {
      console.log(res.data);
      document.getElementById("email").value = "";
      document.getElementById("password").value = "";
      alert("Login successful.");
    })
    .catch((err) => {
      console.log(err);
      alert(err);
    });
}
