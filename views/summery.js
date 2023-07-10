const token = JSON.parse(localStorage.getItem("token"));

function fetchDownload() {
  axios
    .get("http://localhost:3000/premium/download", {
      headers: { authorisation: token.token },
    })
    .then((response) => {
      // data=response;
      console.log(response.data);
      // response.data.map((e) => {
      //   showonLeader(e);
      // });
    })
    .catch((err) => {
      console.log(err);
    });
}
