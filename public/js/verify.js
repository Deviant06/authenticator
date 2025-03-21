// Sample certificate database (in production, this should be server-side)
const certificateDatabase = {
    certificates: {}
};

// Load certificates from localStorage if available
document.addEventListener('DOMContentLoaded', () => {
    const savedCertificates = localStorage.getItem('certificates');
    if (savedCertificates) {
        certificateDatabase.certificates = JSON.parse(savedCertificates);
    }
});

// DOM Elements
const certificateIdInput = document.getElementById('certificateId');
const verifyBtn = document.getElementById('verifyBtn');
const resultContainer = document.getElementById('result');
const certificateDetails = document.getElementById('certificateDetails');

// Verify certificate function
function verifyCertificate(certificateId) {
    const certificate = certificateDatabase.certificates[certificateId];
    
    if (!certificate) {
        showError('Certificate not found. Please check the ID and try again.');
        return;
    }

    displayCertificateDetails(certificate);
}

// Display certificate details
function displayCertificateDetails(certificate) {
    resultContainer.classList.remove('hidden');
    
    const detailsHTML = `
        <div class="certificate-detail">
            <p><strong>Recipient:</strong> ${certificate.recipientName}</p>
            <p><strong>Title:</strong> ${certificate.courseTitle}</p>
            <p><strong>Issue Date:</strong> ${new Date(certificate.issueDate).toLocaleDateString()}</p>
            <p><strong>Certificate ID:</strong> ${certificate.id}</p>
            <p class="success">✓ This certificate is valid and verified</p>
        </div>
    `;

    certificateDetails.innerHTML = detailsHTML;
}

// Show error message
function showError(message) {
    resultContainer.classList.remove('hidden');
    certificateDetails.innerHTML = `<p class="error">${message}</p>`;
}

// Event listeners
verifyBtn.addEventListener('click', () => {
    const certificateId = certificateIdInput.value.trim();
    
    if (!certificateId) {
        showError('Please enter a certificate ID');
        return;
    }

    verifyCertificate(certificateId);
});

certificateIdInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        verifyBtn.click();
    }
}); 