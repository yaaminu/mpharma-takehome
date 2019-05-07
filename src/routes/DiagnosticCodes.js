"use strict";
exports.__esModule = true;
var express_1 = require("express");
var router = express_1.Router();
router.post('/diagnostic_codes', function (req, res, next) {
    res.end('working');
});
exports["default"] = router;
