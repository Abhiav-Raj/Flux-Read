# Major Project - Flux Read  


**Flux Read** is a web application designed to help users enhance their reading speed and comprehension. It provides various exercises and tools to improve reading efficiency and understanding over time.  

---

## Features  
- **Speed Reading:** Practice speed reading with adjustable reading speeds.  
- **Comprehension:** Measure comprehension with quizzes and exercises.  
- **Progress Tracking:** Track your reading speed improvement over time.  
- **Customization:** Choose reading materials according to your interests and preferences.  
- **Two-Factor Authentication:** Secure your account with two-factor authentication.  
- **OAuth Sign-Up:** Sign up using GitHub or Google accounts for easier access.  

---

## Tech Stack  
- **Frontend:** React.js, Tailwind CSS, Radix UI  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Authentication:** JSON Web Tokens (JWT), OAuth with GitHub and Google  
- **Other Tools:** Redux (for state management), Axios (for API requests), Google Translate API (for language translation)  

---

## Screenshots  
<img width="864" height="608" alt="image" src="https://github.com/user-attachments/assets/abe478d0-935a-45fd-85d0-d88ea506b120" />
<img width="844" height="500" alt="image" src="https://github.com/user-attachments/assets/accc9301-e6d8-418a-86a1-2accc4dcef98" />
<img width="842" height="504" alt="image" src="https://github.com/user-attachments/assets/487f52eb-03a7-4dd5-8082-04039a4ab996" />
<img width="862" height="472" alt="image" src="https://github.com/user-attachments/assets/6f87815e-629e-4aa5-bff1-1dfd205ca183" />

---

## 🔧 Installation  
1. Clone the repository:  
git clone https://github.com/Abhiav-Raj/Flux-Read.git  

2. Navigate to the project directory:  
cd Flux-Read  

3. Split Terminal in 2 parts:  
**3.1. Front-End**  
cd FrontEnd  

**3.2. Back-End**  
cd BackEnd  

4. Install dependencies:  
npm install  

5. Create a `.env` file in the **BackEnd** folder and add the following:  
PORT=your_local_port  
MONGODB_URI=mongodb+srv://<username>:<password>@clusterfluxread.mongodb.net  
JWT_SECRET=your_local_secret  
EMAIL_USER=abc@example.com  
EMAIL_PASSWORD=some_password  
HTML_CONTENT_FOR_EMAIL_VERIFICATION=''  
GOOGLE_CLIENT_ID=your_google_client_id  
GOOGLE_CLIENT_SECRET=your_google_client_secret  
GITHUB_CLIENT_ID=your_github_client_id  
GITHUB_CLIENT_SECRET=your_github_client_secret  

6. Run the development server:  
For Front-End:  
npm run dev  

For Back-End:  
npm run start  

7. Open http://localhost:5173 to view the app in your browser.


## 🌟 Extra Features  
- **Dynamic Content Generation:** Use GPT models to dynamically generate personalized reading exercises, prompts, or quizzes.  
- **Personalized Learning Paths:** Customized reading plans based on user interests and performance.  
- **Adaptive Learning:** Adjusts reading difficulty automatically as users improve.  
- **Text Summarization:** Summarize long passages for quicker understanding.  
- **Feedback and Assessment:** Real-time feedback on speed, comprehension, and improvement tips.  
- **Eye Movement Tracking:** Analyze eye movements to identify reading inefficiencies.  
- **Content Recommendation:** Suggest reading materials based on previous activity.  
- **NLP Assistance:** Simplify complex text by breaking down difficult sentences.  
- **Interactive Exercises:** Real-world simulated reading exercises.  
- **Progress Tracking and Visualization:** Graphs and charts showing growth trends.  
- **Text Import and Sync:** Import from websites, PDFs, or ebooks and sync across devices.  
- **Bookmarking and Annotation:** Highlight, bookmark, and add notes for future reference.  
- **Accessibility Features:** Screen reader support, keyboard navigation, and high-contrast modes.  

---

## 🗂 CRUD Operations  
- **User Operations:** Login, signup, and security features.  
- **High-level Authentication**  
- **Image/Blog/Video CRUD**  
- **Chat Interface**  

---

## 📜 License  
This project is licensed under the [MIT License](LICENSE).  
