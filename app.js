const express = require('express');
const cookieParser = require('cookie-parser');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
// Renderが指定するポート、または3000番を使う設定
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('view engine', 'pug');
app.set('views', './views');

// 【変更点】トップページ：データベースからメッセージ一覧を読み込んで表示する
app.get('/', async (req, res) => {
    const username = req.cookies.username;
    
    if (!username) {
        return res.redirect('/login');
    }
    
    try {
        // 💡 Prismaを使って、データベースからメッセージを「作成日時の新しい順」に取得する
        const messages = await prisma.message.findMany({
            orderBy: { createdAt: 'desc' }
        });
        
        // チャット画面（index.pug）に、ユーザー名とメッセージ一覧を渡して表示
        res.render('index', { username, messages });
    } catch (error) {
        console.error(error);
        res.status(500).send('データベースの読み込みに失敗しました。');
    }
});

// ログイン表示
app.get('/login', (req, res) => {
    res.render('login');
});

// ログイン処理
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (password === 'pass123') {
        res.cookie('username', username, { maxAge: 60 * 60 * 1000 });
        return res.redirect('/');
    } else {
        return res.render('login', { error: 'パスワードが間違っています。(正解は pass123)' });
    }
});

// ログアウト処理
app.get('/logout', (req, res) => {
    res.clearCookie('username');
    res.redirect('/login');
});

// 【新機能】メッセージを投稿し、データベースに保存する（POSTメソッド）
app.post('/message', async (req, res) => {
    const username = req.cookies.username;
    const { content } = req.body;

    if (!username) {
        return res.redirect('/login');
    }

    try {
        // 💡 Prismaを使って、データベースにメッセージを新しく登録（保存）する！
        await prisma.message.create({
            data: {
                username: username,
                content: content
            }
        });
        
        // 保存が終わったら、トップページ（チャット画面）に自動リロードで戻る
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('メッセージの保存に失敗しました。');
    }
});

app.listen(PORT, () => {
    console.log(`サーバーが起動しました！ http://localhost:${PORT}`);
});