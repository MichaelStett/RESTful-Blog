var bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    override = require("method-override"),
    express = require("express"),
    app = express();

const PORT = 8080;
const HOST = '0.0.0.0';
const MONGO_URI = "mongodb://mongo:27017/restful_blog";

// APP CONFIG
mongoose
    .connect(MONGO_URI, {
        useNewUrlParser: true
    })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.log(err.stack);
        process.exit(1);
    });

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(override("_method"));

// MONGOOSE CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {
        type: Date,
        default: Date.now
    }
});

var Blog = mongoose.model("Blog", blogSchema);

// ROUTES

app.get("/", (req, res) => {
    res.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs", (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err) {
            console.log(err)
        } else {
            res.render("index", {
                blogs: blogs
            })
        }
    });
});

// NEW ROUTE
app.get("/blogs/new", (req, res) => {
    res.render("new");
});

// CREATE ROUTE
app.post("/blogs", (req, res) => {
    Blog.create(req.body.blog, (err, newBLog) => {
        if (err) {
            res.render("new")
        } else {
            res.redirect("/blogs")
        }
    });
});

// SHOW ROUTE
app.get("/blogs/:id", (req, res) => {
    Blog.findById(req.params.id, (err, found) =>{
        if (err) {
            res.redirect("/blogs")
        } else {
            res.render("show", {blog: found})
        }
    })
})

// EDIT ROUTE
app.get("/blogs/:id/edit", (req, res) => {
    Blog.findById(req.params.id, (err, found) =>{
        if (err) {
            res.redirect("/blogs")
        } else {
            res.render("edit", {blog: found})
        }
    })

})

app.put("/blogs/:id", (req, res) => {
    Blog.findByIdAndUpdate(req.params.id, req.body, (err, updated) => {
        if (err) {
            res.redirect("/blogs")
        } else {
            res.redirect(`/blogs/${req.params.id}`)
        }
    })
})

app.get('*', (req, res) => {
    res.send('Not Found');
});

app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});