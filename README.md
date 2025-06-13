# MentoerAI – AI-Powered Career Guidance Platform

MentoerAI is a modern, AI-powered career guidance and mentorship booking platform integrated with **Payman**. It empowers users to generate personalized career paths using the **Gemini API**, analyze their resumes with an ATS tracker, and seamlessly book paid mentorship sessions. The platform ensures secure, direct payments to mentors (Payman payees) when sessions are booked, creating a transparent and trusted environment for both mentors and mentees.

🌐 **Live App:** [🔗 Vercel Link](https://payman-project.vercel.app/)

---

## 🎯 Key Features

### 🧭 Career Path Generator
- Generate personalized career paths using the **Gemini API**
- AI-driven recommendations tailored to user interests and skills
- Display structured learning roadmap and skill development plan

### 📄 Resume ATS Checker
- Upload resumes in PDF format
- Analyze ATS (Applicant Tracking System) compatibility
- Section-wise feedback (Summary, Skills, Experience, etc.)
- Improvement suggestions and scoring system

### 👨‍🏫 Mentor Booking System
- **Real Mentors via Payman Payees**: Mentors are Payman payees, fetched directly from your Payman dashboard
- **Book Sessions**: Schedule one-on-one mentoring sessions
- **Secure Payment to Payee**: When a session is booked, the payment is directly transferred to the mentor’s Payman account
- **Add to Calendar**: Automatically add booked sessions to your calendar
- **Chat with Mentor**: Initiate and maintain chat before and after the session
- **Cancel Meeting**: Cancel sessions directly on the platform
- **Booked Sessions Tracker**: View your upcoming and past bookings in one place
- **Add Mentor**: Admins or mentors can add themselves as payees on Payman, making them instantly available on the platform

### 💼 Admin & Mentor Tools
- Role-based admin/mentor addition and management
- View and control mentors fetched as Payman payees
- Track all session bookings, cancellations, and transactions in real-time
- Admin panel with wallet, session history, and mentor control

---

## 📱 Application Screenshots

<p align="center">
  <img src="public/screenshots/home-page.PNG" alt="Home Page" width="250" style="border:1px solid #ccc; padding:4px;"/>
  <img src="public/screenshots/career-generator.PNG" alt="Career Generator" width="250" style="border:1px solid #ccc; padding:4px;"/>
  <img src="public/screenshots/mentor-booking-login.PNG" alt="Mentor Booking Login" width="250" style="border:1px solid #ccc; padding:4px;"/>
</p>

<p align="center">
  <img src="public/screenshots/mentor-list.PNG" alt="Mentor List" width="250" style="border:1px solid #ccc; padding:4px;"/>
  <img src="public/screenshots/booking-form.PNG" alt="Booking Form" width="250" style="border:1px solid #ccc; padding:4px;"/>
  <img src="public/screenshots/booked-session.PNG" alt="Booked Sessions" width="250" style="border:1px solid #ccc; padding:4px;"/>
</p>

<p align="center">
  <img src="public/screenshots/resume-checker.PNG" alt="Resume Checker" width="250" style="border:1px solid #ccc; padding:4px;"/>
  <img src="public/screenshots/resume-results.PNG" alt="Resume Results" width="250" style="border:1px solid #ccc; padding:4px;"/>
</p>

---

## 🧩 Application Flows

### 🧠 Career Path Flow
```
User Login
    ↓
Career Path Page
    ↓
Enter Interests + Profile Data
    ↓
↳ Gemini API Generates Career Map
    ↓
View Suggestions & Skill Plan
```

### 📄 Resume Checker Flow
```
User Uploads Resume
    ↓
ATS Analysis Initiated
    ↓
Parsed & Evaluated Resume
    ↓
Score Breakdown & Suggestions
```

### 🧑‍🏫 Mentor Booking Flow
```
User Authenticates
    ↓
Fetch Payman Payees (Mentors)
    ↓
Select Mentor + Slot
    ↓
Make Payment via Payman → Direct to Payee
    ↓
Booking Confirmed
    ↓
Add to Calendar
    ↓
Start Chat with Mentor
    ↓
View in Booked Sessions
```

### 🔁 Session Management Flow
```
User Books Session
    ↓
Appears in BookedSessions.tsx
    ↓
User Can:
   ↳ Cancel Session
   ↳ View Details
   ↳ Connect for Session
   ↳ Access Chat
```

### 🏢 Admin Flow
```
Admin Login
    ↓
Mentor Management Page
    ↓
Add Mentors (as Payman Payees)
    ↓
View / Book / Cancel / Join Google Meet
    ↓
Add to Calendar / Initiate Chat
    ↓
Track Session Activity
    ↓
View Transaction History (via Payman)
```

---

## 🔐 Security Features
- LocalStorage authentication for secure sessions
- No sensitive user credentials stored in DB
- Payman SDK manages all transactions securely
- Payments directly handled between user and mentor (payee)
- Role-based session and admin protection
- Full error handling and user-friendly alerts

---

## 📦 Installation Guide
```bash
git clone <your-repo-url>
cd mentoer-ai
npm install
npm run dev
```
Open in browser: `http://localhost:5173`

---

## 🚀 Deployment
```bash
npm run build
npm run preview
```
Hosted on: [Vercel](https://vercel.com)

---

## 🤝 Contributing
1. Fork the repo
2. Create your feature branch (`git checkout -b feature/awesome`)
3. Commit your changes (`git commit -m 'Add awesome feature'`)
4. Push to the branch (`git push origin feature/awesome`)
5. Create a Pull Request

---

## 📬 Support
- Gemini API: [Google Developers](https://developers.google.com/)
- Payman SDK Docs: [Payman Docs](https://docs.payman.ai)
- Raise issues in the repo for bugs/requests

---

## ✅ Milestones
* ✅ AI-powered roadmap generator (Gemini)
* ✅ Resume parser & ATS checker
* ✅ Payman-integrated mentorship system
* ✅ Real-time session cancel and booking updates
* ✅ Session tracker & mentor onboarding via Payman payees
* ✅ Admin flow and role-based mentor control

---

**Built with ❤️ by Shubh Marwadi**
