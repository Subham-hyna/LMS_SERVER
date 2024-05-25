import { Schema,model } from "mongoose";
import { BOOK_GENRE } from "../constants.js";

const bookSchema = new Schema({
    ISBN:{
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    title:{
        type: String,
        required: true,
        trim: true
    },
    author:{
        type: String,
        required: true
    },
    genre:{
        type: String,
        enum: BOOK_GENRE,
        required: true
    },
    edition:{
        type: String,
        required: true
    },
    publishedYear:{
        type: String,
        required: true
    },
    inStock:{
        type: Boolean,
        default: true
    },
    stock:{
        type: Number,
        required: true
    }
},{
    timestamps: true
})

export const Book = model("Book", bookSchema);