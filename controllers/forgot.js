const Sib = require("sib-api-v3-sdk");
const { v4: uuidv4 } = require("uuid");
const Forgot = require("../models/forgot");
const User = require("../models/user");
const path = require("path");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");

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
    const htmlContent = `<h1>Click on this link to update the password.</h1><a href='http://localhost:3001/auth/resetpasspage/${changelink}' >click here</a>`;
    const userI = await User.findOne({ email: req.body.email });

    if (!userI) {
      throw new Error("USER NOT FOUND");
    }
    const userId = userI.id;
    const forgot = new Forgot({ id: changelink, userId, isactive: true });
    await forgot.save();
    const resp = await tranEmailApi.sendTransacEmail({
      sender,
      to,
      subject,
      htmlContent,
    });
    res.status(201).json({ message: "email send successfully" });
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err, err: err.message });
  }
};

exports.resetpasspage = async (req, res, next) => {
  try {
    const id = req.params.resetId;
    const request = await Forgot.find({ id: id }).exec();
    if (!request[0] || !request[0].isactive) {
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
  const url = req.params.resetId;
  const password = req.body.password;
  const confirmPassword = req.body.cpassword;
  try {
    if (isStringInvalid(password) || isStringInvalid(url)) {
      throw new Error("Bad Request.");
    }
    if (password !== confirmPassword) {
      throw new Error("Bad Request.");
    }
    const forgotLink = await Forgot.findOne({ id: url }).exec();
    if (!forgotLink.isactive) {
      throw new Error("Invalid Link");
    }
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        throw err;
      }
      const session = await mongoose.startSession();
      try {
        session.startTransaction();
        const promise1 = Forgot.updateOne(
          { id: url },
          { isactive: false }
        ).session(session);
        const promise2 = User.updateOne(
          { _id: forgotLink.userId },
          { password: hash }
        ).session(session);
        await Promise.all([promise1, promise2]);
        await session.commitTransaction();
        session.endSession();
        res.status(201).json({ message: "Password Updated Successfully" });
      } catch (err) {
        console.log(err);
        await session.abortTransaction();
        session.endSession;
        res.status(403).json({ message: err });
      }
    });
  } catch (err) {
    console.log(err, ">>>>>>>");
    res.status(401).json({ message: err });
  }
};
