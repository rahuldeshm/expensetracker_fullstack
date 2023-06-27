const raserbtn = document.getElementById("premium");
if (token.ispremium) {
  raserbtn.innerHTML = "Premium User";
  raserbtn.className = "ebtn";
  document.getElementById("leaderboard").className = "card";
}
raserbtn.addEventListener("click", raserHandler);
async function raserHandler(e) {
  e.preventDefault();
  if (token.ispremium) {
    return;
  }
  try {
    const response = await axios.post(
      "http://localhost:3000/payment/createorder",
      {},
      {
        headers: { authorisation: token.token },
      }
    );
    if (!!response) {
      console.log(response.data);
      const options = {
        key: response.data.key_id,
        order_id: response.data.order.id,
        handler: async function (payres) {
          const updateres = await axios.post(
            "http://localhost:3000/payment/update",
            {
              order_id: options.order_id,
              payment_id: payres.razorpay_payment_id,
            },
            { headers: { authorisation: token.token } }
          );
          const newtoken = { ...token };
          newtoken.ispremium = true;
          localStorage.setItem("token", JSON.stringify(newtoken));
          document.getElementById("leaderboard").className = "card";
          document.getElementById("premium").innerHTML = "Premium User";
          document.getElementById("premium").className = "ebtn";
          alert(updateres.data.message);
        },
      };
      const rzpl = new Razorpay(options);
      rzpl.open();
      rzpl.on("payment.failed", async function () {
        try {
          const updatere = await axios.post(
            "http://localhost:3000/payment/update",
            {
              order_id: options.order_id,
              payment_id: null,
            },
            { headers: { authorisation: token.token } }
          );
          alert(updatere.data.message);
        } catch (err) {
          alert(err);
        }
        rzpl.close();
      });
    } else {
      throw new Error("some error occured");
    }
  } catch (err) {
    console.log(err);
  }
}
