import { products, product, create} from "../api/product/api-product-index.js";
import { userAuthentication } from "../middleware/user-authentication.js";
import multer from "multer";
import AWS from "aws-sdk";
import multerS3 from "multer-s3";
import dotenv from "dotenv";
dotenv.config();
console.log("AWS_REGION", process.env.AWS_REGION);

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const upload = multer({ 
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl : "public-read",
        metadata : function(req, file, cb){
            cb(null, {fieldName: file.fieldname});
        },
        key: function(req, file, cb){
            cb(null, file.originalname || new Data().toISOString() + "." + file.mimetype);
        },
    }),
});

export function productRouter(app) {
//商品一覧のAPI
app.get("/products", products);
//商品詳細のAPI
// app.get("/product/:id", product);
app.get("/api/product/:id", product);
//商品情報の登録
app.post("/product/create", userAuthentication, upload.single("product_image"), create);
}