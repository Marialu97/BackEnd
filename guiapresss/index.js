const express = require("express");
const app = express();
const session = require("express-session");
const connection = require("./database/database");

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require("./users/UsersController");

const Article = require("./articles/Articles");
const Category = require("./categories/Category");

// View engine
app.set("view engine", "ejs");

// Sessions
app.use(
  session({
    secret: "textoaleatorio",
    cookie: { maxAge: 3600000 }, // 1 hora
    resave: false,
    saveUninitialized: false,
  })
);

// Torna o usuário logado disponível nas views EJS
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Static files
app.use(express.static("public"));

// Body parser (Express já suporta nativamente)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Middleware para carregar categorias nas views
app.use((req, res, next) => {
  Category.findAll()
    .then((categories) => {
      res.locals.categories = categories;
      next();
    })
    .catch((err) => {
      console.error("Erro ao carregar categorias no middleware:", err);
      res.locals.categories = [];
      next();
    });
});

// Database
connection
  .authenticate()
  .then(() => {
    console.log("Conexão feita com sucesso");
  })
  .catch((error) => {
    console.log(error);
  });

// Controllers
app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

// Testes de sessão
app.get("/session", (req, res) => {
  req.session.treinamento = "Formação Node.js";
  req.session.ano = 2025;
  req.session.email = "user@user.com";
  req.session.user = {
    username: "user",
    email: "user@user.com",
    id: 10,
  };
  res.send("Sessão Gerada");
});

app.get("/leitura", (req, res) => {
  res.json({
    treinamento: req.session.treinamento,
    ano: req.session.ano,
    email: req.session.email,
    user: req.session.user,
  });
});

// Rotas
app.get("/", (req, res) => {
  Article.findAll({
    order: [["id", "DESC"]],
  })
    .then((articles) => {
      res.render("index", { articles });
    })
    .catch((err) => {
      console.error("Erro ao buscar artigos:", err);
      res.redirect("/");
    });
});

app.get("/:slug", (req, res) => {
  const slug = req.params.slug;
  Article.findOne({
    where: { slug },
  })
    .then((article) => {
      if (article) {
        res.render("article", { article });
      } else {
        res.redirect("/");
      }
    })
    .catch((err) => {
      console.error("Erro ao buscar artigo:", err);
      res.redirect("/");
    });
});

app.get("/category/:slug", (req, res) => {
  const slug = req.params.slug;
  Category.findOne({
    where: { slug },
    include: [{ model: Article }],
  })
    .then((category) => {
      if (category) {
        res.render("index", { articles: category.articles });
      } else {
        res.redirect("/");
      }
    })
    .catch((err) => {
      console.error("Erro ao buscar categoria:", err);
      res.redirect("/");
    });
});

// Iniciar servidor
app.listen(4000, () => {
  console.log("O servidor está rodando na porta 4000");
});
