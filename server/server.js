const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const session = require('express-session');
const passport = require('passport');
const userRouter = require('./routes/user.route');
const projectRouter = require('./routes/project.route');
const taskRouter = require('./routes/task.route');
const downloadRouter = require('./routes/download');
const { swaggerUi, swaggerSpec } = require('./utils/swagger');
const commentRouter = require('./routes/comment.route');
const attachmentRouter = require('./routes/attachment.route');
const cors = require('cors');
const logger = require('./middlewares/logger');
require('./models/User.model');
require('./models/Project.model');
require('./models/Task.model');
require('./models/Comment.model');
require('./models/Attachment.model');

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(logger); 

app.use(session({
    secret: 'supersecret', // use a secure one in production
    resave: false,
    saveUninitialized: true
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

require('./utils/passport');

app.use('/u', require('./routes/auth.route'));
app.use('/user', userRouter);
app.use('/project', projectRouter);
app.use('/task', taskRouter);
app.use('/download', downloadRouter);
app.use('/comment', commentRouter);
app.use('/attachment', attachmentRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the Task Tracker!');
});

app.listen(port, async () => {
    try {
        await sequelize.sync();
        console.log('✅ Database synced');
        console.log(`Server is running on http://localhost:${port}`);
    } catch (err) {
        console.log(err);
    }
});