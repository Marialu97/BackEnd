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

// Salvar artigo no banco
router.post("/articles/save", (req, res) => {
    console.log(req.body); // <- veja no terminal
    const { title, body, category } = req.body;

    if (title && body && category) {
        Article.create({
            title,
            slug: slugify(title),
            body,
            categoryId: category
        }).then(() => {
            res.redirect("/admin/articles");
        }).catch(err => {
            console.error("Erro ao salvar artigo:", err);
            res.redirect("/admin/articles/new");
        });
    } else {
        res.redirect("/admin/articles/new");
    }
});

// Rota para deletar um artigo
router.post("/articles/delete", (req, res) => {
    const id = req.body.id;

    if (id && !isNaN(id)) {
        Article.destroy({
            where: { id }
        }).then(() => {
            res.redirect("/admin/articles");
        }).catch(err => {
            console.error("Erro ao deletar artigo:", err);
            res.redirect("/admin/articles");
        });
    } else {
        res.redirect("/admin/articles");
    }
});

// Formulário de edição
router.get("/admin/articles/edit/:id", (req, res) => {
    const id = req.params.id;

    Article.findByPk(id).then(article => {
        if (article) {
            Category.findAll().then(categories => {
                res.render("admin/articles/edit", { article, categories });
            });
        } else {
            res.redirect("/admin/articles");
        }
    }).catch(err => {
        console.error("Erro ao buscar artigo:", err);
        res.redirect("/admin/articles");
    });
});

// Salvar edição do artigo
router.post("/articles/update", (req, res) => {
    const { id, title, body, category } = req.body;

    Article.update({
        title,
        slug: slugify(title),
        body,
        categoryId: category
    }, {
        where: { id }
    }).then(() => {
        res.redirect("/admin/articles");
    }).catch(err => {
        console.error("Erro ao atualizar artigo:", err);
        res.redirect("/admin/articles");
    });
});

router.post("admin/articles/edit/:id", (req,res) => {
    var id = req.params.id;
    Article.findByPk(id).then(article => {
        if(article != undefined){

            Category.findAll().then(categories => {
                res.render("admin/articles/edit", {categories: categories})

            });
            
        }else{
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    });
});

module.exports = router;
