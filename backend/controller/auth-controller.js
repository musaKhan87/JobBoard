const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Simple authentication for demo purposes
    if (username === "musa" && password === "musa1234") {
      res.json({
        success: true,
        token: "admin-token",
        user: {
          id: "admin",
          username: "admin",
          role: "admin",
        },
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/auth/logout - Admin logout
const adminLogout=async (req,res) => {
  res.json({ success: true, message: "Logged out successfully" });
}

module.exports = { adminLogin ,adminLogout};
