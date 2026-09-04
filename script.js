const aiProcessingScreen = document.getElementById("aiProcessingScreen");
const aiProcessingStatus = document.getElementById("aiProcessingStatus");

const doctorDashboard = document.getElementById("doctorDashboard");
const editCaseButton =
    document.getElementById("editCaseButton");
    const saveAyushEditButton =
    document.getElementById("saveAyushEditButton");

const editAyushHistory =
    document.getElementById("editAyushHistory");

const ayushContinueButton = document.getElementById("ayushContinueButton");
const ayushScreen = document.getElementById("ayushScreen");
const clinicalHistoryScreen =
    document.getElementById("clinicalHistoryScreen");

const clinicalHistoryContinueButton =
    document.getElementById("clinicalHistoryContinueButton");

const processingScreen = document.getElementById("processingScreen");

const answerVoiceButton = document.getElementById("answerVoiceButton");

const startButton = document.getElementById("startButton");
const continueButton = document.getElementById("continueButton");
const caseContinueButton = document.getElementById("caseContinueButton");
const answerButton = document.getElementById("answerButton");
const documentContinueButton = document.getElementById("documentContinueButton");
const skipDocumentsButton = document.getElementById("skipDocumentsButton");
const voiceButton = document.getElementById("voiceButton");
const languageSelect = document.getElementById("languageSelect");
const caseInstruction = document.getElementById("caseInstruction");
languageSelect.addEventListener("change", function () {

    if (languageSelect.value === "hi-IN") {
        caseInstruction.textContent =
            "अपनी मुख्य समस्या बताएं। आप टाइप कर सकते हैं या आवाज़ का उपयोग कर सकते हैं।";
    }
    else if (languageSelect.value === "te-IN") {
        caseInstruction.textContent =
            "మీ ప్రధాన సమస్యను చెప్పండి. మీరు టైప్ చేయవచ్చు లేదా వాయిస్ ఉపయోగించవచ్చు.";
    }
    else {
        caseInstruction.textContent =
            "Tell us what brings you here. You can type your symptoms or use voice input.";
    }

});
const finishButton = document.getElementById("finishButton");

const welcomeScreen = document.getElementById("welcomeScreen");
const consentScreen = document.getElementById("consentScreen");
const consentCheckbox = document.getElementById("consentCheckbox");
const consentContinueButton =
    document.getElementById("consentContinueButton");

const patientForm = document.getElementById("patientForm");
const caseTakingScreen = document.getElementById("caseTakingScreen");
const questionScreen = document.getElementById("questionScreen");
const documentScreen = document.getElementById("documentScreen");
const summaryScreen = document.getElementById("summaryScreen");

const aiQuestion = document.getElementById("aiQuestion");
const answerInput = document.getElementById("answerInput");
const chiefComplaint = document.getElementById("chiefComplaint");

const redFlagAlert = document.getElementById("redFlagAlert");
const redFlagMessage = document.getElementById("redFlagMessage");

const summaryQuestions = document.getElementById("summaryQuestions");
const quickAnswers = document.getElementById("quickAnswers");

let currentQuestion = 0;
let answers = [];

let redFlags = [
    "chest pain",
    "difficulty breathing",
    "severe bleeding",
    "unconscious",
    "fainting",
    "severe pain"
];
function getQuickOptions(question) {

    const q = question.toLowerCase();

    if (
        q.includes("how long") ||
        q.includes("कब से") ||
        q.includes("ఎప్పటి నుండి")
    ) {
        return [
            "Today",
            "2–3 days",
            "About a week",
            "Several weeks",
            "More than a month"
        ];
    }

    if (
        q.includes("how severe") ||
        q.includes("कितनी गंभीर") ||
        q.includes("ఎంత తీవ్ర")
    ) {
        return [
            "Mild",
            "Moderate",
            "Severe"
        ];
    }

    if (
        q.includes("have you experienced") ||
        q.includes("क्या आपको") ||
        q.includes("మీకు")
    ) {
        return [
            "Yes",
            "No"
        ];
    }

    if (
        q.includes("taken any medication") ||
        q.includes("दवा ली") ||
        q.includes("మందులు తీసుకున్న")
    ) {
        return [
            "Yes",
            "No"
        ];
    }

    return [];
}
let detectedFlags = [];
const complaintText = chiefComplaint.value.toLowerCase();

for (let flag of redFlags) {
    if (complaintText.includes(flag)) {
        detectedFlags.push(flag);
    }
}

let questions = [
    "How long have you been experiencing this problem?",
    "How severe is the problem?",
    "Have you experienced any other symptoms?",
    "Have you taken any medication for it?"
];



// START CONSULTATION → CONSENT
startButton.addEventListener("click", function () {
    welcomeScreen.style.display = "none";
    consentScreen.style.display = "block";
});


// CONSENT → PATIENT DETAILS
consentContinueButton.addEventListener("click", function () {

    if (!consentCheckbox.checked) {
        alert("Please provide your consent to continue.");
        return;
    }

    consentScreen.style.display = "none";
    patientForm.style.display = "block";
});


// CONSENT → PATIENT DETAILS
consentContinueButton.addEventListener("click", function () {

    if (!consentCheckbox.checked) {
        alert("Please provide your consent to continue.");
        return;
    }

    consentScreen.style.display = "none";
    patientForm.style.display = "block";
});


// PATIENT DETAILS
continueButton.addEventListener("click", function () {

    const name = document.getElementById("patientName").value;
    const age = document.getElementById("patientAge").value;
    const gender = document.getElementById("patientGender").value;

    if (name === "" || age === "" || gender === "") {
        alert("Please fill in all required details.");
        return;
    }

    patientForm.style.display = "none";
    caseTakingScreen.style.display = "block";
});


// CASE TAKING → BACKEND
caseContinueButton.addEventListener("click", function () {

    const complaint = chiefComplaint.value.trim();

    if (complaint === "") {
        alert("Please describe your main problem.");
        return;
    }

    fetch("https://midikiosk.onrender.com/analyze", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
    complaint: complaint,
    language: languageSelect.value
})
    })

    .then(response => response.json())

    .then(data => {

        if (!data.success) {
            alert("Could not analyze the complaint.");
            return;
        }

        questions = data.questions;

        currentQuestion = 0;
        answers = [];

        caseTakingScreen.style.display = "none";
        aiProcessingScreen.style.display = "block";

        aiProcessingStatus.textContent =
            "Understanding the patient's complaint...";

        setTimeout(function () {

            aiProcessingStatus.textContent =
                "Selecting relevant questions...";

        }, 1000);

        setTimeout(function () {

            aiProcessingScreen.style.display = "none";
            questionScreen.style.display = "block";

            aiQuestion.textContent =
    questions[currentQuestion];

quickAnswers.innerHTML = "";



getQuickOptions(questions[currentQuestion]).forEach(function (option) {

    const button = document.createElement("button");

    button.textContent = option;

    button.addEventListener("click", function () {
        answerInput.value = option;
    });

    quickAnswers.appendChild(button);

});

        }, 2000);

    })

    .catch(error => {

        console.error("Backend connection error:", error);

        alert("Could not connect to the AI backend.");

    });

});


// ANSWER QUESTIONS
answerButton.addEventListener("click", function () {

    const answer = answerInput.value.trim();

    if (answer === "") {
        alert("Please provide an answer.");
        return;
    }

    answers.push(answer);

    currentQuestion++;

    answerInput.value = "";

    if (currentQuestion < questions.length) {

    aiQuestion.textContent =
        questions[currentQuestion];

    quickAnswers.innerHTML = "";

    getQuickOptions(questions[currentQuestion]).forEach(function (option) {
        const button = document.createElement("button");

        button.textContent = option;

        button.addEventListener("click", function () {
            answerInput.value = option;
        });

        quickAnswers.appendChild(button);

    });

} else {

        questionScreen.style.display = "none";
        ayushScreen.style.display = "block";

    }

});


// AYUSH → CLINICAL HISTORY
ayushContinueButton.addEventListener("click", function () {

    ayushScreen.style.display = "none";
    clinicalHistoryScreen.style.display = "block";

});


// CLINICAL HISTORY → DOCUMENTS
clinicalHistoryContinueButton.addEventListener("click", function () {

    clinicalHistoryScreen.style.display = "none";
    documentScreen.style.display = "block";

});


// DOCUMENT UPLOAD
const medicalDocuments =
    document.getElementById("medicalDocuments");

const fileList =
    document.getElementById("fileList");

let uploadedDocuments = [];

medicalDocuments.addEventListener("change", function () {

    uploadedDocuments = Array.from(medicalDocuments.files);

    fileList.innerHTML = "";

    for (let file of uploadedDocuments) {

        const item = document.createElement("p");

        item.textContent = "📄 " + file.name;

        fileList.appendChild(item);

    }

});


// DOCUMENTS → SUMMARY
documentContinueButton.addEventListener("click", function () {

    const files =
        document.getElementById("medicalDocuments").files;

    

    detectedFlags = [];

    for (let answer of answers) {

        let lowerAnswer = answer.toLowerCase();

        for (let flag of redFlags) {

            if (lowerAnswer.includes(flag)) {

                detectedFlags.push(flag);

            }

        }

    }

    documentScreen.style.display = "none";
    processingScreen.style.display = "block";

    setTimeout(function () {

        processingScreen.style.display = "none";
        summaryScreen.style.display = "block";

    }, 2000);


    document.getElementById("summaryName").textContent =
        document.getElementById("patientName").value;

    document.getElementById("summaryAge").textContent =
        document.getElementById("patientAge").value;

    document.getElementById("summaryGender").textContent =
        document.getElementById("patientGender").value;

    document.getElementById("summaryComplaint").textContent =
        chiefComplaint.value;


    summaryQuestions.innerHTML = "";

    for (let i = 0; i < questions.length; i++) {

        const item =
            document.createElement("li");

        item.textContent =
            questions[i] + " — " + answers[i];

        summaryQuestions.appendChild(item);

    }
    const summaryClinicalHistory =
    document.getElementById("summaryClinicalHistory");

summaryClinicalHistory.innerHTML = `
    <p><strong>Past Medical History:</strong>
    ${document.getElementById("pastMedicalHistory").value}</p>

    <p><strong>Past Surgical History:</strong>
    ${document.getElementById("pastSurgicalHistory").value}</p>

    <p><strong>Current Medications:</strong>
    ${document.getElementById("currentMedications").value}</p>

    <p><strong>Allergies:</strong>
    ${document.getElementById("allergies").value}</p>

    <p><strong>Family History:</strong>
    ${document.getElementById("familyHistory").value}</p>

    <p><strong>Personal History:</strong>
    ${document.getElementById("personalHistory").value}</p>

    <p><strong>Previous Investigations:</strong>
    ${document.getElementById("previousInvestigations").value}</p>
`;


    if (detectedFlags.length > 0) {

        redFlagAlert.style.display = "block";

        redFlagMessage.textContent =
            "Possible warning symptom detected: " +
            detectedFlags.join(", ") +
            ". Please review this patient promptly.";

    } else {

        redFlagAlert.style.display = "none";

    }


});
skipDocumentsButton.addEventListener("click", function () {

    medicalDocuments.value = "";
uploadedDocuments = [];
fileList.innerHTML = "";

    document.getElementById("summaryName").textContent =
        document.getElementById("patientName").value;

    document.getElementById("summaryAge").textContent =
        document.getElementById("patientAge").value;

    document.getElementById("summaryGender").textContent =
        document.getElementById("patientGender").value;

    document.getElementById("summaryComplaint").textContent =
        chiefComplaint.value;

    summaryQuestions.innerHTML = "";

    for (let i = 0; i < questions.length; i++) {

        const item = document.createElement("li");

        item.textContent =
            questions[i] + " — " + answers[i];

        summaryQuestions.appendChild(item);
    }

    const summaryClinicalHistory =
        document.getElementById("summaryClinicalHistory");

    summaryClinicalHistory.innerHTML = `
        <p><strong>Past Medical History:</strong>
        ${document.getElementById("pastMedicalHistory").value}</p>

        <p><strong>Past Surgical History:</strong>
        ${document.getElementById("pastSurgicalHistory").value}</p>

        <p><strong>Current Medications:</strong>
        ${document.getElementById("currentMedications").value}</p>

        <p><strong>Allergies:</strong>
        ${document.getElementById("allergies").value}</p>

        <p><strong>Family History:</strong>
        ${document.getElementById("familyHistory").value}</p>

        <p><strong>Personal History:</strong>
        ${document.getElementById("personalHistory").value}</p>

        <p><strong>Previous Investigations:</strong>
        ${document.getElementById("previousInvestigations").value}</p>
    `;

    documentScreen.style.display = "none";
    processingScreen.style.display = "block";

    setTimeout(function () {
        processingScreen.style.display = "none";
        summaryScreen.style.display = "block";
    }, 1500);
});


// VOICE INPUT FOR COMPLAINT
voiceButton.addEventListener("click", function () {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

        alert("Voice input is not supported in this browser.");
        return;

    }

    const recognition =
        new SpeechRecognition();

    recognition.lang = languageSelect.value;

    recognition.start();

    voiceButton.textContent =
        "🎤 Listening...";


    recognition.onresult = function (event) {

        const speechText =
            event.results[0][0].transcript;

        chiefComplaint.value =
            speechText;

        voiceButton.textContent =
            "🎤 Speak";

    };


    recognition.onerror = function () {

        voiceButton.textContent =
            "🎤 Speak";

        alert("Could not understand the voice. Please try again.");

    };

});


// VOICE INPUT FOR ANSWERS
answerVoiceButton.addEventListener("click", function () {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

        alert("Voice input is not supported in this browser.");
        return;

    }

    const recognition =
        new SpeechRecognition();

    recognition.lang = languageSelect.value;

    recognition.start();

    answerVoiceButton.textContent =
        "🎤 Listening...";


    recognition.onresult = function (event) {

        const speechText =
            event.results[0][0].transcript;

        answerInput.value =
            speechText;

        answerVoiceButton.textContent =
            "🎤 Speak Answer";

    };


    recognition.onerror = function () {

        answerVoiceButton.textContent =
            "🎤 Speak Answer";

        alert("Could not understand the voice. Please try again.");

    };

});


// FINISH → DOCTOR DASHBOARD
finishButton.addEventListener("click", function () {

    doctorDashboard.style.display = "block";
    summaryScreen.style.display = "none";


    document.getElementById("doctorName").textContent =
    document.getElementById("summaryName").textContent;

document.getElementById("doctorAge").textContent =
    document.getElementById("summaryAge").textContent;

document.getElementById("doctorGender").textContent =
    document.getElementById("summaryGender").textContent;

    document.getElementById("doctorComplaint").textContent =
        chiefComplaint.value;
    const aiSummaryComplaint =
    document.getElementById("aiSummaryComplaint");

const aiSummaryPatient =
    document.getElementById("aiSummaryPatient");

const aiSummaryHistory =
    document.getElementById("aiSummaryHistory");

const aiSummaryAyush =
    document.getElementById("aiSummaryAyush");

const aiSummaryAlerts =
    document.getElementById("aiSummaryAlerts");
const aiClinicalSummary =
    document.getElementById("aiClinicalSummary");

aiSummaryComplaint.textContent = chiefComplaint.value;

aiSummaryPatient.textContent =
    `${document.getElementById("summaryName").textContent}, ` +
    `${document.getElementById("summaryAge").textContent} years, ` +
    `${document.getElementById("summaryGender").textContent}`;

aiSummaryHistory.textContent =
    `${document.getElementById("pastMedicalHistory").value} | ` +
    `${document.getElementById("pastSurgicalHistory").value} | ` +
    `${document.getElementById("currentMedications").value} | ` +
    `${document.getElementById("allergies").value}`;

aiSummaryAyush.textContent =
    `Prakriti: ${document.getElementById("prakriti").value}, ` +
    `Vikriti: ${document.getElementById("vikriti").value}, ` +
    `Sara: ${document.getElementById("sara").value}, ` +
    `Vaya: ${document.getElementById("vaya").value}`;
const dashboardComplaint =
    chiefComplaint.value.toLowerCase();

let dashboardFlags = [];

for (let flag of redFlags) {
    if (dashboardComplaint.includes(flag)) {
        dashboardFlags.push(flag);
    }
}

if (dashboardFlags.length > 0) {

    aiSummaryAlerts.textContent =
        "⚠️ Warning symptom detected: " +
        dashboardFlags.join(", ") +
        ". Physician review recommended.";

} else {

    aiSummaryAlerts.textContent =
        "No warning symptoms detected.";

}


    const doctorQuestions =
        document.getElementById("doctorQuestions");

    doctorQuestions.innerHTML = "";


    for (let i = 0; i < questions.length; i++) {

        const item =
            document.createElement("li");

        item.textContent =
            questions[i] + " — " + answers[i];

        doctorQuestions.appendChild(item);

    }


    const doctorAyushData =
        document.getElementById("doctorAyushData");


    doctorAyushData.innerHTML = `

        <p><strong>Prakriti:</strong>
        ${document.getElementById("prakriti").value}</p>

        <p><strong>Vikriti:</strong>
        ${document.getElementById("vikriti").value}</p>

        <p><strong>Sara:</strong>
        ${document.getElementById("sara").value}</p>

        <p><strong>Samhanana:</strong>
        ${document.getElementById("samhanana").value}</p>

        <p><strong>Pramana:</strong>
        ${document.getElementById("pramana").value}</p>

        <p><strong>Satmya:</strong>
        ${document.getElementById("satmya").value}</p>

        <p><strong>Sattva:</strong>
        ${document.getElementById("sattva").value}</p>

        <p><strong>Ahara Shakti:</strong>
        ${document.getElementById("aharaShakti").value}</p>

        <p><strong>Vyayama Shakti:</strong>
        ${document.getElementById("vyayamaShakti").value}</p>

        <p><strong>Vaya:</strong>
        ${document.getElementById("vaya").value}</p>

    `;
    const doctorClinicalHistory =
    document.getElementById("doctorClinicalHistory");

doctorClinicalHistory.innerHTML = `

    <p><strong>Past Medical History:</strong>
    ${document.getElementById("pastMedicalHistory").value}</p>

    <p><strong>Past Surgical History:</strong>
    ${document.getElementById("pastSurgicalHistory").value}</p>

    <p><strong>Current Medications:</strong>
    ${document.getElementById("currentMedications").value}</p>

    <p><strong>Allergies:</strong>
    ${document.getElementById("allergies").value}</p>

    <p><strong>Family History:</strong>
    ${document.getElementById("familyHistory").value}</p>

    <p><strong>Personal History:</strong>
    ${document.getElementById("personalHistory").value}</p>

    <p><strong>Previous Investigations:</strong>
    ${document.getElementById("previousInvestigations").value}</p>

`;
   // Fill AI Clinical Summary
aiSummaryComplaint.textContent =
    chiefComplaint.value;

aiSummaryPatient.textContent =
    document.getElementById("doctorName").textContent +
    ", " +
    document.getElementById("doctorAge").textContent +
    " years, " +
    document.getElementById("doctorGender").textContent;

aiSummaryHistory.textContent =
    answers.length > 0
        ? answers.join(" | ")
        : "No case history provided.";

aiSummaryAyush.textContent =
    "Prakriti: " +
    document.getElementById("prakriti").value +
    ", Vikriti: " +
    document.getElementById("vikriti").value +
    ", Sara: " +
    document.getElementById("sara").value +
    ", Vaya: " +
    document.getElementById("vaya").value;

    const doctorDocumentsStatus =
        document.getElementById("doctorDocumentsStatus");

    if (uploadedDocuments.length > 0) {
        doctorDocumentsStatus.textContent =
            uploadedDocuments.length +
            " medical document(s) uploaded for review.";
    } else {
        doctorDocumentsStatus.textContent =
            "No previous medical documents were provided.";
    }
});
editCaseButton.addEventListener("click", function () {

    doctorDashboard.style.display = "none";
    summaryScreen.style.display = "block";

    document.getElementById("editPatientDetails").style.display = "block";
    document.getElementById("editClinicalHistory").style.display = "block";

    document.getElementById("editSummaryName").value =
        document.getElementById("summaryName").textContent;

    document.getElementById("editSummaryAge").value =
        document.getElementById("summaryAge").textContent;

    document.getElementById("editSummaryGender").value =
        document.getElementById("summaryGender").textContent;

    document.getElementById("editPastMedicalHistory").value =
        document.getElementById("pastMedicalHistory").value;

    document.getElementById("editPastSurgicalHistory").value =
        document.getElementById("pastSurgicalHistory").value;

    document.getElementById("editCurrentMedications").value =
        document.getElementById("currentMedications").value;

    document.getElementById("editAllergies").value =
        document.getElementById("allergies").value;

    document.getElementById("editFamilyHistory").value =
        document.getElementById("familyHistory").value;

    document.getElementById("editPersonalHistory").value =
        document.getElementById("personalHistory").value;

    document.getElementById("editPreviousInvestigations").value =
        document.getElementById("previousInvestigations").value;
    editAyushHistory.style.display = "block";

document.getElementById("editPrakriti").value =
    document.getElementById("prakriti").value;

document.getElementById("editVikriti").value =
    document.getElementById("vikriti").value;

document.getElementById("editSara").value =
    document.getElementById("sara").value;

document.getElementById("editSamhanana").value =
    document.getElementById("samhanana").value;

document.getElementById("editPramana").value =
    document.getElementById("pramana").value;

document.getElementById("editSatmya").value =
    document.getElementById("satmya").value;

document.getElementById("editSattva").value =
    document.getElementById("sattva").value;

document.getElementById("editAharaShakti").value =
    document.getElementById("aharaShakti").value;

document.getElementById("editVyayamaShakti").value =
    document.getElementById("vyayamaShakti").value;

document.getElementById("editVaya").value =
    document.getElementById("vaya").value;
});
const savePatientEditButton =
    document.getElementById("savePatientEditButton");

savePatientEditButton.addEventListener("click", function () {

    document.getElementById("summaryName").textContent =
        document.getElementById("editSummaryName").value;

    document.getElementById("summaryAge").textContent =
        document.getElementById("editSummaryAge").value;

    document.getElementById("summaryGender").textContent =
        document.getElementById("editSummaryGender").value;

    document.getElementById("editPatientDetails").style.display = "none";

});
const saveClinicalHistoryButton =
    document.getElementById("saveClinicalHistoryButton");

saveClinicalHistoryButton.addEventListener("click", function () {

    document.getElementById("pastMedicalHistory").value =
    document.getElementById("editPastMedicalHistory").value;

document.getElementById("pastSurgicalHistory").value =
    document.getElementById("editPastSurgicalHistory").value;

document.getElementById("currentMedications").value =
    document.getElementById("editCurrentMedications").value;

document.getElementById("allergies").value =
    document.getElementById("editAllergies").value;

document.getElementById("familyHistory").value =
    document.getElementById("editFamilyHistory").value;

document.getElementById("personalHistory").value =
    document.getElementById("editPersonalHistory").value;

document.getElementById("previousInvestigations").value =
    document.getElementById("editPreviousInvestigations").value;
    document.getElementById("summaryClinicalHistory").innerHTML = `
        <p><strong>Past Medical History:</strong>
        ${document.getElementById("editPastMedicalHistory").value}</p>

        <p><strong>Past Surgical History:</strong>
        ${document.getElementById("editPastSurgicalHistory").value}</p>

        <p><strong>Current Medications:</strong>
        ${document.getElementById("editCurrentMedications").value}</p>

        <p><strong>Allergies:</strong>
        ${document.getElementById("editAllergies").value}</p>

        <p><strong>Family History:</strong>
        ${document.getElementById("editFamilyHistory").value}</p>

        <p><strong>Personal History:</strong>
        ${document.getElementById("editPersonalHistory").value}</p>

        <p><strong>Previous Investigations:</strong>
        ${document.getElementById("editPreviousInvestigations").value}</p>
    `;

    document.getElementById("editClinicalHistory").style.display = "none";
});
saveAyushEditButton.addEventListener("click", function () {

    document.getElementById("prakriti").value =
        document.getElementById("editPrakriti").value;

    document.getElementById("vikriti").value =
        document.getElementById("editVikriti").value;

    document.getElementById("sara").value =
        document.getElementById("editSara").value;

    document.getElementById("samhanana").value =
        document.getElementById("editSamhanana").value;

    document.getElementById("pramana").value =
        document.getElementById("editPramana").value;

    document.getElementById("satmya").value =
        document.getElementById("editSatmya").value;

    document.getElementById("sattva").value =
        document.getElementById("editSattva").value;

    document.getElementById("aharaShakti").value =
        document.getElementById("editAharaShakti").value;

    document.getElementById("vyayamaShakti").value =
        document.getElementById("editVyayamaShakti").value;

    document.getElementById("vaya").value =
        document.getElementById("editVaya").value;

    document.getElementById("doctorAyushData").innerHTML = `
        <p><strong>Prakriti:</strong> ${editPrakriti.value}</p>
        <p><strong>Vikriti:</strong> ${editVikriti.value}</p>
        <p><strong>Sara:</strong> ${editSara.value}</p>
        <p><strong>Samhanana:</strong> ${editSamhanana.value}</p>
        <p><strong>Pramana:</strong> ${editPramana.value}</p>
        <p><strong>Satmya:</strong> ${editSatmya.value}</p>
        <p><strong>Sattva:</strong> ${editSattva.value}</p>
        <p><strong>Ahara Shakti:</strong> ${editAharaShakti.value}</p>
        <p><strong>Vyayama Shakti:</strong> ${editVyayamaShakti.value}</p>
        <p><strong>Vaya:</strong> ${editVaya.value}</p>
    `;

    editAyushHistory.style.display = "none";
// FORCE DOCTOR DASHBOARD DATA
document.getElementById("doctorQuestions").innerHTML = "";

for (let i = 0; i < questions.length; i++) {
    const item = document.createElement("li");
    item.textContent = questions[i] + " — " + answers[i];
    document.getElementById("doctorQuestions").appendChild(item);
}

document.getElementById("doctorAyushData").innerHTML = `
    <p><strong>Prakriti:</strong> ${document.getElementById("prakriti").value}</p>
    <p><strong>Vikriti:</strong> ${document.getElementById("vikriti").value}</p>
    <p><strong>Sara:</strong> ${document.getElementById("sara").value}</p>
    <p><strong>Samhanana:</strong> ${document.getElementById("samhanana").value}</p>
    <p><strong>Pramana:</strong> ${document.getElementById("pramana").value}</p>
    <p><strong>Satmya:</strong> ${document.getElementById("satmya").value}</p>
    <p><strong>Sattva:</strong> ${document.getElementById("sattva").value}</p>
    <p><strong>Ahara Shakti:</strong> ${document.getElementById("aharaShakti").value}</p>
    <p><strong>Vyayama Shakti:</strong> ${document.getElementById("vyayamaShakti").value}</p>
    <p><strong>Vaya:</strong> ${document.getElementById("vaya").value}</p>
`;

document.getElementById("doctorClinicalHistory").innerHTML = `
    <p><strong>Past Medical History:</strong> ${document.getElementById("pastMedicalHistory").value}</p>
    <p><strong>Past Surgical History:</strong> ${document.getElementById("pastSurgicalHistory").value}</p>
    <p><strong>Current Medications:</strong> ${document.getElementById("currentMedications").value}</p>
    <p><strong>Allergies:</strong> ${document.getElementById("allergies").value}</p>
    <p><strong>Family History:</strong> ${document.getElementById("familyHistory").value}</p>
    <p><strong>Personal History:</strong> ${document.getElementById("personalHistory").value}</p>
    <p><strong>Previous Investigations:</strong> ${document.getElementById("previousInvestigations").value}</p>
`;
});
const abdmConnectButton =
    document.getElementById("abdmConnectButton");

const abdmStatus =
    document.getElementById("abdmStatus");

abdmConnectButton.addEventListener("click", function () {

    abdmStatus.textContent =
        "Connecting securely to ABDM / HIS...";

    setTimeout(function () {
        abdmStatus.textContent =
            "✓ Demo connection successful. Patient case is ready for HIS / ABDM transfer.";
    }, 1500);

});
