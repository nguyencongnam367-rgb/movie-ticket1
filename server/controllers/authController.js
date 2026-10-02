    const pool = require("../config/db");
    const bcrypt = require("bcryptjs");
    const jwt = require("jsonwebtoken");
    require("dotenv").config();

    const register = async (req, res) => {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({
                    message: "Vui lòng nhập đầy đủ thông tin"
                });
            }

            if (password.length < 6) {
                return res.status(400).json({
                    message: "Mật khẩu phải có ít nhất 6 ký tự"
                });
            }

            const [existingUser] = await pool.query(
                "SELECT * FROM users WHERE email = ?",
                [email]
            );

            if (existingUser.length > 0) {
                return res.status(400).json({
                    message: "Email đã được sử dụng"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const [result] = await pool.query(
                `INSERT INTO users (name, email, password, role)
                VALUES (?, ?, ?, 'CUSTOMER')`,
                [name, email, hashedPassword]
            );

            res.status(201).json({
                message: "Đăng ký thành công",
                user: {
                    id: result.insertId,
                    name,
                    email,
                    role: "CUSTOMER"
                }
            });

        } catch (error) {
            console.error("Register error:", error);

            res.status(500).json({
                message: "Lỗi server"
            });
        }
    };


    const login = async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    message: "Vui lòng nhập email và mật khẩu"
                });
            }

            const [users] = await pool.query(
                "SELECT * FROM users WHERE email = ?",
                [email]
            );

            if (users.length === 0) {
                return res.status(401).json({
                    message: "Email hoặc mật khẩu không đúng"
                });
            }

            const user = users[0];

            const isPasswordCorrect = await bcrypt.compare(
                password,
                user.password
            );

            if (!isPasswordCorrect) {
                return res.status(401).json({
                    message: "Email hoặc mật khẩu không đúng"
                });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET || "movie_ticket_secret_key",
                {
                    expiresIn: "1d"
                }
            );

            res.json({
                message: "Đăng nhập thành công",
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });

        } catch (error) {
            console.error("Login error:", error);

            res.status(500).json({
                message: "Lỗi server"
            });
        }
    };


    module.exports = {
        register,
        login
    };