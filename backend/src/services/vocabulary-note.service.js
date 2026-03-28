const Vocabulary = require("../models/vocabulary.model");
const vocabularyNoteRepository = require("../repositories/vocabulary-note.repository");

const MAX_LEN = 4000;

const getNote = async (userId, wordId) => {
  const v = await Vocabulary.findByPk(wordId);
  if (!v) {
    const e = new Error("vocabulary not found");
    e.statusCode = 404;
    throw e;
  }
  const row = await vocabularyNoteRepository.getNote(userId, wordId);
  return row || { note_text: null, updated_at: null };
};

const putNote = async (userId, wordId, noteText) => {
  const v = await Vocabulary.findByPk(wordId);
  if (!v) {
    const e = new Error("vocabulary not found");
    e.statusCode = 404;
    throw e;
  }
  const text = String(noteText ?? "").trim();
  if (text.length > MAX_LEN) {
    const e = new Error(`note_text max length ${MAX_LEN}`);
    e.statusCode = 400;
    throw e;
  }
  if (!text) {
    await vocabularyNoteRepository.deleteNote(userId, wordId);
    return { note_text: null, updated_at: null };
  }
  return vocabularyNoteRepository.upsertNote(userId, wordId, text);
};

const deleteNote = async (userId, wordId) => {
  const v = await Vocabulary.findByPk(wordId);
  if (!v) {
    const e = new Error("vocabulary not found");
    e.statusCode = 404;
    throw e;
  }
  await vocabularyNoteRepository.deleteNote(userId, wordId);
  return { deleted: true };
};

module.exports = {
  getNote,
  putNote,
  deleteNote,
};
