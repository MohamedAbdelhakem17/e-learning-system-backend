const path = require("path")
const ffmpeg = require("fluent-ffmpeg")
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const multerOptions = () => {
  const imageStoarge = multer.memoryStorage();
  const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb("This is Not Valuid Image", false);
    }
  };

  const upload = multer({ storage: imageStoarge, fileFilter: imageFilter });
  return upload;
};

const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/videos/');
  },
  filename: (req, file, cb) => {
    const filename = `Lesson-${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});


const videoManipulation = (File, Folder) => async (req, res, next) => {
  if (req.file) {
    const inputFilePath = req.file.path;
    const outputFileName = `${File}-${uuidv4()}-${Date.now()}.mp4`;
    const outputFilePath = `uploads/${Folder}/${outputFileName}`;

    ffmpeg(inputFilePath)
      .outputOptions('-c:v libx264')
      .outputOptions('-crf 23')
      .on('end', () => {
        req.body.video = outputFileName;
        next();
      })
      .on('error', (err) => {
        console.error('Error processing video: ', err);
        res.status(500).send('Error processing video');
      })
      .save(outputFilePath);
  } else {
    next();
  }
};

const uploadVideo = (filename) => multer({ storage: videoStorage }).single(filename);
const uploadSingleImage = (filename) => multerOptions().single(filename);

module.exports = {
  uploadSingleImage,
  uploadVideo,
  videoManipulation
};
