const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const Factory = require("./handlersFactory");
const { uploadSingleImage, uploadVideo, videoManipulation } = require("../middleware/FileUploadingMiddleware");
const CoursesModel = require("../models/CoursesModel");

// handel image upload
const imageCourseUpload = uploadSingleImage("imageCover");
const imageManipulation = async (req, res, next) => {
  if (req.file) {
    const filename = `course-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(400, 400)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/courses/${filename}`);
    req.body.imageCover = filename;
  }
  next();
};

const handelVideoUpload = videoManipulation("lesson", "LessonsVideos")
// @desc   Get List Of Course
// @route  GET  api/v1/Course
// @access Public

const createFilterObj = (req, res, next) => {
  const filterObject = req.params.categoryId
    ? { category_id: req.params.categoryId }
    : {};

  req.body.filterObj = filterObject;
  next();
};

const getCourses = Factory.getAll(CoursesModel);

//  @desc   Get Spesific Course
//  @route  GET / api/v1/Course/:id
// @access  Public
const getCourse = Factory.getOne(CoursesModel);

//  @desc   Create New Course
//  @route  Post  api/v1/Course
//  @access Private
const setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};
const createCourse = Factory.createOne(CoursesModel);

//  @desc   Update Course
//  @route  Put  api/v1/Course/:id
//  @access Private
const updateCourse = Factory.updateOne(CoursesModel);

//  @desc   Delete Course
//  @route  Delete  api/v1/Course/:id
//  @access Private
const deleteCourse = Factory.deleteOne(CoursesModel);

module.exports = {
  getCourses,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
  imageManipulation,
  imageCourseUpload,
  uploadVideo,
  handelVideoUpload,
  setCategoryIdToBody,
  createFilterObj
};
