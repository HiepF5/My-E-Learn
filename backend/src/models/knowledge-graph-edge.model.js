const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define(
  "KnowledgeGraphEdge",
  {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    word_id_a: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    word_id_b: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    relation_type: { type: DataTypes.STRING(64), allowNull: false },
    weight: { type: DataTypes.DECIMAL(5, 3), allowNull: false, defaultValue: 1.0 },
  },
  { tableName: "knowledge_graph_edges", underscored: true, timestamps: true }
);
