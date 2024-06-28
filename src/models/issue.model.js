import { Schema, model } from "mongoose";
import { ISSUE_TRANSACTION_TYPE } from "../constants.js";

const issueSchema = new Schema({
    bookId:{
        type: Schema.Types.ObjectId,
        ref: "Book",
        required: true
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    issueDate:{
        type: Date,
    },
    dueDate:{
        type: Date,
    },
    returnDate:{
        type: Date,
    },
    transactionType:{
        type: String,
        enum: ISSUE_TRANSACTION_TYPE,
        required: true,
    }
},{
    timestamps: true
})

export const Issue = model("Issue", issueSchema);