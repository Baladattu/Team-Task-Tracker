```markdown
# 🧑‍💼 Team Task Tracker

A full-stack task management web application for teams. Features include OAuth login via GitHub/Google, project/task management, comments, file uploads via Zata (S3-compatible), and a clean, modular frontend using HTML, TailwindCSS, and JavaScript.

---

## 🔧 Technologies Used

### Backend:
- Node.js + Express
- Passport.js (OAuth2 with GitHub & Google)
- PostgreSQL with Sequelize ORM
- Zata (S3-compatible file storage)
- Swagger UI for API docs

### Frontend:
- HTML5 + TailwindCSS
- Vanilla JavaScript (modular structure)
- Responsive UI (no framework)

---

## ⚙️ Project Structure

```

server/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── utils/
├── config/
├── uploads/
├── server.js

client/
├── components/
├── pages/
├── js/
├── styles/
├── index.html
├── dashboard.html
...

````

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/team-task-tracker.git
cd team-task-tracker
````

---

### 2. Backend Setup

#### Install dependencies

```bash
cd server
npm install
```

#### Set up environment variables

Create a `.env` file in the `server/` folder:

```env
PORT=3000

DATABASE_URL=postgres://username:password@localhost:5432/team_task_tracker

SESSION_SECRET=your_session_secret

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

ZATA_ACCESS_KEY=your_access_key
ZATA_SECRET_KEY=your_secret_key
ZATA_BUCKET_NAME=your_bucket_name
ZATA_REGION=your_region
ZATA_ENDPOINT=https://s3.your-endpoint.com
```

#### Run migrations (if using Sequelize CLI)

```bash
npx sequelize-cli db:migrate
```

#### Start the server

```bash
node server.js
```

---

### 3. Frontend Setup

#### Open the frontend

Go to the `client/` folder and open `login.html` or `dashboard.html` in a browser:

```bash
cd client
```

Start a local server if needed:

```bash
npx live-server
# or
python3 -m http.server
```

---

## 🔐 Authentication

* OAuth Login via:

  * [x] GitHub
  * [x] Google
* Session-based authentication with `express-session` and cookies

---

## 📁 File Uploads

* Files are uploaded directly to Zata (S3-compatible)
* Download links are signed URLs with expiry

---

## 📚 API Documentation

Visit: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## 📌 Features

* ✅ OAuth Login
* ✅ Dashboard View
* ✅ Create & Manage Projects and Tasks
* ✅ Comments on Tasks
* ✅ Attachments via Zata (S3)
* ✅ Protected API Routes with Middleware
* ✅ Swagger UI for API docs

---

## 🛠️ TODO

* [ ] Notification System
* [ ] Real-time collaboration (WebSocket)
* [ ] Role-based access control

---

## 📃 License

MIT License
```
