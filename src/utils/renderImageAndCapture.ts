import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';
import path from 'path';

export async function renderImageAndCapture(imageUrl: string): Promise<{ success: boolean, payload?: Buffer }> {
    try {
        console.log("Starting image capture...");

        const browser = await puppeteer.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath || '',
            headless: chromium.headless,
            defaultViewport: { width: 800, height: 600 },
        });

        const page = await browser.newPage();

        await page.goto(`file://${path.resolve('./viewer.html')}?img=${encodeURIComponent(imageUrl)}`);

        await page.waitForSelector(".pnlm-compass.pnlm-controls.pnlm-control", { visible: true });

        const screenshot = await page.screenshot({ type: 'jpeg' });
        await browser.close();

        return {
            success: true,
            payload: screenshot as Buffer
        };
    } catch (err) {
        console.error(err);
        return { success: false };
    }
}
