import {purchaseCreate} from "../api/purchase/api-purchase-index.js";
import { userAuthentication } from "../middleware/middleware-index.js";

export function purchaseRouter(app) {
    
//商品購入のAPI
app.post("/purchase/create", userAuthentication, purchaseCreate);
}