const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Articles");
const slugify = require("slugify");

// Listar todos os artigos
router.get("/admin/articles", (req, res) => {
    Article.findAll({
        include: [{ model: Category }]
    }).then(articles => {
        res.render("admin/articles/index", { articles });
    }).catch(err => {
        console.error("Erro ao buscar artigos:", err);
        res.redirect("/");
    });
});

// Formulário para criar novo artigo
router.get("/admin/articles/new", (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new", { categories });
    }).catch(err => {
        console.error("Erro ao carregar categorias:", err);
        res.redirect("/admin/articles");
    });
});

// Salvar ou atualizar artigo
router.post("/articles/save", (req, res) => {
    const { id, title, body, category } = req.body;

    if (!title || !body || !category) {
        return res.redirect("/admin/articles");
    }

    if (id) {
        // Atualizar artigo existente
        Article.update({
            title: title,
            slug: slugify(title),
            body: body,
            categoryId: category
        }, {
            where: { id: id }
        }).then(() => {
            res.redirect("/admin/articles");
        }).catch(err => {
            console.error("Erro ao atualizar artigo:", err);
            res.redirect("/admin/articles");
        });
    } else {
        // Criar novo artigo
        Article.create({
            title: title,
            slug: slugify(title),
            body: body,
            categoryId: category
        }).then(() => {
            res.redirect("/admin/articles");
        }).catch(err => {
            console.error("Erro ao salvar artigo:", err);
            res.redirect("/admin/articles/new");
        });
    }
});

// Deletar artigo
router.post("/articles/delete", (req, res) => {
    const id = req.body.id;

    if (id && !isNaN(id)) {
        Article.destroy({
            where: { id: id }
        }).then(() => {
            console.log("Artigo deletado, ID:", id);
            res.redirect("/admin/articles");
        }).catch(err => {
            console.error("Erro ao deletar artigo:", err);
            res.redirect("/admin/articles");
        });
    } else {
        res.redirect("/admin/articles");
    }
});

// Editar artigo
router.get("/admin/articles/edit/:id", (req, res) => {
    const id = req.params.id;

    Article.findByPk(id).then(article => {
        if (article) {
            Category.findAll().then(categories => {
                res.render("admin/articles/edit", {
                    article: article,
                    categories: categories
                });
            }).catch(err => {
                console.error("Erro ao buscar categorias:", err);
                res.redirect("/admin/articles");
            });
        } else {
            res.redirect("/admin/articles");
        }
    }).catch(err => {
        console.error("Erro ao buscar artigo:", err);
        res.redirect("/admin/articles");
    });
});

Article.sync({force: false})
module.exports = router;
