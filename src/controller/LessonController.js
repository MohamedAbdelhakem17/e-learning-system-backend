const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const Factory = require("./handlersFactory");
const { uploadSingleImage, uploadVideo, videoManipulation } = require("../middleware/FileUploadingMiddleware");
const LessonsModel = require("../models/LessonsModel");

// handel image upload
const imageLessonUpload = uploadSingleImage("cover_image");
const imageManipulation = async (req, res, next) => {
  if (req.file) {
    const filename = `Lesson-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(400, 400)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/LessonsImage/${filename}`);
    req.body.imageCover = filename;
  }
  next();
};

const handelVideoUpload = videoManipulation("lesson", "LessonsVideos")

// Nested route
// GET /api/v1/curses/:cousrsId/lessons
const createFilterObj = (req, res, next) => {
  const filterObject = req.params.categoryId
    ? { category: req.params.categoryId }
    : {};

  req.body.filterObj = filterObject;
  next();
};

// @desc   Get List Of Lesson
// @route  GET  api/v1/Lesson
// @access Public
const getLessons = Factory.getAll(LessonsModel);

//  @desc   Get Spesific Lesson
//  @route  GET / api/v1/Lesson/:id
// @access  Public
const getLesson = Factory.getOne(LessonsModel);

//  @desc   Create New Lesson
//  @route  Post  api/v1/Lesson
//  @access Private
const setCourseIdToBody = (req, res, next) => {
  if (!req.body.course_ID) req.body.course_ID = req.params.courseId;
  next();
};

const createLesson = Factory.createOne(LessonsModel);

//  @desc   Update Lesson
//  @route  Put  api/v1/Lesson/:id
//  @access Private
const updateLesson = Factory.updateOne(LessonsModel);

//  @desc   Delete Lesson
//  @route  Delete  api/v1/Lesson/:id
//  @access Private
const deleteLesson = Factory.deleteOne(LessonsModel);

module.exports = {
  getLessons,
  createLesson,
  getLesson,
  updateLesson,
  deleteLesson,
  imageManipulation,
  imageLessonUpload,
  createFilterObj,
  setCourseIdToBody,
  uploadVideo,
  handelVideoUpload
};
