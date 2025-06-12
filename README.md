
# CareerPathAI - AI-Powered Career Development Platform

CareerPathAI is a comprehensive career development platform that combines AI-powered career guidance, mentorship booking through Payman integration, and resume analysis tools.

## 🚀 Features

### 1. Career Path Generator
- AI-powered career path recommendations
- Personalized learning roadmaps
- Industry-specific guidance
- Skills assessment and recommendations

### 2. Mentor Booking System
- **Payman Integration**: Seamlessly connect with real mentors through Payman
- **Real Payee Data**: Fetches actual payees from your Payman account as available mentors
- **Secure Payments**: Process mentor session payments directly through Payman
- **Transaction History**: View real transaction data from your Payman wallet
- **Wallet Balance**: Check your current Payman wallet balance
- **Session Booking**: Schedule mentorship sessions with available time slots

### 3. Resume ATS Checker
- Upload PDF resumes for analysis
- Get ATS (Applicant Tracking System) compatibility scores
- Detailed section-wise scoring (Contact, Summary, Experience, Skills, Education)
- Actionable improvement suggestions
- Industry best practices recommendations

## 🛠️ Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Shadcn/UI, Tailwind CSS
- **State Management**: TanStack React Query
- **Routing**: React Router DOM
- **Payment Processing**: Payman SDK (`@paymanai/payman-ts`)
- **Icons**: Lucide React
- **Charts**: Recharts

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd career-path-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

## 🔧 Payman Integration Setup

### Prerequisites
- Payman account with API credentials
- Client ID and Client Secret from Payman dashboard

### Configuration
1. Launch the application
2. Navigate to the Mentor Booking page
3. Enter your Payman credentials:
   - **Client ID**: Your Payman client ID (starts with `pm-`)
   - **Client Secret**: Your Payman client secret
4. Click "Connect to Payman"

### Features Enabled After Connection
- **Real Mentor Data**: Automatically fetches your Payman payees as available mentors
- **Payment Processing**: Book and pay for mentorship sessions
- **Wallet Management**: View balance and transaction history
- **Session Booking**: Complete end-to-end booking experience

## 📱 Application Screenshots

### 1. Home Page
![Home Page](public/screenshots/home-page.png)
*Landing page with feature overview and navigation*

### 2. Career Generator
![Career Generator](public/screenshots/career-generator.png)
*AI-powered career path recommendations based on your profile*

### 3. Mentor Booking - Login
![Mentor Booking Login](public/screenshots/mentor-booking-login.png)
*Payman credentials input for secure connection*

### 4. Mentor Booking - Connected
![Mentor Booking Connected](public/screenshots/mentor-booking-connected.png)
*Connected state showing wallet status and available mentors*

### 5. Mentor Booking - Mentor List
![Mentor List](public/screenshots/mentor-list.png)
*List of available mentors fetched from Payman payees*

### 6. Booking Form
![Booking Form](public/screenshots/booking-form.png)
*Session booking form with payment integration*

### 7. Payment Success
![Payment Success](public/screenshots/payment-success.png)
*Successful payment confirmation with transaction details*

### 8. Transaction History
![Transaction History](public/screenshots/transaction-history.png)
*Real transaction data from Payman wallet*

### 9. Resume ATS Checker
![Resume Checker](public/screenshots/resume-checker.png)
*Resume upload and ATS score analysis interface*

### 10. Resume Results
![Resume Results](public/screenshots/resume-results.png)
*Detailed ATS score breakdown with improvement suggestions*

## 🎯 How It Works

### Mentor Booking Flow
1. **Connect to Payman**: Enter your API credentials
2. **View Mentors**: System fetches your Payman payees as available mentors
3. **Select Mentor**: Choose from available mentors with their specialties
4. **Book Session**: Select date, time, and session details
5. **Make Payment**: Secure payment processing through Payman
6. **Confirmation**: Receive booking confirmation with transaction ID

### Resume Checker Flow
1. **Upload Resume**: Select PDF file (max 10MB)
2. **AI Analysis**: Advanced parsing and ATS compatibility check
3. **Get Scores**: Receive overall score and section-wise breakdown
4. **Review Suggestions**: Actionable improvement recommendations
5. **Optimize**: Apply suggestions and re-upload for better scores

## 📊 Payment Processing

The application uses the Payman SDK for secure payment processing:

```typescript
// Initialize Payman client
const payman = PaymanClient.withCredentials({
  clientId: "your-client-id",
  clientSecret: "your-client-secret"
});

// Process payment
const response = await payman.ask("Send $100 to mentor@example.com");
```

## 🔒 Security Features

- **Secure Credential Storage**: Payman credentials stored in memory only
- **Token Management**: Automatic token refresh and session management
- **Error Handling**: Comprehensive error handling for payment failures
- **Logout Functionality**: Clear credentials and start fresh sessions

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🆘 Support

For support with:
- **Payman Integration**: Check [Payman Documentation](https://docs.payman.ai)
- **Application Issues**: Create an issue in this repository
- **Feature Requests**: Open a discussion in the Issues tab

## 🎉 Success Metrics

- ✅ Real Payman integration with live payee data
- ✅ Secure payment processing for mentor sessions
- ✅ Comprehensive resume ATS analysis
- ✅ Responsive design for all device types
- ✅ Real-time transaction history and wallet balance
- ✅ Professional mentor booking experience

---


