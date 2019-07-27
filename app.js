var bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
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
    extended: true,
    useNewUrlParser: true
}));

// MONGOOSE CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});

var Blog = mongoose.model("Blog", blogSchema);

Blog.create({
    title: "Test Blog",
    image: "https://cdn1-www.dogtime.com/assets/uploads/2016/04/small-apartment-dog-breeds-23.jpg",
    body: "Hello!"
});

// ROUTES

app.get("/", (req, res)=> {
    res.redirect("/blogs");
});

app.get("/blogs", (req, res)=> {
    Blog.find({}, (err, blogs)=>{
        if(err){
            console.log(err)
        } else {
            res.render("index", {blogs: blogs})
        }
    });
});

app.get('*', (req, res) => {
    res.send('Not Found');
});

app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});