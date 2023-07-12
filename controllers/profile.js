exports.updateProfile = async (req, res, next) => {
  try {
    req.user.update(req.body);
    res.status(201).json({ message: "Profile Updated Successfully" });
  } catch (err) {
    res.status(401).json({ message: "error occured while updating", err });
  }
};
