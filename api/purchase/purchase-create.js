import { sakikoDb } from "../../sakiko-db.js";

export async function purchaseCreate(req,res){
    const {user_id, product_ids, amount} = req.body;
    console.log(user_id, product_ids, amount);
    const purchase = await sakikoDb.createPurchase(user_id, product_ids, amount);
    if (purchase.error) {
        return res.status(500).json(purchase.error);
    }
    return res.status(200).json(purchase);
    }