const vocabularyNoteService = require("../services/vocabulary-note.service");

const getNote = async (req, res, next) => {
  try {
    const wordId = Number(req.params.id);
    const data = await vocabularyNoteService.getNote(req.user.userId, wordId);
    return res.status(200).json({
      success: true,
      data,
      message: "Vocabulary note",
    });
  } catch (error) {
    return next(error);
  }
};

const putNote = async (req, res, next) => {
  try {
    const wordId = Number(req.params.id);
    const data = await vocabularyNoteService.putNote(req.user.userId, wordId, req.body?.note_text);
    return res.status(200).json({
      success: true,
      data,
      message: "Vocabulary note saved",
    });
  } catch (error) {
    return next(error);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    const wordId = Number(req.params.id);
    await vocabularyNoteService.deleteNote(req.user.userId, wordId);
    return res.status(200).json({
      success: true,
      data: null,
      message: "Vocabulary note deleted",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getNote,
  putNote,
  deleteNote,
};
