import puppeteer, { Browser, Page } from 'puppeteer';
import path from 'path';

export async function renderImageAndCapture(imageUrl: string): Promise<{success:boolean, payload?: Buffer}> {
    try {
        console.log("Starting image capture...");
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setViewport({ width: 800, height: 600 });

        await page.goto(`file://${path.resolve('./viewer.html')}?img=${encodeURIComponent(imageUrl)}`);

        await page.waitForSelector(".pnlm-compass.pnlm-controls.pnlm-control", { visible: true });

        const screenshot = await page.screenshot({ type: 'jpeg' });
        browser.close()
        return {
            success: true,
            payload: screenshot as Buffer
        }
    } catch (err) {
        console.error(err)
        return { success: false }
    }
}
