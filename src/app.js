import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import { JSONDATA_LIMIT } from "./constants.js";
import { URLDATA_LIMIT } from "./constants.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({limit: JSONDATA_LIMIT}));
app.use(express.urlencoded({extended: true, limit: URLDATA_LIMIT}));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/api/v1",(req,res)=>{
    res.send("<h1>Api is working</h1>")
})

//Routes
import userRouter from "./routes/user.routes.js"
import bookRouter from "./routes/book.routes.js"
import issueRouter from "./routes/issue.routes.js"

app.use("/api/v1/users", userRouter);
app.use("/api/v1/book", bookRouter);
app.use("/api/v1/issue", issueRouter);


app.use(errorMiddleware);

export { app };