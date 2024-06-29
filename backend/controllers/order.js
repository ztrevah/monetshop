import cryptoRandomString from "crypto-random-string";
import {db} from "../db.js"
import jwt from "jsonwebtoken"

export const createorder = (req,res) => {
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

                const orderid = cryptoRandomString({length: 10, type: 'alphanumeric'});
                const q1 = "select * from orderinfo where orderid = ?";
                db.query(q1,[orderid],(err,data) => {
                    if(err) return res.status(500).json("Server error");
                    if(data.length === 0) {
                        const q2 = "insert into orderinfo values (?,?,?,?,?,now(),?,?)";
                        const order = {
                            orderid: orderid,
                            buyerid: userinfo.uid,
                            buyername: req.body.firstname + " " + req.body.surname,
                            buyerphone: req.body.phone,
                            address: req.body.address,
                            paymentmethod: req.body.paymentmethod,
                            note: req.body.note,
                            items: req.body.orderitems
                        };
                        db.query(q2,[order.orderid,order.buyerid,order.buyername,order.buyerphone,order.address,order.paymentmethod,order.note],(err,data) => {
                            if(err) return res.status(500).json(err);

                            const q3 = "insert into orderproperties values ?";
                            const values = [];
                            order.items?.forEach(item => {
                                values.push([orderid,item.productid,item.quantity,item.unitprice]);
                            });
                            console.log(values);
                            db.query(q3,[values],(err,data) => {
                                if(err) return res.json(err);
                                const q4 = "insert into orderstate values (?,now(),1)";
                                db.query(q4,[order.orderid],(err,data) => {
                                    if(err) return res.json(err);
                                    return res.status(201).json("Order created");
                                });
                            })
                        });
                    }
                    else return res.status(400).json("Try to create order again.");
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

export const getCustomerOrder = (req,res) => {
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
                
                const q1 = "\
                select orderinfo.*, getcurrentstate(orderinfo.orderid) as currentstate, calc_totalprice(orderinfo.orderid) as totalprice,\
                getorderimage(orderinfo.orderid) as orderimage,getordername(orderinfo.orderid) as ordername\
                from orderinfo, accounts\
                where orderinfo.buyerid = accounts.uid and accounts.uid = ? \
                order by orderinfo.createdtime desc";

                db.query(q1,[userinfo.uid],(err,data) => {
                    if(err) res.json(err);
                    
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

export const getorderitems = (req,res) => {
    const q = "select productname,orderproperties.productid,orderproperties.quantity,orderproperties.unitprice\
    from orderproperties,products\
    where orderproperties.productid = products.productid and orderid = ?";

    db.query(q,[req.body.orderid],(err,data) => {
        if(err) return res.json(err);
        return res.status(200).json(data);
    });
}

export const searchorder = (req,res) => {
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
                
                const q1 = "\
                select orderinfo.*, getcurrentstate(orderid) as currentstate, calc_totalprice(orderid) as totalprice,\
                getorderimage(orderid) as orderimage,getordername(orderid) as ordername\
                from orderinfo, accounts\
                where buyerid = accounts.uid and accounts.uid = ? and orderid like ?\
                order by createdtime desc";
                const orderid = "%" + (req.body.orderid || "") + "%";
                db.query(q1,[userinfo.uid,orderid],(err,data) => {
                    if(err) res.json(err);
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