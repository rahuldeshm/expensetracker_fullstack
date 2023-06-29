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

exports.forgot = async (req, res, next) => {
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
    const subject = "Forgot Password Clicked...";
    const changelink = uuidv4();
    const htmlContent = `<h1>Click on this link to update the password.</h1><a href='http://localhost:3000/auth/resetpasspage/${changelink}' >click here</a>`;
    const userI = await User.findOne({ where: { email: req.body.email } });
    const userId = userI.id;
    if (!userId) {
      throw new Error("USER NOT FOUND");
    }
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
    res.status(404).json({ message: err });
  }
};

exports.resetpasspage = async (req, res, next) => {
  try {
    const id = req.params.resetId;
    const request = await Forgot.findByPk(id);
    if (!request || !request.isactive) {
      throw new Error({ message: "Inactive Request." });
    }
    const filePath = path.join(__dirname, "..", "views", "resetpass.html");
    res.sendFile(filePath);
  } catch (err) {
    res.sendFile(path.join(__dirname, "..", "views", "notfound.html"));
    console.log(err.message);
  }
};

exports.resetpass = async (req, res, next) => {
  const t = await sequelize.transaction();
  const { password, url } = req.body;
  try {
    if (isStringInvalid(password) || isStringInvalid(url)) {
      throw new Error("Bad Request.");
    }
    const forgotLink = await Forgot.findOne({ where: { id: url } });
    if (!forgotLink.isactive) {
      throw new Error("Invalid Link");
    }
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        throw err;
      }
      try {
        const promise1 = forgotLink.update(
          { isactive: false },
          { transaction: t }
        );
        const promise2 = User.update(
          { password: hash },
          { where: { id: forgotLink.userId } },
          { transaction: t }
        );
        await Promise.all([promise1, promise2]);
        await t.commit();
        res.status(201).json({ message: "Password Updated Successfully" });
      } catch (err) {
        await t.rollback();
        res.status(403).json({ message: err });
      }
    });
  } catch (err) {
    res.status(401).json({ message: err });
  }
};
