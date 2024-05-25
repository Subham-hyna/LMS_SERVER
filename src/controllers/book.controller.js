import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import { Book } from "../models/book.model.js"
import { ApiFeatures } from "../utils/apiFeatures.js";
import { BOOK_RESULT_PER_PAGE } from "../constants.js";

export const addBook = asyncHandler(async(req,res,next) => {
    const { ISBN, title, author, genre, edition, publishedYear, stock } = req.body;

    if(!ISBN || !title || !author || !genre || !edition || !publishedYear || !stock){
        return next(new ApiError(400,"All fields are required"));
    }

    const book = await Book.findOne({
        $or:[
            {ISBN},
            {title}
        ]
    }) 

    if(book){
        return next(new ApiError(400,"Book already exist"));
    }

    const inStock = stock >= 1;

    const newBook = await Book.create({
        ISBN,
        title,
        author,
        genre,
        edition,
        publishedYear,
        stock,
        inStock
    })

    if(!newBook){
        return next(new ApiError(400,"Error in adiing book"));
    }

    res
    .status(201)
    .json(
        new ApiResponse(201,{book: newBook},"Book added successfully")
    )
})

export const editBook = asyncHandler( async(req,res,next) => {

    const { ISBN, title, author, genre, edition, publishedYear } = req.body;

    const book = await Book.findById(req.params.id);

    if(!book){
        return next(new ApiError(400,"Book doesn't exist"))
    }

    const updatedBook = await Book.findByIdAndUpdate(
        req.params.id,
        {
            ISBN: ISBN || book?.ISBN,
            title: title || book?.title,
            author: author || book?.author,
            edition: edition || book?.edition,
            publishedYear: publishedYear || book?.publishedYear,

        },
        {
            new: true
        }
    )

    if(!updatedBook){
        return next(new ApiError(400,"Book not updated"))
    }

    if(genre) {
        updatedBook.genre = genre;
        await updatedBook.save({validateBeforeSave: true})
    }

    res
    .status(201)
    .json(
        new ApiResponse(201,{book : updatedBook},"Book Details updated")
    )
})

export const getAllBooks = asyncHandler(async(req,res,next) => {

    const resultPerPage = BOOK_RESULT_PER_PAGE;
    
    let apiFeatures = new ApiFeatures(Book.find().sort({createdAt : -1}),req.query)
    .searchBook()
    .filter()

    let books = await apiFeatures.query;

    const bookFilteredCount = books.length;

    apiFeatures = new ApiFeatures(Book.find().sort({createdAt : -1}),req.query)
    .searchBook()
    .filter()
    .pagination(resultPerPage);

    books = await apiFeatures.query;

    if(!books){
        return next(new ApiError(401,"Error in fetching book"))
    }

    res
    .status(200)
    .json(
        new ApiResponse(200,{
            books,
            resultPerPage,
            bookFilteredCount
        },"Books fetched successfully")
    )
})