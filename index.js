"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const searchWebService_1 = require("./searchWebService");
const express = require("express");
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
app.use(express.static(path_1.default.join(__dirname, "dist", "fanfiction-search")));
app.post('/getFictions', async (req, res) => {
    let { FicTitle, FicAuthor, FicSummary, FicChars, FicRels, FicTags, Fandom, NumRes } = req.body;
    const fic = new searchWebService_1.GetFics();
    const fics = await fic.getFictions(FicTitle, FicAuthor, FicSummary, FicChars, FicRels, FicTags, Fandom, NumRes);
    res.send(fics);
});
app.get('/getFandoms', async (req, res) => {
    let { text } = req.query;
    const fic = new searchWebService_1.GetFics();
    try {
        const fandoms = await fic.getFandoms(text?.toString() ?? "");
        res.send(fandoms);
    }
    catch (err) {
        res.send(JSON.stringify(err));
    }
});
app.get('/getTags', async (req, res) => {
    let { text } = req.query;
    const fic = new searchWebService_1.GetFics();
    const tags = await fic.getTags(text?.toString() ?? "");
    res.send(tags);
});
app.get('/getChars', async (req, res) => {
    let { text } = req.query;
    const fic = new searchWebService_1.GetFics();
    const chars = await fic.getChars(text?.toString() ?? "");
    res.send(chars);
});
app.get('/getRels', async (req, res) => {
    let { text } = req.query;
    const fic = new searchWebService_1.GetFics();
    const rels = await fic.getRels(text?.toString() ?? "");
    res.send(rels);
});
app.get('/fanfiction', async (req, res) => {
    let { url } = req.query;
    const fic = new searchWebService_1.GetFics();
    const ficText = await fic.getFicText(url?.toString() ?? "");
    res.send(ficText);
});
app.get('*', async (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "dist", "fanfiction-search", "index.html"));
});
//# sourceMappingURL=index.js.map