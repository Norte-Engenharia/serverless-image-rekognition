import { writeFile } from "fs/promises"
import { renderImageAndCapture } from "../renderImageAndCapture"

async function run() {
    const images = [
        "https://global-norte.s3.amazonaws.com/dashboard/LUMEN-CAS-0009-22/images/4d928686ec62a8624cfd7a498533ebda-GSAF5113.JPG",
        "https://global-norte.s3.amazonaws.com/dashboard/LUMEN-CAS-0009-22/images/74d4f485264f65a6969bc825156d757c-GSAF5111.JPG",
        "https://global-norte.s3.amazonaws.com/dashboard/LUMEN-CAS-0009-22/images/f856af2e5f094ca1268aea59699e9b55-GSAF5112.JPG",
        "https://global-norte.s3.amazonaws.com/dashboard/LUMEN-CAS-0009-22/images/2e3d012121bfd69b9e6deba3fad4d0e1-GSAF5461.JPG",
        "https://global-norte.s3.amazonaws.com/dashboard/LUMEN-CAS-0009-22/images/6eb2cc6af53cbcdb5e36127ba1f6c11f-GSAF4446.JPG",
        "https://global-norte.s3.amazonaws.com/dashboard/LUMEN-CAS-0009-22/images/2e0cd85c8d11ac3e96f25fb6a9368ac1-GSAF4603.JPG",
        "https://global-norte.s3.amazonaws.com/dashboard/LUMEN-CAS-0009-22/images/de753f7b77ea499c356ebde41ab7b012-GSAF5460.JPG",
        "https://global-norte.s3.amazonaws.com/dashboard/LUMEN-CAS-0009-22/images/0b8d7b1b24cb34e3530475809cadeb15-GSAF4698.JPG",
        "https://global-norte.s3.amazonaws.com/dashboard/LUMEN-CAS-0009-22/images/2f8087af4e63370aa4b82e66359e172f-GSAF5458.JPG",
        "https://global-norte.s3.amazonaws.com/dashboard/LUMEN-CAS-0009-22/images/fa6d88908c9106f3881ad6f4def8d836-GSAF5457.JPG",
        "https://global-norte.s3.amazonaws.com/dashboard/LUMEN-CAS-0009-22/images/3351b92122404afad625fc2abd0b7dd6-GSAF5109.JPG"
    ]
    console.time("render")
    const outputs = await Promise.all(images.map(image=>{
        return renderImageAndCapture(image)
    }))

    console.timeEnd("render")    
}

run()