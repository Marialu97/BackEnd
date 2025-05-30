const Sequelize = require("sequelize");
const connection = require("../database/database");
const Category = require("../categories/Category");

const Article = connection.define("articles", {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

Category.hasMany(Article);       // 1 categoria → muitos artigos
Article.belongsTo(Category);     // 1 artigo → 1 categoria



module.exports = Article;
