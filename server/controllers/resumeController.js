import { response } from "express";
import imageKit from "../configs/imageKit.js";
import Resume from "../models/Resume.js";
import fs from "fs";

//POST: /api/resumes/create
export const createResume = async (req, res) => {
  try {
    const { userId } = req.userId;

    const { title } = req.body;

    const newResume = await Resume.create({ userId, title });
    res.status(201).json({
      success: true,
      message: "Resume created successfully",
      resume: newResume,
    });
  } catch (error) {
    console.error("Error: ", error.message);
    res.status(400).json({ success: false, message: "Error" + error.message });
  }
};

//POST: /api/resumes/delete
export const deleteResume = async (req, res) => {
  try {
    const { userId } = req.userId;

    const { resumeId } = req.params;

    await Resume.findOneAndDelete({ userId, _id: resumeId });
    res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("Error: ", error.message);
    res.status(400).json({ success: false, message: "Error" + error.message });
  }
};

// GET: /api/resumes/get
export const getResumeById = async (req, res) => {
  try {
    const { userId } = req.userId;

    const { resumeId } = req.params;

    const resume = await Resume.findOne({ userId, _id: resumeId });

    if (!resume) {
      return res
        .status(404)
        .json({ success: false, message: "Resume not found." });
    }

    resume.__v = undefined;
    resume.createdAt = undefined;
    resume.updatedAt = undefined;

    res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error("Error: ", error.message);
    res.status(400).json({ success: false, message: "Error" + error.message });
  }
};

// GET: /api/resumes/public
export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ public: true, _id: resumeId });

    if (!resume) {
      return res
        .status(404)
        .json({ success: false, message: "Resume not found." });
    }

    res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error("Error: ", error.message);
    res.status(400).json({ success: false, message: "Error" + error.message });
  }
};

//POST: /api/resumes/update
export const updateResume = async (req, res) => {
  try {
    const { userId } = req.userId;

    const { resumeId, resumeData, removeBackground } = req.body;
    const image = req.file;

    let resumeDataCopy = JSON.parse(resumeData);

    if (image) {
      const imageBufferData = fs.createReadStream(image.path);
      const response = await imageKit.files.upload({
        file: imageBufferData,
        fileName: "resume.png",
        folder: "user-resumes",
        transformation: {
          pre:
            "w-300,h-300,fo-face,z-0.75" +
            (removeBackground ? ",e-bgremove" : ""),
        },
      });
    }

    resumeDataCopy.personal_info.image= response.url;

    const resume = await Resume.findByIdAndUpdate(
      { userId, _id: resumeId },
      resumeDataCopy,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      resume,
    });
  } catch (error) {
    console.error("Error: ", error.message);
    res.status(400).json({ success: false, message: "Error" + error.message });
  }
};
