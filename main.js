// Kolkata FF Main JavaScript
// Auto-generates tables at 12 AM IST and displays results

// ==========================================
// TXT FILE AUTO-FETCH SYSTEM (INTEGRATED)
// ==========================================

const TXT_FILE_PREFIX = ''; // Root directory (no folder)
let AUTO_FETCH_ENABLED = true;

// Get current date in IST (Kolkata timezone)
function getISTDate() {
    const now = new Date();
    // Convert to IST (UTC+5:30)
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
}

// Format date as "DD Month YYYY"
function formatDate(date) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
}

// Get date key for storage (YYYY-MM-DD)
function getDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Initialize result storage
function initializeStorage() {
    if (!localStorage.getItem('kolkataFFResults')) {
        localStorage.setItem('kolkataFFResults', JSON.stringify({}));
    }
}

// ==========================================
// AUTO-FETCH FROM TXT FILE (ROOT DIRECTORY)
// ==========================================

async function fetchTodayFromTxtFile() {
    if (!AUTO_FETCH_ENABLED) return false;
    
    const today = getISTDate();
    const dateKey = getDateKey(today);
    const filename = `${dateKey}.txt`; // Example: 2025-10-28.txt
    
    try {
        console.log(`🔍 Looking for: ${filename}`);
        const response = await fetch(filename);
        
        if (!response.ok) {
            console.log('📄 No txt file found, using localStorage');
            return false;
        }
        
        const content = await response.text();
        console.log(`✅ Found txt file: ${filename}`);
        
        // Parse the txt file
        const results = parseTxtFile(content);
        
        // Save to localStorage
        const allResults = JSON.parse(localStorage.getItem('kolkataFFResults') || '{}');
        allResults[dateKey] = results;
        localStorage.setItem('kolkataFFResults', JSON.stringify(allResults));
        
        console.log('✅ Results loaded from txt file!');
        return true;
        
    } catch (error) {
        console.log('⚠️ Error fetching txt file:', error.message);
        return false;
    }
}

function parseTxtFile(content) {
    const lines = content.trim().split('\n');
    const rounds = [];
    
    lines.forEach(line => {
        line = line.trim();
        if (!line) return;
        
        // Parse: "1. 239, 4" or "1. 239"
        const match = line.match(/^\d+\.\s*(\d{3})(?:,\s*(\d))?/);
        if (match) {
            const digits = match[1];
            const sum = match[2] || calculateSumFromDigits(digits);
            rounds.push({ digits, sum });
        }
    });
    
    // Ensure 8 rounds
    while (rounds.length < 8) {
        rounds.push({ digits: '', sum: '' });
    }
    
    return {
        rounds: rounds,
        created: new Date().toISOString()
    };
}

function calculateSumFromDigits(digits) {
    if (!digits || digits.length !== 3) return '';
    const sum = digits.split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
    return String(sum % 10);
}

// Get results for a specific date
function getResultsForDate(dateKey) {
    const allResults = JSON.parse(localStorage.getItem('kolkataFFResults') || '{}');
    return allResults[dateKey] || {
        rounds: Array(8).fill(null).map(() => ({ digits: '', sum: '' })),
        created: new Date().toISOString()
    };
}

// Save results for a specific date
function saveResultsForDate(dateKey, results) {
    const allResults = JSON.parse(localStorage.getItem('kolkataFFResults') || '{}');
    allResults[dateKey] = results;
    localStorage.setItem('kolkataFFResults', JSON.stringify(allResults));
}

// Generate today's result table
function generateTodayTable() {
    const today = getISTDate();
    const dateKey = getDateKey(today);
    const results = getResultsForDate(dateKey);
    
    let html = '<div class="result-table-wrapper">';
    html += '<table class="result-table">';
    html += '<thead><tr>';
    html += '<th colspan="8" class="date-header-cell">' + formatDate(today) + '</th>';
    html += '</tr></thead>';
    html += '<thead><tr>';
    for (let i = 1; i <= 8; i++) {
        html += `<th>${i}</th>`;
    }
    html += '</tr></thead>';
    html += '<tbody>';
    
    // First row - digits
    html += '<tr>';
    for (let i = 0; i < 8; i++) {
        const value = results.rounds[i].digits || '–';
        html += `<td>${value}</td>`;
    }
    html += '</tr>';
    
    // Second row - sum
    html += '<tr>';
    for (let i = 0; i < 8; i++) {
        const value = results.rounds[i].sum || '–';
        html += `<td>${value}</td>`;
    }
    html += '</tr>';
    
    html += '</tbody></table></div>';
    
    document.getElementById('todayTable').innerHTML = html;
}

// Generate old results tables
function generateOldResults() {
    const today = getISTDate();
    const allResults = JSON.parse(localStorage.getItem('kolkataFFResults') || '{}');
    const dateKeys = Object.keys(allResults).sort().reverse();
    
    let html = '';
    let count = 0;
    
    for (const dateKey of dateKeys) {
        // Skip today's date
        if (dateKey === getDateKey(today)) continue;
        
        // Show only last 20 old results
        if (count >= 20) break;
        
        const dateParts = dateKey.split('-');
        const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        const results = allResults[dateKey];
        
        html += '<div class="result-table-wrapper" style="margin-bottom: 20px;">';
        html += '<table class="result-table old-result">';
        html += '<thead><tr>';
        html += '<th colspan="8" class="date-header-cell">' + formatDate(date) + '</th>';
        html += '</tr></thead>';
        html += '<thead><tr>';
        for (let i = 1; i <= 8; i++) {
            html += `<th>${i}</th>`;
        }
        html += '</tr></thead>';
        html += '<tbody>';
        
        // First row - digits
        html += '<tr>';
        for (let i = 0; i < 8; i++) {
            const value = results.rounds[i].digits || '–';
            html += `<td>${value}</td>`;
        }
        html += '</tr>';
        
        // Second row - sum
        html += '<tr>';
        for (let i = 0; i < 8; i++) {
            const value = results.rounds[i].sum || '–';
            html += `<td>${value}</td>`;
        }
        html += '</tr>';
        
        html += '</tbody></table></div>';
        count++;
    }
    
    if (html === '') {
        html = '<p style="text-align: center; padding: 20px; color: #666;">No old results available yet.</p>';
    }
    
    document.getElementById('oldResults').innerHTML = html;
}

// Check and create new day's table at midnight
function checkNewDay() {
    const today = getISTDate();
    const dateKey = getDateKey(today);
    const lastCheckedDate = localStorage.getItem('lastCheckedDate');
    
    if (lastCheckedDate !== dateKey) {
        // New day detected
        localStorage.setItem('lastCheckedDate', dateKey);
        
        // Initialize today's results if not exists
        const allResults = JSON.parse(localStorage.getItem('kolkataFFResults') || '{}');
        if (!allResults[dateKey]) {
            allResults[dateKey] = {
                rounds: Array(8).fill(null).map(() => ({ digits: '', sum: '' })),
                created: new Date().toISOString()
            };
            localStorage.setItem('kolkataFFResults', JSON.stringify(allResults));
        }
        
        // Refresh display
        generateTodayTable();
        generateOldResults();
    }
}

// Load AdSense code
function loadAdSense() {
    const adsenseCode = localStorage.getItem('adsenseCode');
    if (adsenseCode) {
        const slots = document.querySelectorAll('.adsense-slot');
        slots.forEach(slot => {
            slot.innerHTML = adsenseCode;
        });
    }
}

// Load Analytics
function loadAnalytics() {
    const analyticsId = localStorage.getItem('analyticsId');
    if (analyticsId) {
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
            if (script.innerHTML.includes('gtag')) {
                script.innerHTML = script.innerHTML.replace(/GA_MEASUREMENT_ID/g, analyticsId);
            }
        });
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', async function() {
    initializeStorage();
    checkNewDay();
    
    // Try to fetch from txt file first
    const fetched = await fetchTodayFromTxtFile();
    
    if (fetched) {
        console.log('📊 Displaying results from txt file');
    } else {
        console.log('📊 Displaying results from localStorage');
    }
    
    // Load quick add table with existing data
    quickLoadExisting();
    
    generateTodayTable();
    generateOldResults();
    loadAdSense();
    loadAnalytics();
    
    // Check for new day every minute
    setInterval(checkNewDay, 60000);
    
    // Auto-refresh from txt file every 5 minutes
    setInterval(async function() {
        await fetchTodayFromTxtFile();
        generateTodayTable();
        quickLoadExisting(); // Refresh quick add table too
    }, 5 * 60 * 1000);
});

// For testing - you can manually trigger new day
window.createNewDay = function() {
    const tomorrow = new Date(getISTDate());
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateKey = getDateKey(tomorrow);
    
    const allResults = JSON.parse(localStorage.getItem('kolkataFFResults') || '{}');
    allResults[dateKey] = {
        rounds: Array(8).fill(null).map(() => ({ digits: '', sum: '' })),
        created: new Date().toISOString()
    };
    localStorage.setItem('kolkataFFResults', JSON.stringify(allResults));
    
    alert('New day data created for: ' + formatDate(tomorrow));
    generateOldResults();
};

// ==========================================
// EDITABLE RESULT SYSTEM (DIRECT IN INDEX.HTML)
// ==========================================

let editMode = false;
let originalResults = null;

// Toggle edit mode
function toggleEditMode() {
    editMode = !editMode;
    
    if (editMode) {
        // Store original results for cancel
        const today = getISTDate();
        const dateKey = getDateKey(today);
        originalResults = JSON.parse(JSON.stringify(getResultsForDate(dateKey)));
        
        // Generate editable table
        generateEditableTable();
        
        // Show/hide buttons
        document.getElementById('editModeBtn').style.display = 'none';
        document.getElementById('saveResultsBtn').style.display = 'inline-block';
        document.getElementById('cancelEditBtn').style.display = 'inline-block';
        
        console.log('✏️ Edit mode enabled');
    } else {
        // Back to view mode
        generateTodayTable();
        
        // Show/hide buttons
        document.getElementById('editModeBtn').style.display = 'inline-block';
        document.getElementById('saveResultsBtn').style.display = 'none';
        document.getElementById('cancelEditBtn').style.display = 'none';
        
        console.log('👁️ View mode enabled');
    }
}

// Generate editable table
function generateEditableTable() {
    const today = getISTDate();
    const dateKey = getDateKey(today);
    const results = getResultsForDate(dateKey);
    
    let html = '<div class="result-table-wrapper">';
    html += '<div class="alert alert-success" style="text-align: center; margin-bottom: 20px;">';
    html += '✏️ EDIT MODE: Enter 3 digits for each round (Sum auto-calculates)';
    html += '</div>';
    html += '<table class="result-table">';
    html += '<thead><tr>';
    html += '<th colspan="8" class="date-header-cell">' + formatDate(today) + ' (EDITING)</th>';
    html += '</tr></thead>';
    html += '<thead><tr>';
    for (let i = 1; i <= 8; i++) {
        html += `<th>Round ${i}</th>`;
    }
    html += '</tr></thead>';
    html += '<tbody>';
    
    // Editable inputs for digits
    html += '<tr>';
    for (let i = 0; i < 8; i++) {
        const value = results.rounds[i].digits || '';
        html += `<td><input type="text" 
                        id="digits${i}" 
                        value="${value}" 
                        maxlength="3" 
                        placeholder="000"
                        class="result-input"
                        oninput="autoCalculateSum(${i})"
                        style="width: 80%; text-align: center; font-size: 18px; font-weight: bold;"></td>`;
    }
    html += '</tr>';
    
    // Auto-calculated sums (readonly)
    html += '<tr>';
    for (let i = 0; i < 8; i++) {
        const value = results.rounds[i].sum || '';
        html += `<td><input type="text" 
                        id="sum${i}" 
                        value="${value}" 
                        readonly
                        class="result-input sum-display"
                        style="width: 80%; text-align: center; font-size: 18px; font-weight: bold; background: #1a1a1a; color: #0f0;"></td>`;
    }
    html += '</tr>';
    
    html += '</tbody></table></div>';
    
    document.getElementById('todayTable').innerHTML = html;
}

// Auto-calculate sum when digits are entered
function autoCalculateSum(roundIndex) {
    const digitsInput = document.getElementById('digits' + roundIndex);
    const sumInput = document.getElementById('sum' + roundIndex);
    const digits = digitsInput.value;
    
    if (digits.length === 3 && /^\d{3}$/.test(digits)) {
        const sum = calculateSumFromDigits(digits);
        sumInput.value = sum;
        sumInput.style.color = '#0f0';
    } else {
        sumInput.value = '';
    }
}

// Save results
function saveResults() {
    const today = getISTDate();
    const dateKey = getDateKey(today);
    const rounds = [];
    let allValid = true;
    
    // Collect all rounds
    for (let i = 0; i < 8; i++) {
        const digits = document.getElementById('digits' + i).value;
        const sum = document.getElementById('sum' + i).value;
        
        if (digits && digits.length === 3 && /^\d{3}$/.test(digits)) {
            rounds.push({ digits, sum });
        } else if (digits) {
            alert(`⚠️ Round ${i + 1}: Please enter exactly 3 digits (0-9)`);
            allValid = false;
            break;
        } else {
            // Empty round
            rounds.push({ digits: '', sum: '' });
        }
    }
    
    if (!allValid) return;
    
    // Save to localStorage
    const resultsData = {
        rounds: rounds,
        created: new Date().toISOString(),
        lastEdited: new Date().toISOString()
    };
    
    saveResultsForDate(dateKey, resultsData);
    
    // Exit edit mode
    editMode = false;
    generateTodayTable();
    
    // Show/hide buttons
    document.getElementById('editModeBtn').style.display = 'inline-block';
    document.getElementById('saveResultsBtn').style.display = 'none';
    document.getElementById('cancelEditBtn').style.display = 'none';
    
    alert('✅ Results saved successfully!\n\nResults updated for ' + formatDate(today));
    console.log('💾 Results saved for:', dateKey);
}

// Cancel edit
function cancelEdit() {
    if (confirm('❌ Cancel editing? Changes will not be saved.')) {
        const today = getISTDate();
        const dateKey = getDateKey(today);
        
        // Restore original results if they were changed
        if (originalResults) {
            saveResultsForDate(dateKey, originalResults);
        }
        
        editMode = false;
        generateTodayTable();
        
        // Show/hide buttons
        document.getElementById('editModeBtn').style.display = 'inline-block';
        document.getElementById('saveResultsBtn').style.display = 'none';
        document.getElementById('cancelEditBtn').style.display = 'none';
        
        console.log('❌ Edit cancelled');
    }
}

// ==========================================
// QUICK ADD SYSTEM (ALWAYS VISIBLE)
// ==========================================

// Quick calculate sum for direct edit table
function quickCalcSum(index) {
    const digitsInput = document.getElementById('quick' + index);
    const sumInput = document.getElementById('quickSum' + index);
    const digits = digitsInput.value;
    
    if (digits.length === 3 && /^\d{3}$/.test(digits)) {
        const sum = calculateSumFromDigits(digits);
        sumInput.value = sum;
        sumInput.style.color = '#0f0';
        sumInput.style.fontWeight = 'bold';
    } else {
        sumInput.value = '';
    }
}

// Quick save results from direct edit table
function quickSaveResults() {
    const today = getISTDate();
    const dateKey = getDateKey(today);
    const rounds = [];
    let hasData = false;
    
    // Collect all rounds
    for (let i = 0; i < 8; i++) {
        const digitsInput = document.getElementById('quick' + i);
        const sumInput = document.getElementById('quickSum' + i);
        const digits = digitsInput.value.trim();
        const sum = sumInput.value.trim();
        
        if (digits) {
            if (digits.length === 3 && /^\d{3}$/.test(digits)) {
                rounds.push({ digits, sum });
                hasData = true;
            } else {
                alert(`⚠️ Round ${i + 1}: Please enter exactly 3 digits (0-9)\nExample: 239, 378, 990`);
                return;
            }
        } else {
            // Empty round
            rounds.push({ digits: '', sum: '' });
        }
    }
    
    if (!hasData) {
        alert('⚠️ Please enter at least one round!\n\nType 3 digits in any round (example: 239)');
        return;
    }
    
    // Save to localStorage
    const resultsData = {
        rounds: rounds,
        created: new Date().toISOString(),
        lastEdited: new Date().toISOString()
    };
    
    saveResultsForDate(dateKey, resultsData);
    
    // Refresh display
    generateTodayTable();
    generateOldResults();
    
    // Scroll to saved results
    document.getElementById('todayResultSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    alert('✅ Results saved successfully!\n\n' + formatDate(today) + '\n\nScroll down to see saved results.');
    console.log('💾 Quick save successful for:', dateKey);
}

// Quick clear all inputs
function quickClearAll() {
    if (confirm('🗑️ Clear all inputs?\n\nThis will not delete saved results, only clear the input fields.')) {
        for (let i = 0; i < 8; i++) {
            document.getElementById('quick' + i).value = '';
            document.getElementById('quickSum' + i).value = '';
        }
        console.log('🗑️ Quick add inputs cleared');
    }
}

// Load existing results into quick add table (if any)
function quickLoadExisting() {
    const today = getISTDate();
    const dateKey = getDateKey(today);
    const results = getResultsForDate(dateKey);
    
    // Update date header
    document.getElementById('quickAddDate').textContent = formatDate(today);
    
    // Load existing results into inputs
    for (let i = 0; i < 8; i++) {
        const digits = results.rounds[i].digits;
        const sum = results.rounds[i].sum;
        
        if (digits) {
            document.getElementById('quick' + i).value = digits;
            document.getElementById('quickSum' + i).value = sum;
        }
    }
    
    console.log('📥 Loaded existing results into quick add table');
}

console.log('Kolkata FF Main System Loaded');
console.log('Current IST Time:', getISTDate().toLocaleString());
console.log('✏️ Direct edit table is visible - Type results directly!');

