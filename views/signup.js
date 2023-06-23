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
    });
}
