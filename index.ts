import express, { Application, Request, Response } from "express";
import cors from "cors";
import puppeteer from "puppeteer";
import path from "path";

// const url = "https://www.google.com/";
// const url = "https://dribbble.com/";
const url = "https://punchng.com/topics/news/";
const app: Application = express();

app.use(cors());
app.use(express.json());

const mainScript = async () => {
  const browser = await puppeteer.launch({ headless: false });
  try {
    //open a browser
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "load" });

    const scrollDown = async () => {
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
      });
    };

    for (let index: number = 0; index <= 12; index++) {
      scrollDown();
      await page.waitForTimeout(1000);
    }

    await page.screenshot({
      path: path.join(
        __dirname,
        "assets",
        `./dribbble${Math.floor(Math.random() * 1000) + Date.now()}.png`
      ),
      fullPage: true,
    });
  } catch (error) {
    console.log(error);
  } finally {
    console.log();
    await browser.close();
    console.log("done 🌪🌩");
  }
};

const paperScript = async () => {
  const browser = await puppeteer.launch({ headless: false });
  try {
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "load" });
    await page.waitForTimeout(6000);
    const data = await page.evaluate(() => {
      const data = Array.from(document.querySelectorAll("article"));

      return data.map((props) => {
        title: props.querySelector("h1")?.textContent;
        url: props.querySelector("h1 a")?.getAttribute("href");
      });
    });

    console.log(data);
  } catch (error) {
    console.log(error);
  } finally {
    await browser.close();
    console.log("done");
  }
};

paperScript();
// mainScript();

app.get("/", (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      message: `Web Scraping`,
    });
  } catch (error) {
    return res.status(404).json({
      message: `Web Scraping Error`,
    });
  }
});

app.listen(3377, () => {
  console.log(`Active .......`);
});
