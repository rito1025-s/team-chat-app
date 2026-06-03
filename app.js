const express = require('express');
const { PrismaClient } = require('@prisma/client');
const session = require('express-session');
const cookieParser = require('cookie-parser'); // ⬅︎ この行を追加！

const app = express();
const prisma = new PrismaClient();

app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));

// ログインチェック用ミドルウェア
const checkAuth = (req, res, next) => {
  if (!req.session.username) return res.redirect('/login');
  next();
};

// ログイン画面
app.get('/login', (req, res) => res.render('login'));
app.post('/login', (req, res) => {
  if (req.body.password === 'pass123') {
    req.session.username = req.body.username;
    res.redirect('/');
  } else {
    res.send('パスワードが違います。');
  }
});

// メイン画面（チャット ＆ タスク一覧）
app.get('/', checkAuth, async (req, res) => {
  const messages = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
  const tasks = await prisma.task.findMany({ orderBy: { createdAt: 'desc' } }); // タスクを取得
  res.render('index', { username: req.session.username, messages, tasks });
});

// メッセージ投稿
app.post('/message', checkAuth, async (req, res) => {
  await prisma.message.create({
    data: { content: req.body.content, username: req.session.username }
  });
  res.redirect('/');
});

// タスク追加
app.post('/task', checkAuth, async (req, res) => {
  await prisma.task.create({
    data: { 
      title: req.body.title, 
      username: req.session.username,
      status: '未着手' 
    }
  });
  res.redirect('/');
});

// タスク更新
app.post('/task/update', checkAuth, async (req, res) => {
  await prisma.task.update({
    where: { id: parseInt(req.body.id) },
    data: { status: req.body.status }
  });
  res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));