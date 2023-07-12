const Sib = require("sib-api-v3-sdk");
const { v4: uuidv4 } = require("uuid");
const Forgot = require("../models/forgot");
const User = require("../models/user");
const path = require("path");
const bcrypt = require("bcrypt");
const sequelize = require("../util/database");

function isStringInvalid(string) {
  if (string == undefined || string.length == 0) {
    return true;
  } else {
    return false;
  }
}

exports.verify = async (req, res, next) => {
  try {
    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.brevo_key;
    const tranEmailApi = new Sib.TransactionalEmailsApi();
    const sender = {
      name: "Rahul Deshmukh",
      email: "rahuldeshmukh4545@gmail.com",
    };
    const to = [{ email: req.body.email }];
    const subject = "Email Verification...";
    const changelink = uuidv4();
    const htmlContent = `<h1>Click on this link to Verify email on expense tracker.</h1><a href='http://localhost:3000/profile/verifyemail/${changelink}' >click here.</a> <p> only if you requsted verification of email</p>`;
    const userI = await User.findOne({ where: { email: req.body.email } });

    if (!userI) {
      throw new Error("USER NOT FOUND");
    }
    const userId = userI.id;
    const forgot = await Forgot.create({
      id: changelink,
      userId,
      isactive: true,
    });
    const resp = await tranEmailApi.sendTransacEmail({
      sender,
      to,
      subject,
      htmlContent,
    });
    res.status(201).json({ message: "email send successfully" });
  } catch (err) {
    res.status(404).json({ message: err, err: err.message });
  }
};

exports.verifyemail = async (req, res, next) => {
  try {
    const id = req.params.resetId;
    const request = await Forgot.findByPk(id);
    if (!request || !request.isactive) {
      throw new Error({ message: "Inactive Request." });
    }
    const filePath = path.join(__dirname, "..", "views", "verify.html");
    res.sendFile(filePath);
  } catch (err) {
    res.sendFile(path.join(__dirname, "..", "views", "notfound.html"));
    console.log(err.message);
  }
};

exports.verifyemailfinal = async (req, res, next) => {
  const t = await sequelize.transaction();
  const { email, url } = req.body;
  try {
    if (isStringInvalid(email) || isStringInvalid(url)) {
      throw new Error("Bad Request.");
    }
    const forgotLink = await Forgot.findOne({ where: { id: url } });
    if (!forgotLink.isactive) {
      throw new Error("Invalid Link");
    }

    try {
      const promise1 = forgotLink.update(
        { isactive: false },
        { transaction: t }
      );
      const promise2 = User.update(
        { verified: true },
        { where: { id: forgotLink.userId, email: email } },
        { transaction: t }
      );
      await Promise.all([promise1, promise2]);
      await t.commit();
      res.status(201).json({ message: "Email Verified Successfully" });
    } catch (err) {
      await t.rollback();
      res.status(403).json({ message: err });
    }
  } catch (err) {
    res.status(401).json({ message: err });
  }
};
