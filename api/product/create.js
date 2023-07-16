import { sakikoDb } from "../../sakiko-db.js";

export async function create(req,res){
    const {title, description, price} = req.body;
    console.log({title, description, price});
    console.log("user:", req.user);
    const image_path = req.file.location;
    console.log("file", req.file);
    const product = await sakikoDb.createProduct(
        title, 
        description, 
        price,
        image_path
        );
    console.log({product});
    if (product.error) {
        return res.status(500).send(product.error);
    } 
    return res.status(200).send(product);
    
}