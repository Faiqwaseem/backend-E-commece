const adminTest = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Admin access granted",
    data: {
      userId: req.user._id,
      role: req.user.role,
    },
  });
};

module.exports = {
  adminTest,
};