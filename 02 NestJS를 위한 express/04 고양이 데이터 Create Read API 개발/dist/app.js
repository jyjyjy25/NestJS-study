"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var app_model_1 = require("./app.model");
var app = express();
app.use(function (req, res, next) {
    console.log(req.rawHeaders[1]);
    console.log("this is logging middleware");
    next();
});
app.use(express.json());
app.get("/cats", function (req, res) {
    try {
        var cats = app_model_1.Cat;
        res.status(200).send({
            success: true,
            data: {
                cats: cats,
            },
        });
    }
    catch (error) {
        res.status(400).send({
            success: false,
            error: error.message,
        });
    }
});
app.get("/cats/:id", function (req, res) {
    try {
        var id_1 = req.params.id;
        var cat = app_model_1.Cat.find(function (cat) {
            return cat.id === id_1;
        });
        res.status(200).send({
            success: true,
            data: {
                cat: cat,
            },
        });
    }
    catch (error) {
        res.status(400).send({
            success: false,
            error: error.message,
        });
    }
});
app.post("/cats", function (req, res) {
    try {
        var data = req.body;
        app_model_1.Cat.push(data);
        res.status(200).send({
            success: true,
            data: { data: data },
        });
    }
    catch (error) {
        res.status(400).send({
            success: false,
            error: error.message,
        });
    }
});
app.use(function (req, res, next) {
    console.log("this is error middleware");
    res.send({ error: "404 not found error" });
});
app.listen(8000, function () {
    console.log("server is on...");
});
//# sourceMappingURL=app.js.map