const express = require('express')
const app = express()

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

const {initializeDatabase}= require('./db/db.connect')

const Book= require('./models/books.models')
const { error } = require('console')
const { release } = require('os')

app.use(express.json())

initializeDatabase()

async function createBook(newBook) {
    try{
        const book = new Book(newBook)
        const savedBook = await book.save()
        return savedBook
    }catch(error){
        throw error
    }
}

app.post('/books', async(req,res)=>{
    try{
        const savedBook = await createBook(req.body)
    res.status(201).json({message:"book added successfully", book:savedBook})
    }catch(error){
        res.status(500).json({ error: "Failed to add data.", details: error.message });

    }
    
})

// to get all the books 
async function readAllBooks() {
    try{
        const allBooks = await Book.find()
        return allBooks
    }catch(error){
        throw error
    }
}

app.get('/books', async(req,res)=>{
    try{
        const books = await readAllBooks()
        if(books.length !== 0){
            res.json(books)
        }else{
            res.status(404).json({error:"book not found."})
        }
    }catch(error){
        res.status(500).json({error:"failed to fetch data"})
    }
})


//get book by title

async function readBookByTitle(bookTitle) {
    try{
        const bookByTitle= await Book.findOne({title:bookTitle})
        return bookByTitle

    }catch(error){
        throw error
    }
}

app.get('/books/title/:bookTitle', async(req,res)=>{
    try{
        const books= await readBookByTitle(req.params.bookTitle)

        if(books){
            res.json(books)
        }else{
            res.status(404).json({error:"book not found."})
        }
    }catch(error){
        res.status(500).json({error:"failed to fetch data."})
    }
});

//get book by author

async function readBookByAuthor(bookAuthor) {
    try{
        const bookByAuthor =await Book.findOne({author:bookAuthor})
        return bookByAuthor
    }catch(error){
        throw error
    } 
}

app.get('/books/author/:bookAuthor', async(req,res)=>{
    
    try{
        const books = await readBookByAuthor(req.params.bookAuthor)

        if(books){
            res.json(books)
        }else{
        res.status(404).json({error:"book not found."})
        }
    }catch(error){
        res.status(500).json({error:"failed to fetch data."})
    }
})

//get all the books which are of "Business" genre

async function readBookByGenre(bookGenre) {
    try{
        const books= await Book.find({genre:bookGenre})
        return books
    }catch(error){
        throw error
    }
}

app.get('/books/genre/:bookGenre', async(req,res)=>{
    try{
        const books = await readBookByGenre(req.params.bookGenre)
        if(books !=0){
            res.json(books)
        }else{
            res.status(404).json({error:"book not found."})
        }
    }catch(error){
        res.status(500).json({error:"failed to fetch data"})
    }
})

//get all the books which are release in the year 2012
async function readBookByReleaseYear(bookReleaseYear) {
    try{
        const books= await Book.find({publishedYear:bookReleaseYear})
        return books
    }catch(error){
        throw error
    }
}

app.get('/books/publishedYear/:bookReleaseYear', async(req,res)=>{
    try{
        const books = await readBookByReleaseYear(req.params.bookReleaseYear)
        if(books !=0){
            res.json(books)
        }else{
            res.status(404).json({error:"book not found."})
        }
    }catch(error){
        res.status(500).json({error:"failed to fetch data"})
    }
})

//update a book's rating with the help of its id

async function updatebookRating(bookId,dataToUpdate) {
    try{
        const updatedBook= await Book.findByIdAndUpdate(bookId, dataToUpdate,{new:true})
        return updatedBook
    }catch(error){
        throw error
    }
}

app.post('/books/:bookId', async (req,res)=>{
    try{
        const updatedBook= await updatebookRating(req.params.bookId, req.body)

        if(updatedBook){
            res.status(200).json({message:"book updated successfully."})
        }else{
            res.status(404).json({error:"book not found."})
        }
    }catch(error){
        res.status(500).json({error:"failed to update data."})
    }
})

//update a book's rating with the help of its title

async function updatebookByTitle(bookId,dataToUpdate) {
    try{
        const updatedBook= await Book.findOneAndUpdate(bookId, dataToUpdate,{new:true})
        return updatedBook
    }catch(error){
        throw error
    }
}

app.post('/books/:bookId', async (req,res)=>{
    try{
        const updatedBook= await updatebookByTitle(req.params.bookId, req.body)

        if(updatedBook){
            res.status(200).json({message:"book updated successfully."})
        }else{
            res.status(404).json({error:"book not found."})
        }
    }catch(error){
        res.status(500).json({error:"failed to update data."})
    }
})

// delete a book with the help of a book id

async function deleteBookById(bookId) {
    try{
        const deletedBook= await Book.findByIdAndDelete(bookId)
        return deletedBook
    }catch(error){
        throw error
    }
}

app.delete('/books/:bookId', async(req,res)=>{
    try{
        const deletedBook= await deleteBookById(req.params.bookId)
         if(deletedBook){
            res.status(200).json({message:"book deleted successfully"})
         }else{
            res.status(404).json({error:"book not found."})
         }
    }catch(error){
        res.status(500).json({error:"failed to delete data"})
    }
})


const PORT =3000
app.listen(PORT, ()=>{
    console.log('Server is running on PORT', PORT)
})
