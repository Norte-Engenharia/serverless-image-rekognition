'use strict';
class Handler{

  constructor({rekoSvc, translatorSvc}){
    this.rekoSvc = rekoSvc;
    this.translatorSvc=translatorSvc
  }

  async detectImageLabels(buffer){
    const result = await this.rekoSvc.detectLabels({
      Image:{
        Bytes:buffer
      }
    })
    .promise()

    const workingItems = result.Labels.filter(({Confidence})=> Confidence > 50);
    const names  = workingItems
    .map(({Name})=>Name)
    .join(" and ")

    return result
    
  }

  async translateText(text){
    const params ={
      SourceLanguageCode:"en",
      TargetLanguageCode:"pt",
      Text:text
    }

    const {TranslatedText} = await this.translatorSvc
                              .translateText(params)
                              .promise();        
                                                    
    return TranslatedText.split(' e ');
  }

  formatTextResults(texts, workingItems){
    const finalTexts=[];

    for(const indexText in texts){
      const nameInPortuguese = texts[indexText];
      const confidence = workingItems[indexText].Confidence;
      finalTexts.push(`A imagem possui ${confidence.toFixed(3)}% de ter um(a) ${nameInPortuguese}`);
    }

    return finalTexts;
  }

  async getImageBuffer(imageUrl){

    console.log("Downloading image...");
    const response = await axios.get(imageUrl,{
      responseType:"arraybuffer"
    })

    console.log("Buffering image...");
    const buffer = Buffer.from(response.data, "base64");
    return buffer
  }


  async main(event){
    try {      
      const {imageUrl} = event.queryStringParameters;

      const imgBuffer = await this.getImageBuffer(imageUrl)
      console.log("Detecting labels...");

      const result = await this.detectImageLabels(imgBuffer);
      console.log("Translating to portuguese...");
      // const texts = await this.translateText(names);

      console.log("Handling final object...");

      // const finalTexts = this.formatTextResults(texts, workingItems);

      console.log("finishing...");
      return {
        statusCode:200,
        body:JSON.stringify(result)
      }
    } catch (error) {
      console.error("ERROR->",error.stack);
      return {
        statusCode:500,
        body:"Internal Server Error!"
      }
    }
  }
}

const aws =require("aws-sdk");
const {default:axios} = require("axios");
const reko = new aws.Rekognition();
const translator = new aws.Translate();
const handler = new Handler({
  rekoSvc:reko,
  translatorSvc:translator
});
module.exports.main =handler.main.bind(handler)