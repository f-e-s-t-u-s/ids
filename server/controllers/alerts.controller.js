import logger from "../config/logger.js";
import Anomalies from "../models/alerts.js";
import Users from "../models/Users.js";
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt';
import emailSender from "../utils/emailSender.js";


const anomalies = new Anomalies();
const users = new Users();

const handleSendAlert = async (req, res) => {

    try {
        const { alertType, details, time, location } = req.body;
        const subject = `New alert at ${time}`;
        const content = `
        Hello admin,
        You have a new alert that needs your action.
        Details:
        ${alertType},
        ${details},
        Occured at ${time},
        Location: ${location}
        `
        const email = "festusgitahik@gmail.com";

        await emailSender.sendEmail(content, subject, email)
        return res.status(200).json({ message: "Alert sent successfully" });

    } catch (error) {
        logger.error("Error sending alert email");
        throw error;
    }

}

const handleGetAnomalies = async (req, res) => {
    const {packets_type } = req.query;
    try {
        const alerts = await anomalies.getAnomalies(packets_type);
        return res.status(200).json({ message: alerts })
    } catch (error) {
        logger.error("Error sending alert email");
        throw error;
    }
}

const handleLoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // check if user exists
        const userExists = await users.findUserByEmail(email);

        if (!userExists) {
            return res.status(400).json({ message: "Incoreect email or password" });

        }
        const user = userExists[0];

        // check if password is correct;
        if (user)

            // login user and send token


            // todo create token


            return res.status(200).json({ message: "Logged in successfully", auth: true })
    } catch (error) {

    }
}

const handleRegisterUser = async (req, res) => {
    const { name, company_name, email, password } = req.body;

    //  check all the fields
    if (!email || !password || !name | !company_name) {
        return res.status(400).json({ message: "All fields are required " });
    }

    try {
        // check if email is in use
        const emailInUse = await users.findUserByEmail(email);

        if (emailInUse) {
            return res.status(400).json({ message: "Email already in use" });

        }

        // hash the password
        const payload = {
            email: email
        }
        // hash the password
        const hashedPass = await bcrypt.hash(password, 10);
        const data = {
            email,
            password: hashedPass,
            name,
            company_name
        }

        const createUser = await users.registerUser(data);
        if (!createUser) {
            return res
                .status(400)
                .json({ message: "An error occurred while creating account" });
        }
        // create token
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "14d",
        });
        return res.status(200).json({
            message: "User registered successfully, now verify email",
            user_id: createUser.insertId,
            token: "Bearer " + token,
            email: email,
        });
    } catch (error) {
        logger.error("an error occured");
        return res.status(500).json({ message: "Internal server error" });
    }

}


// * handle forgot password
const handleForgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
      // check if user with email exists
      const user = await users.findUserByEmail(email);
      // something is returned, then such user exists
      if (!user) {
        return res
          .status(404)
          .json({ message: "We could not find your email address!" });
      }
     
      // crate code
      const code = generateRandomCode();
      // insert code
      const data = {
        reset_code: code,
        ip_address: req.ip,
        user_agent: req.headers["user-agent"],
        user_id: user.id,
        expiration_time: new Date(Date.now() + 60 * 60 * 1000),
        creation_timestamp: new Date(),
      };
      const insertCode = await users.createForgotPasswordCode(data);
      if (!insertCode) {
        return res.status(400).json({ message: "An error occurred" });
      }
      // send email
      const content = `
      <h2>hello ${user.full_name}You requested a reset password code</h2>
      <p>Code: ${code}
      `
      const subject = "Reset your password";
      await emailSender.sendEmail(content, subject, email);
      return res.status(200).json({
        user_id: user.id,
        message: "A password reset code has been sent to your email",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server error" });
    }
  };
  

export default {
    handleSendAlert,
    handleGetAnomalies,
    handleForgotPassword,
    handleLoginUser,
    handleRegisterUser,
}