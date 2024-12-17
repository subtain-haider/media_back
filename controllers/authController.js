const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { success, error } = require("../utils/apiResponse");

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    success(res, "User registered successfully");
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return error(res, "Invalid credentials", 401);

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return error(res, "Invalid credentials", 401);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "12h" });
    success(res, "Login successful", { token });
};
