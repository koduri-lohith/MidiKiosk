const aiProcessingScreen = document.getElementById("aiProcessingScreen");
const aiProcessingStatus = document.getElementById("aiProcessingStatus");



const doctorDashboard = document.getElementById("doctorDashboard");

const ayushContinueButton = document.getElementById("ayushContinueButton");
const ayushScreen = document.getElementById("ayushScreen");

const processingScreen = document.getElementById("processingScreen");

const answerVoiceButton = document.getElementById("answerVoiceButton");

const startButton = document.getElementById("startButton");
const continueButton = document.getElementById("continueButton");
const caseContinueButton = document.getElementById("caseContinueButton");
const answerButton = document.getElementById("answerButton");
const documentContinueButton = document.getElementById("documentContinueButton");
const voiceButton = document.getElementById("voiceButton");

const welcomeScreen = document.getElementById("welcomeScreen");
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

let questions = [
    "How long have you been experiencing this problem?",
    "How severe is the problem?",
    "Have you experienced any other symptoms?",
    "Have you taken any medication for it?"
];


startButton.addEventListener("click", function () {

    welcomeScreen.style.display = "none";
    patientForm.style.display = "block";

});


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


caseContinueButton.addEventListener("click", function () {

    const complaint = chiefComplaint.value;

    if (complaint === "") {
        alert("Please describe your main problem.");
        return;
    }

    const complaintLower = complaint.toLowerCase();

    if (complaintLower.includes("headache")) {

        questions = [
            "How long have you been experiencing the headache?",
            "Where exactly do you feel the headache?",
            "How severe is the headache?",
            "Have you experienced nausea, vomiting, or dizziness?"
        ];

    } else if (complaintLower.includes("cough")) {

        questions = [
            "How long have you had the cough?",
            "Is the cough dry or with mucus?",
            "Do you have fever or difficulty breathing?",
            "Have you taken any medication for the cough?"
        ];

    } else if (complaintLower.includes("fever")) {
    questions = [
        "How long have you had the fever?",
        "What was the highest temperature you measured?",
        "Do you have chills, body pain, or weakness?",
        "Have you taken any medication for the fever?"
    ];
} else if (complaintLower.includes("stomach pain")) {
    questions = [
        "How long have you had the stomach pain?",
        "Where exactly is the pain located?",
        "How severe is the pain?",
        "Have you experienced vomiting, diarrhea, or loss of appetite?"
    ];
} else {

        questions = [
            "How long have you been experiencing this problem?",
            "How severe is the problem?",
            "Have you experienced any other symptoms?",
            "Have you taken any medication for it?"
        ];

    }

    currentQuestion = 0;
    answers = [];

    caseTakingScreen.style.display = "none";
aiProcessingScreen.style.display = "block";

aiProcessingStatus.textContent = "Understanding the patient's complaint...";

setTimeout(function () {
    aiProcessingStatus.textContent = "Selecting relevant questions...";
}, 1000);

setTimeout(function () {
    aiProcessingScreen.style.display = "none";
    questionScreen.style.display = "block";

    aiQuestion.textContent = questions[currentQuestion];
}, 2000);

});


answerButton.addEventListener("click", function () {

    const answer = answerInput.value;

    if (answer === "") {
        alert("Please provide an answer.");
        return;
    }

    answers.push(answer);

    currentQuestion++;

    answerInput.value = "";

    if (currentQuestion < questions.length) {

        aiQuestion.textContent = questions[currentQuestion];

    } else {

    questionScreen.style.display = "none";
    ayushScreen.style.display = "block";

}

});


documentContinueButton.addEventListener("click", function () {

    const files = document.getElementById("medicalDocuments").files;

    if (files.length === 0) {
        alert("Please upload at least one document.");
        return;
    }

    let detectedFlags = [];

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
    summaryScreen.style.display = "block";

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

        item.textContent = questions[i] + " — " + answers[i];

        summaryQuestions.appendChild(item);

    }

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


voiceButton.addEventListener("click", function () {

    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Voice input is not supported in this browser.");
        return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.start();

    voiceButton.textContent = "🎤 Listening...";

    recognition.onresult = function (event) {

        const speechText = event.results[0][0].transcript;

        chiefComplaint.value = speechText;

        voiceButton.textContent = "🎤 Speak";

    };

    recognition.onerror = function () {

        voiceButton.textContent = "🎤 Speak";

        alert("Could not understand the voice. Please try again.");

    };

});
answerVoiceButton.addEventListener("click", function () {

    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Voice input is not supported in this browser.");
        return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.start();

    answerVoiceButton.textContent = "🎤 Listening...";

    recognition.onresult = function (event) {

        const speechText = event.results[0][0].transcript;

        answerInput.value = speechText;

        answerVoiceButton.textContent = "🎤 Speak Answer";

    };

    recognition.onerror = function () {

        answerVoiceButton.textContent = "🎤 Speak Answer";

        alert("Could not understand the voice. Please try again.");

    };

});
const medicalDocuments = document.getElementById("medicalDocuments");
const fileList = document.getElementById("fileList");

medicalDocuments.addEventListener("change", function () {

    fileList.innerHTML = "";

    for (let file of medicalDocuments.files) {

        const item = document.createElement("p");

        item.textContent = "📄 " + file.name;

        fileList.appendChild(item);

    }

});
ayushContinueButton.addEventListener("click", function () {

    ayushScreen.style.display = "none";
    documentScreen.style.display = "block";

});
finishButton.addEventListener("click", function () {

    doctorDashboard.style.display = "block";
    summaryScreen.style.display = "none";

    document.getElementById("doctorName").textContent =
        document.getElementById("patientName").value;

    document.getElementById("doctorAge").textContent =
        document.getElementById("patientAge").value;

    document.getElementById("doctorGender").textContent =
        document.getElementById("patientGender").value;

    document.getElementById("doctorComplaint").textContent =
        chiefComplaint.value;

    const doctorQuestions =
        document.getElementById("doctorQuestions");

    doctorQuestions.innerHTML = "";

    for (let i = 0; i < questions.length; i++) {

        const item = document.createElement("li");

        item.textContent =
            questions[i] + " — " + answers[i];

        doctorQuestions.appendChild(item);

    }
    const doctorAyushData =
    document.getElementById("doctorAyushData");

doctorAyushData.innerHTML = `
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

});