const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("MediKiosk backend is running!");
});

app.post("/analyze", (req, res) => {
    const { complaint, language } = req.body;

    if (!complaint) {
        return res.status(400).json({
            error: "Complaint is required"
        });
    }

    const text = complaint.toLowerCase();

let questions;

if (language === "hi-IN") {
    questions = [
        "आपको यह समस्या कब से है?",
        "यह समस्या कितनी गंभीर है?",
        "क्या आपको कोई अन्य लक्षण महसूस हो रहे हैं?",
        "क्या आपने इसके लिए कोई दवा ली है?"
    ];
} 
else if (language === "te-IN") {
    questions = [
        "మీకు ఈ సమస్య ఎప్పటి నుండి ఉంది?",
        "ఈ సమస్య ఎంత తీవ్రంగా ఉంది?",
        "మీకు ఇంకా ఏవైనా ఇతర లక్షణాలు ఉన్నాయా?",
        "దీని కోసం మీరు ఏదైనా మందులు తీసుకున్నారా?"
    ];
}
else {
    questions = [
        "How long have you been experiencing this problem?",
        "How severe is the problem?",
        "Have you experienced any other symptoms?",
        "Have you taken any medication for it?"
    ];
}

  if (language === "hi-IN") {
    questions = [
        "आपको यह समस्या कब से है?",
        "यह समस्या कितनी गंभीर है?",
        "क्या आपको कोई अन्य लक्षण महसूस हो रहे हैं?",
        "क्या आपने इसके लिए कोई दवा ली है?"
    ];
}
else if (language === "te-IN") {
    questions = [
        "మీకు ఈ సమస్య ఎప్పటి నుండి ఉంది?",
        "ఈ సమస్య ఎంత తీవ్రంగా ఉంది?",
        "మీకు ఇంకా ఏవైనా ఇతర లక్షణాలు ఉన్నాయా?",
        "దీని కోసం మీరు ఏదైనా మందులు తీసుకున్నారా?"
    ];
}
else if (text.includes("headache")) {
    questions = [
        "How long have you been experiencing the headache?",
        "Where exactly do you feel the headache?",
        "How severe is the headache?",
        "Have you experienced nausea, vomiting, or dizziness?"
    ];
}
else if (text.includes("cough")) {
    questions = [
        "How long have you had the cough?",
        "Is the cough dry or with mucus?",
        "Do you have fever or difficulty breathing?",
        "Have you taken any medication for the cough?"
    ];
}
else if (text.includes("fever")) {
    questions = [
        "How long have you had the fever?",
        "What was the highest temperature you measured?",
        "Do you have chills, body pain, or weakness?",
        "Have you taken any medication for the fever?"
    ];
}
else if (text.includes("stomach pain")) {
    questions = [
        "How long have you had the stomach pain?",
        "Where exactly is the pain located?",
        "How severe is the pain?",
        "Have you experienced vomiting, diarrhea, or loss of appetite?"
    ];
}
else {
    questions = [
        "How long have you been experiencing this problem?",
        "How severe is the problem?",
        "Have you experienced any other symptoms?",
        "Have you taken any medication for it?"
    ];
}

    res.json({
        success: true,
        questions: questions
    });
});

const PORT = 3000;

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`MediKiosk server running on port ${PORT}`);
});
