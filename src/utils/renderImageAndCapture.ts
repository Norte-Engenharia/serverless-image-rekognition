import chromium from 'chrome-aws-lambda';
import puppeteer, { Browser, Page } from 'puppeteer-core';
import path from 'path';

export async function renderImageAndCapture(imageUrl: string): Promise<{ success: boolean; payload?: Buffer }> {
    let browser: Browser | null = null;

    try {
        console.log("Starting image capture...");

        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
        });

        const page = await browser.newPage();

        await page.setViewport({ width: 800, height: 600 });

        await page.goto(`file://${path.resolve('./viewer.html')}?img=${encodeURIComponent(imageUrl)}`);

        await page.waitForSelector(".pnlm-compass.pnlm-controls.pnlm-control", { visible: true });

        const screenshot = await page.screenshot({ type: 'jpeg' });

        return {
            success: true,
            payload: screenshot as Buffer,
        };

    } catch (err) {
        console.error(err);
        return { success: false };
    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }
}
