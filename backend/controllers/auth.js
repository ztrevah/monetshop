import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cryptoRandomString from 'crypto-random-string';
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
// Check registered email and send verification email
export const register_step1 = (req,res) => {
    // check existing user
    const q = "select * from accounts where email = ?";
    db.query(q,[req.body.email], (err,data) => {
        if(err) return res.json(err);
        if(data.length) return res.status(409).json("User already exists!");
        // Send verification email
        const verification_code = cryptoRandomString({length: 10, type: 'alphanumeric'});
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              user: process.env.SENDMAIL_USERNAME,
              pass: process.env.SENDMAIL_PASSWORD
            }
        });
        const mailOptions = {
            from: {
                name: "Monet shop",
                address: process.env.SENDMAIL_USERNAME,
            },
            to: req.body.email,
            subject: "Verification code for register",
            text: `Your verification code is ${verification_code}. This code will expire in 5 minutes.`
        };
        transporter.sendMail(mailOptions, function(err, info){
            if (err) return res.json(err);

            const q2 = "delete from verification where email = ?";
            db.query(q2,[req.body.email,verification_code], (err,data) => {
                if(err) return res.json(err);
                const q1 = "insert into verification values (?,?,?,now())";
                db.query(q1,[req.body.email,req.body.accountType,verification_code], (err,data) => {
                    if(err) return res.json(err);
                    else return res.status(201).json("Verfication email sent.");
                });
            }); 
             
        });
    })
}
// Check if email is waiting to be verified
export const checkSignupEmail = (req,res) => {
    const q = "select accounttype from verification where email = ?";
    db.query(q,[req.body.email], (err,data)=> {
        if(err) return res.json(err);
        if(data.length === 0) return res.status(409).json("There is no signup request for this email.");
        return res.status(200).json({accountType: data[0].accounttype});
    });
}
// Check verification code & insert new account
export const register_step2 = (req,res) => {
    // check existing user
    const q = "select * from verification where email = ? and code = ?";
    db.query(q,[req.body.email,req.body.code], (err,data) => {
        if(err) return res.json(err);
        if(data.length === 0) return res.status(409).json("Your verfication code may be expired or incorrect!");

        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(req.body.password,salt);
        if(req.body.accountType === "Customer") {
            const q1 = "insert into accounts (email,type,password,firstname,surname,dob,phone,address,gender) values (?) ";
            const values =[req.body.email,req.body.accountType,hash,req.body.firstname,req.body.surname,req.body.dob,req.body.phone,req.body.address,req.body.gender];
            db.query(q1,[values],(err,data) => {
                if(err) return res.json(err);
                return res.status(201).json("New customer account created");
            })
        }
        else if(req.body.accountType === "Employee" || req.body.accountType === "Manager") {
            const q1 = "insert into pending_verified_accounts (email,type,password,firstname,surname,dob,phone,address,gender) values (?) ";
            const values =[req.body.email,req.body.accountType,hash,req.body.firstname,req.body.surname,req.body.dob,req.body.phone,req.body.address,req.body.gender];
            db.query(q1,[values],(err,data) => {
                if(err) return res.json(err);
                return res.status(201).json("Request for creating new employee/manager account made");
            })
        }
        else res.status(409).json("Error on account type");

    });
    
};

export const login = (req,res) => {
    const q = "select * from accounts where email = ?";
    db.query(q,[req.body.email], (err,data) => {
        if(err) return res.json(err);
        if(data.length === 0) return res.status(404).json("This email hasn't been registered!");

        const isPasswordCorrect =  bcrypt.compareSync(req.body.password,data[0].password);
        if(!isPasswordCorrect) return res.status(400).json("Wrong username or pasword!");

        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = jwt.sign({uid: data[0].uid,email: data[0].email,password: data[0].password,accountType: data[0].type},jwtSecretKey);
        const {password, ...other} = data[0];

        res.cookie("access_token",token, {
            httpOnly: true,secure: true
        });
        res.status(200).json(other);
    })
}

export const logout = (req,res) => {
    res.clearCookie("access_token",{
        secure:true
    }).status(200).json("User has been logged out.")
}

export const verify = (req,res) => {
    const usertoken = req.cookies.access_token;
    if(usertoken) {
        const userinfo = jwt.verify(usertoken,process.env.JWT_SECRET_KEY);
        if(userinfo.uid && userinfo.email && userinfo.password && userinfo.accountType) {
            const q = "select * from accounts where uid = ? and email = ? and password = ? and type = ?";
            db.query(q,[userinfo.uid,userinfo.email,userinfo.password,userinfo.accountType],(err,data) => {
                if(err) {
                    return res.clearCookie("access_token",{
                        secure:true
                    }).json(err);
                }
                if(data.length === 0) {
                    return res.clearCookie("access_token",{
                        secure:true
                    }).status(401).json("Invalid token");
                } 
                const {password, ...other} = data[0];
                return res.status(200).json(other);
            });
        }
        else {
            return res.clearCookie("access_token",{
                secure:true
            }).status(401).json("Invalid token");
        }
    }
    else return res.status(401).json("No token sent");
}