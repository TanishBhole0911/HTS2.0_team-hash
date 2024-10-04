# 📓 Notify – Your Virtual Learning Companion

## 📝 Overview

Notify is a next-generation note-taking application designed to enhance productivity and optimize learning. Unlike traditional note-taking apps, it acts as a **virtual study companion**, offering built-in features like flashcards, mind maps, and an integrated browser to streamline your workflow. Whether you're a student, self-learner, or professional, this app will help you **learn, interact, and grow**—all without the hassle of switching between tabs or tools.

### 🚀 Key Features

- **In-App Browser**: Research, read, and take notes without ever leaving the app.
- **Interactive Flashcards**: Auto-generated flashcards for real-time revision.
- **Mind Mapping**: Visualize your ideas and connect concepts effortlessly.
- **All-In-One Workspace**: Keep your learning tools—browser, notes, flashcards, and mind maps—conveniently together.
- **Tailored Learning Experience**: Adaptive to your study habits with quizzes and revision suggestions.

## 📂 Project Structure

    <git repo>
    ├── notify
    │ └── src
    │     ├── components
    │     ├── services
    │     └── ...
    ├── backend
    │    └── ...
    └── ...

### 🛠️ Technologies Used

- **Frontend**: Next js
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **State Management**: Redux
- **Editor**: TinyMCE (for rich text editing)
- **Ai** : Groq (Llama 3.1 7b)

## 🖥️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/TanishBhole0911/HTS2.0_team-hash.git
   ```
2. **Navigate to the project directory:**
   ```bash
   cd HTS2.0_team-hash
   ```
3. **create a .env file in the backend folder and add the following:**
   ```bash
   MONGO_URI = "your mongo uri"
   GROQ_API_KEY = "your groq api key"
   ```
4. **Create Environment**

   ```python
   python3 -m venv env

   .\env\Scripts\activate
   ```

5. **Install Frontend dependencies:**

   ```bash
   # cd into the notify directory
   cd notify

   # Install dependencies
   npm install

   # or if you're using Yarn:
   yarn install
   ```

6. **Run the app:**

   ```bash
   # Start the frontend:
   npm run build
   npm start

   # or with Yarn:
   yarn start
   ```

7. **Install Backend dependencies:**

   ```bash
    # cd into the backend directory
    cd backend

    # Install dependencies
    pip install -r requirements.txt
   ```

8. **Run the backend:**

   ```bash
    # Start the backend:
    uvicorn main:app --reload
   ```

9. Open your browser and navigate to `http://localhost:3000`.

10. **Test Backend:**

    open Postman and join 'https://app.getpostman.com/join-team?invite_code=f15603a1f80ac6623d3741dae5f4bf73&target_code=db4238a52b083f92191f73390963c716'

## 📚 Usage

Notify is designed to streamline your learning process. Here's how you can use it:

- **Create Notes**: Easily create, edit, and format notes.
- **Generate Flashcards**: Turn your notes into flashcards for active recall.
- **Mind Mapping**: Visually organize your notes into mind maps for better concept understanding.
- **Research Effortlessly**: Use the in-app browser to research without ever leaving the workspace. (In Development)
- **Test Your Knowledge**: Use built-in quizzes and flashcards to test your understanding on-the-go.
- **Chat bot**: Use the chat bot to get answers to your queries related to your colleges.

## 🛠️ Contributing

We welcome contributions! Here's how you can get involved:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## 🙌 Acknowledgements

- **React.js** for the interactive UI.
- **MongoDB** for database management.
- **TinyMCE/Quill** for rich text editing.

## ✨ Future Improvements

- Mobile app support (React Native/Flutter)
- Collaborative note-taking features
- Integration with other learning platforms (e.g., Google Scholar, Wikipedia)

---

Happy learning with Notify! 🎓

_This project was developed by **Team Hash** for **Hack The Space 2.0**._

---


Anurup Tiwari [Amazing session with wonderful interaction throughout, cheers to mozilla and ISF team] 241b607
