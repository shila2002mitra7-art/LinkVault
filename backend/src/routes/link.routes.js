import express from "express";
import upload from "../utils/multer.js";
import { uploadText, uploadFile, getContent, downloadFile, consumeLink } from "../controllers/link.controller.js";

const router = express.Router();

router.post("/upload", uploadText);
router.post("/upload/file", upload.single("file"), uploadFile);

router.get("/content/:id", getContent);
router.get("/download/:id", downloadFile);

router.delete("/content/:id", consumeLink);

export default router;
