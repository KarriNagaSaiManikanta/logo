const express = require("express");
const app = express();

app.use((req, res, next) => {
    res.setHeader(
        "Cross-Origin-Opener-Policy",
        "same-origin"
    );

    res.setHeader(
        "Cross-Origin-Embedder-Policy",
        "require-corp"
    );

    next();
});

app.use(express.static(__dirname));

app.listen(5501, "127.0.0.1", () => {
    console.log("Server running at http://127.0.0.1:5501");
});