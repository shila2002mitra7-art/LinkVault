import crypto from "crypto";
import Link from "../models/link.model.js";

/*
========================================
UPLOAD TEXT
POST /api/upload
========================================
*/
export const uploadText = async (req, res) => {
  try {
    const { text, expiryMinutes, oneTime } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        message: "Text content is required",
      });
    }

    const uniqueId = crypto.randomBytes(8).toString("hex");

    const expiresAt = new Date(
      Date.now() + (Number(expiryMinutes) || 10) * 60 * 1000
    );

    await Link.create({
      uniqueId,
      contentType: "text",
      textContent: text,
      oneTime: oneTime === "true" || oneTime === true,
      expiresAt,
    });

    return res.status(201).json({
      message: "Text uploaded successfully",
      link: `${req.protocol}://${req.get("host")}/api/content/${uniqueId}`,
      expiresAt,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
};

/*
========================================
UPLOAD FILE
POST /api/upload/file
========================================
*/
export const uploadFile = async (req, res) => {
  try {
    const { expiryMinutes, oneTime } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "File is required",
      });
    }

    const uniqueId = crypto.randomBytes(8).toString("hex");

    const expiresAt = new Date(
      Date.now() + (Number(expiryMinutes) || 10) * 60 * 1000
    );

    await Link.create({
      uniqueId,
      contentType: "file",
      filePath: req.file.path,
      fileOriginalName: req.file.originalname,
      oneTime: oneTime === "true" || oneTime === true,
      expiresAt,
    });

    return res.status(201).json({
      message: "File uploaded successfully",
      link: `${req.protocol}://${req.get("host")}/api/download/${uniqueId}`,
      expiresAt,
    });
  } catch (error) {
    return res.status(500).json({
      message: "File upload failed",
      error: error.message,
    });
  }
};

/*
========================================
GET TEXT CONTENT
GET /api/content/:id
========================================
*/

export const getContent = async (req, res) => {
  try {
    const { id } = req.params;
    const link = await Link.findOne({ uniqueId: id });

    if (!link)
      return res.status(403).json({ message: "Invalid or expired link" });

    if (new Date() > link.expiresAt)
      return res.status(403).json({ message: "Link has expired" });

    // Just tell frontend what it is
    if (link.contentType === "text") {
      return res.json({
        type: "text",
        content: link.textContent,
        oneTime: link.oneTime
      });
    }

    if (link.contentType === "file") {
      return res.json({
        type: "file",
        fileName: link.fileOriginalName,
        oneTime: link.oneTime
      });
    }

  } catch {
    res.status(500).json({ message: "Failed to retrieve content" });
  }
};

   

/*
========================================
DOWNLOAD FILE
GET /api/download/:id
========================================
*/


export const downloadFile = async (req, res) => {
  try {
    const { id } = req.params;
    const link = await Link.findOne({ uniqueId: id });

    if (!link)
      return res.status(403).json({ message: "Invalid or expired link" });

    if (new Date() > link.expiresAt)
      return res.status(403).json({ message: "Link has expired" });

    if (link.contentType !== "file")
      return res.status(400).json({ message: "Not a file link" });

    // destroy AFTER download starts
    if (link.oneTime) {
      res.on("finish", async () => {
        await Link.deleteOne({ _id: link._id });
      });
    }

    return res.download(link.filePath, link.fileOriginalName);

  } catch {
    res.status(500).json({ message: "File download failed" });
  }
};


/* ================= CONFIRM VIEW (ONE TIME) ================= */
export const consumeLink = async (req, res) => {
  try {
    const { id } = req.params;

    const link = await Link.findOne({ uniqueId: id });

    if (!link) {
      return res.status(403).json({ message: "Invalid link" });
    }

    // delete only if one-time
    if (link.oneTime) {
      await Link.deleteOne({ _id: link._id });
    }

    res.json({ success: true });

  } catch (error) {
    res.status(500).json({ message: "Failed to consume link" });
  }
};

