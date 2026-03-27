const ErrorTag = require("../models/error-tag.model");
const ErrorTagMap = require("../models/error-tag-map.model");

const listTags = () => ErrorTag.findAll({ order: [["tag_name", "ASC"]] });

const findTagByName = (tagName) =>
  ErrorTag.findOne({ where: { tag_name: tagName } });

const createTag = (tagName) => ErrorTag.create({ tag_name: tagName });

const listTagIdsByErrorId = async (errorId) => {
  const rows = await ErrorTagMap.findAll({ where: { error_id: errorId } });
  return rows.map((row) => row.tag_id);
};

const replaceTagMap = async (errorId, tagIds = []) => {
  await ErrorTagMap.destroy({ where: { error_id: errorId } });
  if (!tagIds.length) return;
  const rows = tagIds.map((tagId) => ({ error_id: errorId, tag_id: tagId }));
  await ErrorTagMap.bulkCreate(rows);
};

module.exports = {
  listTags,
  findTagByName,
  createTag,
  listTagIdsByErrorId,
  replaceTagMap,
};
