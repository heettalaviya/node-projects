const BookStore = require('../modal/bookstore.modal')

exports.getALLBook = async (req, res) => {
    let books = await BookStore.find();
    return res.render("index", { books })
}

exports.addbook = async (req, res) => {
    // console.log(req.body);
    let book = await BookStore.create(req.body);
    // console.log(book);
    return res.redirect("/");
}

exports.deletebook = async (req, res) => {
    let id = req.params.id;
    let book = await BookStore.findById(id);
    // console.log(book);
    if (!book) {
        console.log("Book not found");
    }
    await BookStore.findByIdAndDelete(id);
    return res.redirect("/");
}

exports.editbook = async (req, res) => {
    let book = await BookStore.findById(req.params.id);
    console.log(book);
    return res.render("editbookstore", { book });
}

exports.updatebook = async (req, res) => {
    try {
        let book = await BookStore.findById(req.params.id);
        if (!book) {
            console.log("book store not found");
            return res.redirect("/");
        }
        book = await BookStore.findByIdAndUpdate(book._id, req.body, { new: true });
        return res.redirect("/");
    }
    catch (err) {
        console.log(err);
        return res.redirect("/");
    }
}