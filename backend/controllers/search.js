import { db } from "../db.js";

export const getProductsList = (req,res) => {
    
    const minprice = (req.body.minprice || 0);
    const maxprice = (req.body.maxprice || 200000);
    const category = req.body.category;
    if(category != null) {
        const q = "select products.*,productimages.imgurl from products,productimages,categories,product_category \
                    where products.productid = productimages.productid and productimages.isthumbnail = 1 \
                        and products.productid = product_category.productid and categories.cateid = product_category.cateid \
                        and unitprice >= ? and unitprice <= ? and catename = ?";
        db.query(q,[minprice,maxprice,category],(err,data) => {
            if(err) return res.json(err);
            return res.status(200).json(data);
        })
    }
    else {
        const q = "select products.*,productimages.imgurl from products,productimages \
                    where products.productid = productimages.productid and productimages.isthumbnail = 1 \
                    and unitprice >= ? and unitprice <= ?"
        db.query(q,[minprice,maxprice],(err,data) => {
            if(err) return res.json(err);
            return res.status(200).json(data);
        })
    }
};
export const getProductDetails = (req,res) => {
    const q1 = "select * from products where productid = ?";
    const product = {};
    db.query(q1,[req.body.productid],(err,data) => {
        if(err) return res.json(err);
        if(data.length === 0) return res.status(409).json("No product matched with the productid is found");
        for(let x in data[0]) {
            product[x] = data[0][x];
        }
        
        const q2 = "select * from productimages where productid = ?";
        db.query(q2,[req.body.productid],(err,data) => {
            if(err) return res.json(err);
            product.imgurl = [];
            data.map((d) => {
                product.imgurl.push(d.imgurl);
            });
            return res.status(200).json(product);
        });
        
    });
    
};