import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Issue } from "../models/issue.model.js";
import { Book } from "../models/book.model.js";
import { User } from "../models/user.model.js";
import { ApiFeatures } from "../utils/apiFeatures.js";
import { ALL_ISSUE_RESULT_PER_PAGE, SINGLE_USER_ISSUE_RESULT_PER_PAGE } from "../constants.js";

export const issueRequest = asyncHandler( async(req,res,next) => {

    if(req.user.membershipStatus != "ACTIVE"){
        return next(new ApiError(400,"You have no active memberships"))
    }

    const { bookId } = req.body;

    if(!bookId){
        return next(new ApiError(400,"please enter the book ID"));
    }

    const book = await Book.findById(bookId);

    if(!book){
        return next(new ApiError(400,"No book found"));
    }

    if(!book.inStock){
        return next(new ApiError(400,"Book is out of stock"));
    }

    const sameBookIssue = await Issue.find({ userId: req.user._id , bookId: bookId}).find({$or:[{transactionType:"PENDING"},{transactionType:"ISSUED"}]})

    if(sameBookIssue.length > 0){
        return next(new ApiError(400,"Same book issue is already raised"))
    }

    const currentUserIssues = await Issue.find({ userId: req.user._id }).find({$or:[{transactionType:"PENDING"},{transactionType:"ISSUED"}]})

    if(currentUserIssues.length >= 3){
        return next(new ApiError(400,"Maximun issue request limit reached"))
    }

    const issueRequest = await Issue.create({
        bookId,
        userId: req.user._id,
        issueDate: Date.now(),
        dueDate: Date.now() + 10 * 24 * 60 * 60 * 1000,
        transactionType: "PENDING"
    })

    if(!issueRequest){
        return next(new ApiError(400,"Error in requesting issue"))
    }

    res
    .status(201)
    .json(
        new ApiResponse(201,{issueRequest},"Issue request is created")
    )

})

export const getCurrentUserIssueRequests = asyncHandler( async(req,res,next) => {

    const resultPerPage = SINGLE_USER_ISSUE_RESULT_PER_PAGE;

    let apiFeatures = new ApiFeatures(Issue.find({userId:req.user._id}).sort({createdAt:-1}).populate("userId","name registrationNo").populate("bookId","title author"),req.query).filter();

    let issueRequest = await apiFeatures.query;

    const issueFilteredCount = issueRequest.length;

    apiFeatures = new ApiFeatures(Issue.find({userId:req.user._id}).sort({createdAt:-1}).populate("userId","name registrationNo").populate("bookId","title author"),req.query).filter().pagination(resultPerPage);

    issueRequest = await apiFeatures.query;

    res.status(200).json(
        new ApiResponse(200,{
            issueRequest,
            resultPerPage,
            issueFilteredCount
        },"Issue Request fectched successfully")
    )
})

export const getAllIssues = asyncHandler(async(req,res,next) => {

    const resultPerPage = ALL_ISSUE_RESULT_PER_PAGE

    let allIssuesSearch = new ApiFeatures(Issue.find().sort({createdAt:-1}).populate("userId","name registrationNo").populate("bookId","title author"),req.query).filter();
    
    let allIssues = await allIssuesSearch.query;

    const issueFilteredCount = allIssues.length;
    
    allIssuesSearch = new ApiFeatures(Issue.find().sort({createdAt:-1}).populate("userId","name registrationNo").populate("bookId","title author"),req.query)
    .filter()
    .pagination(resultPerPage);

    allIssues = await allIssuesSearch.query;

    res.status(200).json(
        new ApiResponse(200,{
            allIssues,
            resultPerPage,
            issueFilteredCount
            },"Issues are fectched successfully")
    )

})

export const getSingleUserIssues = asyncHandler(async(req,res,next) => {
    
    const { userId } = req.params;

    const resultPerPage = SINGLE_USER_ISSUE_RESULT_PER_PAGE;

    let issuesSearch = new ApiFeatures(Issue.find({userId}).sort({createdAt:-1}).populate("userId","name registrationNo").populate("bookId","title author"),req.query).filter();

    let issues = await issuesSearch.query;

    const issueFilteredCount = issues.length;

    issuesSearch = new ApiFeatures(Issue.find({userId}).sort({createdAt:-1}).populate("userId","name registrationNo").populate("bookId","title author"),req.query).filter().pagination(resultPerPage);

    issues = await issuesSearch.query;

    res.status(200).json(
        new ApiResponse(200,{
            issues,
            resultPerPage,
            issueFilteredCount
            },"Issues are fectched successfully")
    )

})

export const deleteIssueRequest = asyncHandler( async(req,res,next) => {

    const {issueId} = req.params;

    const isIssued = await Issue.findById(issueId);

    if(!isIssued){
        return next(new ApiError(400,"Invalid Issue"))
    }
    
    await Issue.findByIdAndDelete(issueId);

    res.status(201).json(
        new ApiResponse(201,{},"Issue Request Deleted")
    )

})

export const approveIssueRequest = asyncHandler( async(req,res,next) => {

    const {issueId} = req.params;

    const isIssued = await Issue.findById(issueId);

    if(isIssued.transactionType !== "PENDING"){
        return next(new ApiError(200,"Issue invalid"))
    }


    const issue = await Issue.findByIdAndUpdate(issueId,{
        transactionType:"ISSUED"
    },{
        new:true
    })

    if(!issue){
        return next(new ApiError(400,{},"Issued Successfully"))
    }

    res.status(201).json(
        new ApiResponse(201,{},"Issue Request Approved")
    )

})

export const returnBook = asyncHandler( async(req,res,next) => {

    const { issueId } = req.params;

    const isIssued = await Issue.findById(issueId);

    if(isIssued.transactionType !== "ISSUED"){
        return next(new ApiError(200,"Issue invalid"))
    }

    const issue = await Issue.findByIdAndUpdate(issueId,{
        $set: {
            transactionType: "RETURNED",
            returnDate: Date.now()
        }
    },{
        new: true
    })

    if(!issue){
        return next(new ApiError(400,{},"Issue in return"))
    }

    res.status(201).json(
        new ApiResponse(201,{},"Returned Successfully")
    )

})
