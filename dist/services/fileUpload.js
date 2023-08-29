"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const fs_1 = __importDefault(require("fs"));
const s3 = new aws_sdk_1.default.S3({ apiVersion: "2006-03-01" });
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION;
aws_sdk_1.default.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_BUCKET_REGION,
});
const uploadImage = async (file) => {
    try {
        if (!file) {
            throw new Error("No file found");
        }
        const fileContent = fs_1.default.readFileSync(file.path);
        const uploadParams = {
            Bucket: AWS_BUCKET_NAME,
            Key: `images/${Date.now()}_${file.originalname}`,
            Body: fileContent,
            ContentType: file.mimetype,
        };
        const data = await s3.upload(uploadParams).promise();
        return data.Location;
    }
    catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
};
exports.uploadImage = uploadImage;
//# sourceMappingURL=fileUpload.js.map