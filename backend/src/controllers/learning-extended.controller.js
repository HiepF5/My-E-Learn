const learningExtendedService = require("../services/learning-extended.service");

const sentenceMiningList = async (req, res, next) => {
  try {
    const data = await learningExtendedService.listSentenceMining(
      req.user.userId,
      req.query.limit
    );
    return res.status(200).json({ success: true, data, message: "Sentence mining list" });
  } catch (e) {
    return next(e);
  }
};

const sentenceMiningCreate = async (req, res, next) => {
  try {
    const data = await learningExtendedService.createSentenceMining(req.user.userId, req.body || {});
    return res.status(201).json({ success: true, data, message: "Sentence saved" });
  } catch (e) {
    return next(e);
  }
};

const shadowingList = async (req, res, next) => {
  try {
    const data = await learningExtendedService.listShadowing(req.user.userId, req.query.limit);
    return res.status(200).json({ success: true, data, message: "Shadowing sessions" });
  } catch (e) {
    return next(e);
  }
};

const shadowingCreate = async (req, res, next) => {
  try {
    const data = await learningExtendedService.createShadowing(req.user.userId, req.body || {});
    return res.status(201).json({ success: true, data, message: "Shadowing session saved" });
  } catch (e) {
    return next(e);
  }
};

const grammarMicro = async (req, res, next) => {
  try {
    const data = await learningExtendedService.upsertGrammarMicro(req.user.userId, req.body || {});
    return res.status(200).json({ success: true, data, message: "Grammar micro log" });
  } catch (e) {
    return next(e);
  }
};

const dictationCreate = async (req, res, next) => {
  try {
    const data = await learningExtendedService.createDictation(req.user.userId, req.body || {});
    return res.status(201).json({ success: true, data, message: "Dictation attempt" });
  } catch (e) {
    return next(e);
  }
};

const dictationList = async (req, res, next) => {
  try {
    const data = await learningExtendedService.listDictation(req.user.userId, req.query.limit);
    return res.status(200).json({ success: true, data, message: "Dictation attempts" });
  } catch (e) {
    return next(e);
  }
};

const kgList = async (req, res, next) => {
  try {
    const data = await learningExtendedService.listKnowledgeEdges(req.query.word_id);
    return res.status(200).json({ success: true, data, message: "Knowledge graph edges" });
  } catch (e) {
    return next(e);
  }
};

const kgCreate = async (req, res, next) => {
  try {
    const data = await learningExtendedService.upsertKnowledgeEdge(req.body || {});
    return res.status(201).json({ success: true, data, message: "Edge created" });
  } catch (e) {
    return next(e);
  }
};

const whisperCreate = async (req, res, next) => {
  try {
    const data = await learningExtendedService.createWhisperTranscript(req.user.userId, req.body || {});
    return res.status(201).json({ success: true, data, message: "Transcript row" });
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  sentenceMiningList,
  sentenceMiningCreate,
  shadowingList,
  shadowingCreate,
  grammarMicro,
  dictationCreate,
  dictationList,
  kgList,
  kgCreate,
  whisperCreate,
};
