"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
const models_1 = __importDefault(require("./models"));
const books_seed_1 = require("./seeders/books_seed");
const createBooks = () => {
    books_seed_1.books.map(book => {
        models_1.default.book.create(book);
    });
};
createBooks();
models_1.default.sequelize.sync().then(() => {
    console.log("Table synced successfully");
}).catch(() => {
    console.log("Error syncing the table !");
});
app.get('/', (req, res) => {
    res.send("hello,,,,");
});
require("./routes/book.routes")(app);
app.listen(3000, () => {
    console.log('connected on port 3000!');
});
