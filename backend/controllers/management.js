import { db } from "../db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

export const login = (req,res) => {
    const q = "select * from accounts where email = ?";
    db.query(q,[req.body.email,req.body.password],(err,data) => {
        if(err) return res.json(err);
        if(data.length === 0) return res.status(404).json("This email hasn't been registered!");
        if(data[0].type === 'Customer') return res.status(401).json("This account has no permission to login this site.");
        const isPasswordCorrect =  bcrypt.compareSync(req.body.password,data[0].password);
        if(!isPasswordCorrect) return res.status(400).json("Wrong username or pasword!");

        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = jwt.sign({uid: data[0].uid,email: data[0].email,password: data[0].password,accounttype: data[0].type},jwtSecretKey);
        const {password, ...other} = data[0];

        res.cookie("access_token",token, {
            httpOnly: true,secure: true
        });
        res.status(200).json(other);
    });
}

export const logout = (req,res) => {
    res.clearCookie("access_token",{
        secure:true
    }).status(200).json("User has been logged out.");
}

export const verify = (req,res) => {
    const usertoken = req.cookies.access_token;
    if(usertoken) {
        const userinfo = jwt.verify(usertoken,process.env.JWT_SECRET_KEY);
        if(userinfo.uid && userinfo.email && userinfo.password && userinfo.accounttype) {
            if(userinfo.accounttype === 'Customer') {
                return res.clearCookie("access_token",{
                    secure:true
                }).status(401).json("Unauthorized token.");
            }
            const q = "select * from accounts where uid = ? and email = ? and password = ? and type = ?";
            db.query(q,[userinfo.uid,userinfo.email,userinfo.password,userinfo.accounttype],(err,data) => {
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

export const getproductlist = (req,res) => {
    const usertoken = req.cookies.access_token;
    if(usertoken) {
        const userinfo = jwt.verify(usertoken,process.env.JWT_SECRET_KEY);
        if(userinfo.uid && userinfo.email && userinfo.password && userinfo.accounttype) {
            if(userinfo.accounttype === 'Customer') {
                return res.clearCookie("access_token",{
                    secure:true
                }).status(401).json("Unauthorized token.");
            }
            const q = "select * from accounts where uid = ? and email = ? and password = ? and type = ?";
            db.query(q,[userinfo.uid,userinfo.email,userinfo.password,userinfo.accounttype],(err,data) => {
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
                
                let q1 = "select products.productid, productname, categories.catename as category, unitprice, quantity\
                from products,categories,product_category\
                where products.productid = product_category.productid and product_category.cateid = categories.cateid";
                const input = {};
                if(req.body.productid) {
                    q1 += " and products.productid = ?";
                    input.productid = req.body.productid;
                }
                if(req.body.productname) {
                    q1 += " and products.productname = ?";
                    input.productname = req.body.productname;
                }
                if(req.body.category) {
                    q1 += " and categories.catename = ?";
                    input.category = req.body.category;
                }
                db.query(q1,Object.values(input),(err,data) => {
                    if(err) return res.json(err);
                    return res.status(200).json(data);
                });
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

export const getproductinfo = (req,res) => {
    const usertoken = req.cookies.access_token;
    if(usertoken) {
        const userinfo = jwt.verify(usertoken,process.env.JWT_SECRET_KEY);
        if(userinfo.uid && userinfo.email && userinfo.password && userinfo.accounttype) {
            if(userinfo.accounttype === 'Customer') {
                return res.clearCookie("access_token",{
                    secure:true
                }).status(401).json("Unauthorized token.");
            }
            const q = "select * from accounts where uid = ? and email = ? and password = ? and type = ?";
            db.query(q,[userinfo.uid,userinfo.email,userinfo.password,userinfo.accounttype],(err,data) => {
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
                
                let q1 = "select * from products where productid = ?";
                db.query(q1,req.body.productid,(err,data) => {
                    if(err) return res.json(err);
                    if(data.length === 0) return res.status(404).json("No product with the productid is found.")
                    return res.status(200).json(data[0]);
                });
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

export const getorderlist = (req,res) => {
    const usertoken = req.cookies.access_token;
    if(usertoken) {
        const userinfo = jwt.verify(usertoken,process.env.JWT_SECRET_KEY);
        if(userinfo.uid && userinfo.email && userinfo.password && userinfo.accounttype) {
            if(userinfo.accounttype === 'Customer') {
                return res.clearCookie("access_token",{
                    secure:true
                }).status(401).json("Unauthorized token.");
            }
            const q = "select * from accounts where uid = ? and email = ? and password = ? and type = ?";
            db.query(q,[userinfo.uid,userinfo.email,userinfo.password,userinfo.accounttype],(err,data) => {
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
                
                let q1 = "select orderid,createdtime as orderdate,accounts.email as customer,getcurrentstate(orderid) as currentstate,calc_totalprice(orderid) as totalprice\
                from orderinfo, accounts where orderinfo.buyerid = accounts.uid";
                const input = {};
                if(req.body.orderid) {
                    q1 += " and orderid = ?";
                    input.orderid = req.body.orderid;
                }
                if(req.body.orderdate) {
                    q1 += " and date(createdtime) = ?";
                    input.orderdate = req.body.orderdate;
                }
                if(req.body.customer) {
                    q1 += " and accounts.email = ?";
                    input.customer = req.body.customer;
                }
                if(req.body.currentstate) {
                    q1 += " and getcurrentstate(orderid) = ?";
                    input.currentstate = req.body.currentstate;
                }
                db.query(q1,Object.values(input),(err,data) => {
                    if(err) return res.json(err);
                    return res.status(200).json(data);
                });
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

export const getorderinfo = (req,res) => {
    const usertoken = req.cookies.access_token;
    if(usertoken) {
        const userinfo = jwt.verify(usertoken,process.env.JWT_SECRET_KEY);
        if(userinfo.uid && userinfo.email && userinfo.password && userinfo.accounttype) {
            if(userinfo.accounttype === 'Customer') {
                return res.clearCookie("access_token",{
                    secure:true
                }).status(401).json("Unauthorized token.");
            }
            const q = "select * from accounts where uid = ? and email = ? and password = ? and type = ?";
            db.query(q,[userinfo.uid,userinfo.email,userinfo.password,userinfo.accounttype],(err,data) => {
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
                
                const q = "select orderid,createdtime as orderdate,getcurrentstate(orderid) as currentstate,calc_totalprice(orderid) as totalprice,\
                accounts.email,buyername,buyerphone,orderinfo.address\
                from orderinfo, accounts where orderinfo.buyerid = accounts.uid and orderid = ?";
                db.query(q,[req.body.orderid],(err,data) => {
                    if(err) return res.json(err);
                    if(data.length === 0) return res.status(404).json("No order with this orderid is found");
                    return res.status(200).json(data[0]);
                });
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

export const getorderitems = (req,res) => {
    const usertoken = req.cookies.access_token;
    if(usertoken) {
        const userinfo = jwt.verify(usertoken,process.env.JWT_SECRET_KEY);
        if(userinfo.uid && userinfo.email && userinfo.password && userinfo.accounttype) {
            if(userinfo.accounttype === 'Customer') {
                return res.clearCookie("access_token",{
                    secure:true
                }).status(401).json("Unauthorized token.");
            }
            const q = "select * from accounts where uid = ? and email = ? and password = ? and type = ?";
            db.query(q,[userinfo.uid,userinfo.email,userinfo.password,userinfo.accounttype],(err,data) => {
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
                const q1 = "select orderproperties.productid, productname,productimages.imgurl,\
                orderproperties.quantity,orderproperties.unitprice\
                from orderproperties, productimages,products\
                where orderproperties.productid = productimages.productid and productimages.productid = products.productid and isthumbnail = 1\
                and orderid = ?";
                db.query(q1,[req.body.orderid],(err,data) => {
                    if(err) return res.json(err);
                    return res.status(200).json(data);
                });
                
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

export const getorderhistory = (req,res) => {
    const usertoken = req.cookies.access_token;
    if(usertoken) {
        const userinfo = jwt.verify(usertoken,process.env.JWT_SECRET_KEY);
        if(userinfo.uid && userinfo.email && userinfo.password && userinfo.accounttype) {
            if(userinfo.accounttype === 'Customer') {
                return res.clearCookie("access_token",{
                    secure:true
                }).status(401).json("Unauthorized token.");
            }
            const q = "select * from accounts where uid = ? and email = ? and password = ? and type = ?";
            db.query(q,[userinfo.uid,userinfo.email,userinfo.password,userinfo.accounttype],(err,data) => {
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

                const q1 = "select * from orderstate where orderid = ? order by startedtime desc";
                db.query(q1,[req.body.orderid],(err,data) => {
                    if(err) return res.json(err);
                    return res.status(200).json(data);
                });
                
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