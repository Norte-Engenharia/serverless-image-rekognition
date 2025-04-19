import "dotenv/config";
import Handler from "./handler";
import RekognitionService from "./services/rekognitionService";

const handler = new Handler({
    rekoSvc: new RekognitionService(),
})

handler.main({
    Records:[
        {
            body: JSON.stringify({
                imageUrl: "https://global-norte.s3.amazonaws.com/dashboard/6495dabc599fea2ab32ff48b/images/29202da1bf58c6b9b2d1379b8463f0b1-GSAI4554.JPG",
                isLast: true,
                projectId: "6495dabc599fea2ab32ff48b",
                photoId: "6495f22b599fea2ab3300a8f"
            })
        }
    ]
})
