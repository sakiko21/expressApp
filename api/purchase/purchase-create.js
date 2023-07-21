import { sakikoDb } from "../../sakiko-db.js";

export async function purchaseCreate(req,res){
     //user_idはログインしているユーザのID
    const user_id = req.user.id;
    const {product_ids, amount, product_names, product_prices, quantity} = req.body;
    console.log(user_id, product_ids, amount, product_names, product_prices, quantity);
    const purchase = await sakikoDb.createPurchase(user_id, product_ids, amount, product_names, product_prices, quantity);
    if (purchase.error) {
        return res.status(500).json(purchase.error);
    }
    return res.status(200).json(purchase);
    }