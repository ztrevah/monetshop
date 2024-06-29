import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const addtocart = (req,res) => {
    const usertoken = req.cookies.access_token;
    if(usertoken) {
        const userinfo = jwt.verify(usertoken,process.env.JWT_SECRET_KEY);
        if(userinfo.uid && userinfo.email && userinfo.password && userinfo.accountType && userinfo.accountType === "Customer") {
            const q = "select * from accounts where uid = ? and email = ? and password = ? and type = 'Customer'";
            db.query(q,[userinfo.uid,userinfo.email,userinfo.password],(err,data) => {
                if(err) {
                    return res.clearCookie("access_token",{
                        secure:true
                    }).json(err);
                }
                if(data.length === 0) {
                    return res.clearCookie("access_token",{
                        secure:true
                    }).status(401).json("No permission");
                } 

                const q1 = "select * from personalcart where customerid = ? and productid = ?";
                db.query(q1,[userinfo.uid,req.body.productid], (err,data) => {
                    if(err) return res.json(err);
                    if(data.length === 0) {
                        const q2 = "insert into personalcart values (?,?,?)";
                        db.query(q2,[userinfo.uid,req.body.productid,req.body.quantity], (err,data) => {
                            if(err) return res.json(err);
                            return res.status(201).json("Successfully add to cart");
                        });
                    }
                    else {
                        const q2 = "update personalcart set quantity = quantity + ? where customerid = ? and productid = ?";
                        db.query(q2,[req.body.quantity,userinfo.uid,req.body.productid], (err,data) => {
                            if(err) return res.json(err);
                            return res.status(201).json("Successfully add to cart");
                        });
                    }
                });

            });
        }
        else {
            return res.clearCookie("access_token",{
                secure:true
            }).status(401).json("No permission");
        }
    }
    else return res.status(401).json("No permission");
    
} 

export const getCartDetails = (req,res) => {
    const usertoken = req.cookies.access_token;
    if(usertoken) {
        const userinfo = jwt.verify(usertoken,process.env.JWT_SECRET_KEY);
        if(userinfo.uid && userinfo.email && userinfo.password && userinfo.accountType && userinfo.accountType === "Customer") {
            const q = "select * from accounts where uid = ? and email = ? and password = ? and type = 'Customer'";
            db.query(q,[userinfo.uid,userinfo.email,userinfo.password],(err,data) => {
                if(err) {
                    return res.clearCookie("access_token",{
                        secure:true
                    }).json(err);
                }
                if(data.length === 0) {
                    return res.clearCookie("access_token",{
                        secure:true
                    }).status(401).json("No permission");
                } 

                const q = "select products.productname,personalcart.productid,personalcart.quantity,products.unitprice,imgurl from personalcart,products,productimages\
                where personalcart.productid = products.productid and products.productid = productimages.productid and isthumbnail = 1 and customerid = ?";
                db.query(q,[userinfo.uid],(err,data) => {
                    if(err) return res.json(err);
                    return res.status(200).json(data);
                });

            });
        }
        else {
            return res.clearCookie("access_token",{
                secure:true
            }).status(401).json("No permission");
        }
    }
    else return res.status(401).json("No permission");
    
}

export const updateCartItem = (req,res) => {
    const usertoken = req.cookies.access_token;
    if(usertoken) {
        const userinfo = jwt.verify(usertoken,process.env.JWT_SECRET_KEY);
        if(userinfo.uid && userinfo.email && userinfo.password && userinfo.accountType && userinfo.accountType === "Customer") {
            const q = "select * from accounts where uid = ? and email = ? and password = ? and type = 'Customer'";
            db.query(q,[userinfo.uid,userinfo.email,userinfo.password],(err,data) => {
                if(err) {
                    return res.clearCookie("access_token",{
                        secure:true
                    }).json(err);
                }
                if(data.length === 0) {
                    return res.clearCookie("access_token",{
                        secure:true
                    }).status(401).json("No permission");
                } 
                    
                const q1 = "update personalcart set quantity = ? where productid = ? and customerid = ?";
                db.query(q1,[req.body.newquantity,req.body.productid,userinfo.uid],(err,data) => {
                    if(err) return res.json(err);
                    return res.status(200).json("Updated.");
                });

            });
        }
        else {
            return res.clearCookie("access_token",{
                secure:true
            }).status(401).json("No permission");
        }
    }
    else return res.status(401).json("No permission");
}

export const deleteCartItem = (req,res) => {
    const usertoken = req.cookies.access_token;
    if(usertoken) {
        const userinfo = jwt.verify(usertoken,process.env.JWT_SECRET_KEY);
        if(userinfo.uid && userinfo.email && userinfo.password && userinfo.accountType && userinfo.accountType === "Customer") {
            const q = "select * from accounts where uid = ? and email = ? and password = ? and type = 'Customer'";
            db.query(q,[userinfo.uid,userinfo.email,userinfo.password],(err,data) => {
                if(err) {
                    return res.clearCookie("access_token",{
                        secure:true
                    }).json(err);
                }
                if(data.length === 0) {
                    return res.clearCookie("access_token",{
                        secure:true
                    }).status(401).json("No permission");
                } 

                const q1 = "delete from personalcart where productid = ? and customerid = ?";
                db.query(q1,[req.body.productid,userinfo.uid],(err,data) => {
                    if(err) return res.json(err);
                    return res.status(200).json("Deleted.");
                });

            });
        }
        else {
            return res.clearCookie("access_token",{
                secure:true
            }).status(401).json("No permission");
        }
    }
    else return res.status(401).json("No permission");
}