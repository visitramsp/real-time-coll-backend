

require('dotenv').config();
const noteModel = require("../Model/notesSchema");
const createNote = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(200).json({
        response_code: 200,
        status: false,
        message: "Title is required"
      });
    }
    const note = new noteModel({
      title
    });
    await note.save();
    return res.status(201).json({
      response_code: 201,
      message: "Note created successfully",
      status: true,
      data: note
    });
  } catch (err) {
    return res.status(500).json({
      response_code: 500,
      status: false,
      message: "Server error",
      error: err.message
    });
  }
}

const getNotes = async (req, res) => {
  try {
    const note = await noteModel.findById(req.params.id);
    return res.status(200).json({
      response_code: 200,
      message: "get notes successfully",
      status: true,
      data: note || []
    });
  } catch (err) {
    return res.status(500).json({
      status_code: 500,
      status: false,
      message: err.message,
      error: 'Note not found'
    });
  }
}

const getAllNotes = async (req, res) => {
  try {
    console.log("get all notes");
    const note = await noteModel.find({});
    console.log(note,"note");
    return res.status(200).json({
      response_code: 200,
      message: "get all nots successfully",
      status: true,
      data: note || []
    });
  } catch (err) {
    return res.status(500).json({
      status_code: 500,
      status: false,
      message: err.message,
      error: 'Note not found'
    });
  }
}

const updateNotes = async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = await noteModel.findByIdAndUpdate(
      req.params.id,
      { title, content, updatedAt: new Date() },
      { new: true }
    );
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

}


module.exports = {
  createNote,
  getNotes,
  updateNotes,
  getAllNotes

};
