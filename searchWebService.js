"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFics = void 0;
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const puppeteer_jquery_1 = require("puppeteer-jquery");
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
let browser;
let page;
let pageJQ;
class GetFics {
    async getFandoms(text) {
        if (!text?.length) {
            return [];
        }
        if (!browser) {
            browser = await puppeteer_extra_1.default.launch();
            page = await browser.newPage();
            pageJQ = (0, puppeteer_jquery_1.pageExtend)(page);
        }
        const preliminaryAO3 = "https://archiveofourown.org/works/search";
        await pageJQ.goto(preliminaryAO3);
        await pageJQ.type("#work_search_fandom_names_autocomplete", text);
        await pageJQ.waitForjQuery("p:contains('No suggestions found'), #new_work_search > fieldset:nth-child(2) > dl > dd:nth-child(2) > ul > li > div > ul");
        const fs = await pageJQ.$$("#new_work_search > fieldset:nth-child(2) > dl > dd:nth-child(2) > ul > li > div > ul > li");
        return Promise.all(fs.map(async (f) => {
            const ff = await f?.getProperty("textContent");
            return ff?.toString().slice(9);
        }));
    }
    async getTags(text) {
        if (!text?.length) {
            return [];
        }
        if (!browser) {
            browser = await puppeteer_extra_1.default.launch();
            page = await browser.newPage();
            pageJQ = (0, puppeteer_jquery_1.pageExtend)(page);
        }
        const preliminaryAO3 = "https://archiveofourown.org/works/search";
        await pageJQ.goto(preliminaryAO3);
        await pageJQ.type("#work_search_freeform_names_autocomplete", text);
        await pageJQ.waitForjQuery("p:contains('No suggestions found'), #new_work_search > fieldset:nth-child(2) > dl > dd:nth-child(14) > ul > li > div > ul");
        const fs = await pageJQ.$$("#new_work_search > fieldset:nth-child(2) > dl > dd:nth-child(14) > ul > li > div > ul > li");
        return Promise.all(fs.map(async (f) => {
            const ff = await f?.getProperty("textContent");
            return ff?.toString().slice(9);
        }));
    }
    async getChars(text) {
        if (!text?.length) {
            return [];
        }
        if (!browser) {
            browser = await puppeteer_extra_1.default.launch();
            page = await browser.newPage();
            pageJQ = (0, puppeteer_jquery_1.pageExtend)(page);
        }
        const preliminaryAO3 = "https://archiveofourown.org/works/search";
        await pageJQ.goto(preliminaryAO3);
        await pageJQ.type("#work_search_character_names_autocomplete", text);
        await pageJQ.waitForjQuery("p:contains('No suggestions found'), #new_work_search > fieldset:nth-child(2) > dl > dd:nth-child(10) > ul > li > div > ul");
        const fs = await pageJQ.$$("#new_work_search > fieldset:nth-child(2) > dl > dd:nth-child(10) > ul > li > div > ul > li");
        return Promise.all(fs.map(async (f) => {
            const ff = await f?.getProperty("textContent");
            return ff?.toString().slice(9);
        }));
    }
    async getRels(text) {
        if (!text?.length) {
            return [];
        }
        if (!browser) {
            browser = await puppeteer_extra_1.default.launch();
            page = await browser.newPage();
            pageJQ = (0, puppeteer_jquery_1.pageExtend)(page);
        }
        const preliminaryAO3 = "https://archiveofourown.org/works/search";
        await pageJQ.goto(preliminaryAO3);
        await pageJQ.type("#work_search_relationship_names_autocomplete", text);
        await pageJQ.waitForjQuery("p:contains('No suggestions found'), #new_work_search > fieldset:nth-child(2) > dl > dd:nth-child(12) > ul > li > div > ul");
        const fs = await pageJQ.$$("#new_work_search > fieldset:nth-child(2) > dl > dd:nth-child(12) > ul > li > div > ul > li");
        return Promise.all(fs.map(async (f) => {
            const ff = await f?.getProperty("textContent");
            return ff?.toString().slice(9);
        }));
    }
    sanitizeString(str) {
        str = str.replace(/[^a-z0-9áéíóúñü\-\"?!'., \.,_-]/gim, "");
        return str.trim();
    }
    async getFicText(url) {
        if (!browser) {
            browser = await puppeteer_extra_1.default.launch();
            page = await browser.newPage();
            pageJQ = (0, puppeteer_jquery_1.pageExtend)(page);
        }
        await pageJQ.goto(url);
        //const delay = (milliseconds: number | undefined) => new Promise((resolve) => setTimeout(resolve, milliseconds));
        // await delay(2000);
        // await page.waitForSelector('#tos_agree', { timeout: 2000 });
        // try {
        //   await page.click('#tos_agree');
        // } catch (err) { }
        // await delay(300);
        // await page.waitForSelector('#accept_tos', { timeout: 200 });
        // try {
        //   await page.click('#accept_tos');
        // } catch (err) { }
        //await delay(100);
        await pageJQ.waitForjQuery("p.caution, li.chapter");
        let caution = await pageJQ.$("p.caution");
        //await delay(100);
        if (caution) {
            await pageJQ.click("#main > ul > li:nth-child(1)");
            await pageJQ.waitForjQuery('li.chapter');
        }
        //await delay(200);
        let entire = await pageJQ.$("li.chapter.entire");
        //await delay(200);
        if (entire) {
            try {
                await pageJQ.click("li.chapter.entire");
                await pageJQ.waitForjQuery("div#chapters > .chapter");
                await page.waitForTimeout(800);
            }
            catch (err) { }
            console.log("Pressed");
            //await delay(1500);
            const chapters = await (await page.$$("div#chapters > .chapter"));
            console.log("Chapters fetched:", chapters.length);
            let full = [];
            for (let c of chapters) {
                const textField = await c.$$("div[role=article] > p");
                let text;
                text = [];
                for (let s of textField) {
                    const sText = await (await s.getProperty("textContent")).jsonValue();
                    text.push(this.sanitizeString(JSON.stringify(sText)));
                }
                full.push(text);
            }
            return full;
        }
        else {
            console.log("Not pressed");
            const textField = await pageJQ.$$("div[role='article'] > div > p");
            let text;
            text = [];
            let full = [];
            for (let s of textField) {
                const sText = await (await s.getProperty("textContent")).jsonValue();
                text.push(this.sanitizeString(JSON.stringify(sText)));
            }
            full.push(text);
            return full;
        }
        // div#chapters > .chapter
    }
    async getFictions(title, author, summary, characters, relationships, filterTags, fandom, fetchesNumber) {
        if (!browser) {
            browser = await puppeteer_extra_1.default.launch();
            page = await browser.newPage();
            pageJQ = (0, puppeteer_jquery_1.pageExtend)(page);
        }
        //const preliminaryFF = 'https://www.fanfiction.net/search/?popup=1';
        const ao3url = `https://archiveofourown.org/works/search?commit=Search&work_search%5Bquery%5D=` +
            `${summary ?? ""}&work_search%5Btitle%5D=` +
            `${title ?? ""}&work_search%5Bcreators%5D=` +
            `${author ?? ""}&work_search%5Brevised_at%5D=&work_search%5Bcomplete%5D=&work_search%5Bcrossover%5D=&work_search%5Bsingle_chapter%5D=0&work_search%5Bword_count%5D=&work_search%5Blanguage_id%5D=&work_search%5Bfandom_names%5D=` +
            `${fandom ?? ""}&work_search%5Brating_ids%5D=&work_search%5Bcharacter_names%5D=` +
            `${characters?.join(",") ?? ""}&work_search%5Brelationship_names%5D=${relationships?.map((rel) => encodeURIComponent(rel))?.join(",") ?? ""}` +
            `&work_search%5Bfreeform_names%5D=` +
            `${filterTags?.join(",") ?? ""}&work_search%5Bhits%5D=&work_search%5Bkudos_count%5D=&work_search%5Bcomments_count%5D=&work_search%5Bbookmarks_count%5D=&work_search%5Bsort_column%5D=_score&work_search%5Bsort_direction%5D=desc`;
        //const fnurl = `https://www.fanfiction.net/search/?keywords=Fire+Nation&type=story&match=any&formatid=any&sort=0&genreid1=0&genreid2=0&characterid1=0&characterid2=0&characterid3=0&characterid4=0&words=0&ready=1&categoryid=2002#`;
        console.log("Link: ", ao3url);
        await page.goto(ao3url);
        //const delay = (milliseconds: number | undefined) => new Promise((resolve) => setTimeout(resolve, milliseconds));
        //await delay(2000);
        await page.waitForSelector("#tos_agree", { timeout: 2000 });
        try {
            await page.click("#tos_agree");
        }
        catch (err) { console.log(err) }
        //await delay(300);
        await page.waitForSelector("#accept_tos", { timeout: 200 });
        try {
            await page.click("#accept_tos");
        }
        catch (err) { console.log(err) }
        let fics = [];
        for (let i = 0; i < fetchesNumber; i++) {
            //await page.waitForSelector('.next');
            await this.fetchFictions(fics, page);
            try {
                await page.click(".next");
            }
            catch (err) { console.log(err) }
        }
        return fics;
    }
    async fetchFictions(fics, page) {
        const nodes = await page.$$("li[role='article']");
        for (let node of nodes) {
            try {
                let id = await (await node.getProperty("id")).jsonValue();
                let heading = await page.$$(`#${id} > div > h4 > a`);
                let name = await (await heading[0].getProperty("textContent")).jsonValue();
                let link = await (await heading[0].getProperty("href")).jsonValue();
                if (heading.length == 2) {
                    var creator = await (await heading[1].getProperty("textContent")).jsonValue();
                }
                else {
                    let creator = "Anonymous";
                }
                let sumsec = await page.$$(`#${id} > blockquote > p`);
                let sum = "";
                let tags = await page.$$(`#${id} > ul > li > a`);
                let ftags = [];
                for (let tag of tags) {
                    const tagName = await (await tag.getProperty("textContent")).jsonValue();
                    ftags.push(tagName);
                }
                for (let s of sumsec) {
                    const sText = await (await s.getProperty("textContent")).jsonValue();
                    sum += sText;
                }
                let fanfiction = {
                    title: name,
                    author: creator,
                    tags: ftags,
                    summary: sum,
                    url: link,
                };
                fics.push(fanfiction);
            }
            catch (Exception) { }
        }
    }
}
exports.GetFics = GetFics;
//# sourceMappingURL=searchWebService.js.map