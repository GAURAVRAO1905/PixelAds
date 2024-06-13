import multer from "multer";
import path from 'path';
import fs from 'fs'; // Import the file system module
import { fileURLToPath } from 'url'; // Node.js utility to convert URL to file path

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Define the upload directory
const uploadDir = path.join(__dirname, '../public/temp');

// Check if the directory exists, and create it if it doesn't
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Ensure all parent folders are created
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
  }
});

// File filter to allow only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter 
});

export { upload };
