const Sib = require("sib-api-v3-sdk");

exports.forgot = (req, res, next) => {
  console.log(req.body);
  const client = Sib.ApiClient.instance;
  const apiKey = client.authentications["api-key"];
  apiKey.apiKey = process.env.brevo_key;
  const tranEmailApi = new Sib.TransactionalEmailsApi();
  const sender = {
    name: "Rahul Deshmukh",
    email: "rahuldeshmukh4545@gmail.com",
  };
  const receivers = [
    {
      email: req.body.email,
    },
  ];
  tranEmailApi
    .sendTransacEmail({
      sender,
      to: receivers,
      subject:
        "this is the dummy email from expense tracker to update the password",
      textContent: "this is how we can send and receive mails",
      htmlContent: `
      <h1>this is the link</h1><a href='https://github.com/rahuldeshm' >click here</a>`,
    })
    .then((resp) => {
      console.log(resp);
      res.status(201).json({ message: "email send successfully" });
    })
    .catch((err) => console.log(err));
};
