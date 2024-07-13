import express, { Response, Request, NextFunction } from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import path from "path";
import sanitize from "sanitize-filename";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const UPLOAD_DIR = path.join(__dirname, "../uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

app.get("/", (req: Request, res: Response) => {
  res.send("Images upload service - v1");
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const sanitizedFilename = sanitize(file.originalname).replace(/\s+/g, "-");
    cb(null, Date.now() + "-" + sanitizedFilename);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  },
});

app.post("/upload", upload.single("file"), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res
    .status(201)
    .json({ status: "success", filename: "/files/" + req.file.filename });
});

app.get("/files/:filename", (req: Request, res: Response) => {
  const filePath = path.join(UPLOAD_DIR, req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File Not Found!");
  }

  const mimeType =
    {
      ".jpeg": "image/jpeg",
      ".jpg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
    }[path.extname(filePath).toLowerCase()] || "application/octet-stream";

  res.setHeader("Content-Type", mimeType);
  res.sendFile(filePath);
});

app.listen(port, () => {
  console.log(`Images upload service listening on port : ${port}`);
});
