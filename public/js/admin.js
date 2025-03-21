// Admin credentials (in production, this should be server-side)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123' // In production, use proper authentication
};

// DOM Elements
const loginForm = document.getElementById('loginForm');
const adminPanel = document.getElementById('adminPanel');
const loginBtn = document.getElementById('loginBtn');
const generateBtn = document.getElementById('generateBtn');
const recipientNameInput = document.getElementById('recipientName');
const courseTitleInput = document.getElementById('courseTitle');
const issueDateInput = document.getElementById('issueDate');
const certificatesList = document.getElementById('certificatesList');
const generatedCertificate = document.getElementById('generatedCertificate');
const qrCodeContainer = document.getElementById('qrCodeContainer');

// Certificate database
let certificateDatabase = {
    certificates: {}
};

// Load certificates from localStorage
document.addEventListener('DOMContentLoaded', () => {
    const savedCertificates = localStorage.getItem('certificates');
    if (savedCertificates) {
        certificateDatabase.certificates = JSON.parse(savedCertificates);
        updateCertificatesList();
    }
});

// Login functionality
loginBtn.addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        loginForm.classList.add('hidden');
        adminPanel.classList.remove('hidden');
    } else {
        alert('Invalid credentials. Please try again.');
    }
});

// Generate unique certificate ID
function generateCertificateId() {
    return 'CERT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Generate QR Code
function generateQRCode(certificateId) {
    qrCodeContainer.innerHTML = '';
    // Use relative path instead of origin for Netlify compatibility
    const verificationUrl = `/index.html?id=${certificateId}`;
    
    new QRCode(qrCodeContainer, {
        text: verificationUrl,
        width: 128,
        height: 128
    });
}

// Generate certificate
generateBtn.addEventListener('click', () => {
    const recipientName = recipientNameInput.value.trim();
    const courseTitle = courseTitleInput.value.trim();
    const issueDate = issueDateInput.value;

    if (!recipientName || !courseTitle || !issueDate) {
        alert('Please fill in all fields');
        return;
    }

    const certificateId = generateCertificateId();
    const certificate = {
        id: certificateId,
        recipientName,
        courseTitle,
        issueDate,
        createdAt: new Date().toISOString()
    };

    // Save to database
    certificateDatabase.certificates[certificateId] = certificate;
    localStorage.setItem('certificates', JSON.stringify(certificateDatabase.certificates));

    // Show generated certificate
    generatedCertificate.classList.remove('hidden');
    document.getElementById('certificatePreview').innerHTML = `
        <p><strong>Certificate ID:</strong> ${certificateId}</p>
        <p><strong>Recipient:</strong> ${recipientName}</p>
        <p><strong>Title:</strong> ${courseTitle}</p>
        <p><strong>Issue Date:</strong> ${new Date(issueDate).toLocaleDateString()}</p>
    `;

    // Generate QR Code
    generateQRCode(certificateId);
    
    // Update certificates list
    updateCertificatesList();

    // Clear form
    recipientNameInput.value = '';
    courseTitleInput.value = '';
    issueDateInput.value = '';
});

// Update certificates list
function updateCertificatesList() {
    const certificates = Object.values(certificateDatabase.certificates);
    certificates.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    certificatesList.innerHTML = certificates.map(cert => `
        <div class="certificate-item">
            <p><strong>ID:</strong> ${cert.id}</p>
            <p><strong>Recipient:</strong> ${cert.recipientName}</p>
            <p><strong>Title:</strong> ${cert.courseTitle}</p>
            <p><strong>Issue Date:</strong> ${new Date(cert.issueDate).toLocaleDateString()}</p>
        </div>
    `).join('');
}

// Download QR Code
document.getElementById('downloadQR').addEventListener('click', () => {
    const qrCanvas = qrCodeContainer.querySelector('canvas');
    if (qrCanvas) {
        const link = document.createElement('a');
        link.download = 'certificate-qr.png';
        link.href = qrCanvas.toDataURL();
        link.click();
    }
});

// Check URL parameters for certificate verification
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const certificateId = urlParams.get('id');
    
    if (certificateId) {
        const certificate = certificateDatabase.certificates[certificateId];
        if (certificate) {
            window.location.href = `index.html?id=${certificateId}`;
        }
    }
}); 