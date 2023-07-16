import {purchaseCreate} from "../api/purchase/api-purchase-index.js";
export function purchaseRouter(app) {
    
//商品購入のAPI
app.post("/purchase/create", purchaseCreate);
}