// ==========================================
// DATE-BASED RESULT FILES FETCHER
// Simple text file system for S3/Cloudflare
// ==========================================

(function() {
    'use strict';
    
    const RESULTS_FOLDER = 'results/'; // S3 bucket folder path
    
    // ==========================================
    // DATE UTILITIES
    // ==========================================
    
    function getISTDate() {
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000;
        return new Date(now.getTime() + istOffset);
    }
    
    function formatDateForFile(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}.txt`;
    }
    
    function formatDateDisplay(date) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    }
    
    // ==========================================
    // PARSE TEXT FILE
    // ==========================================
    
    function parseResultFile(content) {
        const lines = content.trim().split('\n');
        const results = {
            rounds: [],
            date: new Date().toISOString()
        };
        
        lines.forEach(line => {
            line = line.trim();
            if (!line) return;
            
            // Parse format: "1. 239, 4" or "1. 239 4" or "1. 2,3,9"
            const match = line.match(/^\d+\.\s*(.+)/);
            if (match) {
                const data = match[1].replace(/\s+/g, '').split(',');
                
                if (data.length >= 2) {
                    // Format: digits, sum
                    results.rounds.push({
                        digits: data[0],
                        sum: data[1]
                    });
                } else if (data[0].length === 3) {
                    // Format: just digits (auto-calculate sum)
                    const digits = data[0];
                    const sum = calculateSum(digits);
                    results.rounds.push({ digits, sum });
                }
            }
        });
        
        // Ensure 8 rounds
        while (results.rounds.length < 8) {
            results.rounds.push({ digits: '', sum: '' });
        }
        
        return results;
    }
    
    function calculateSum(digits) {
        if (!digits || digits.length !== 3) return '';
        const sum = digits.split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
        return String(sum % 10);
    }
    
    // ==========================================
    // FETCH TODAY'S RESULT FILE
    // ==========================================
    
    async function fetchTodayResults() {
        const today = getISTDate();
        const filename = formatDateForFile(today);
        const url = RESULTS_FOLDER + filename;
        
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                console.log('No result file found for today:', filename);
                return null;
            }
            
            const content = await response.text();
            const results = parseResultFile(content);
            
            // Save to localStorage with date key
            const dateKey = filename.replace('.txt', '');
            const allResults = JSON.parse(localStorage.getItem('kolkataFFResults') || '{}');
            allResults[dateKey] = results;
            localStorage.setItem('kolkataFFResults', JSON.stringify(allResults));
            
            console.log('✅ Today results loaded:', filename);
            return results;
            
        } catch (error) {
            console.error('Error fetching results:', error);
            return null;
        }
    }
    
    // ==========================================
    // FETCH OLD RESULTS (Last 30 days)
    // ==========================================
    
    async function fetchOldResults(days = 30) {
        const allResults = {};
        const today = getISTDate();
        
        for (let i = 1; i <= days; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            const filename = formatDateForFile(date);
            const url = RESULTS_FOLDER + filename;
            
            try {
                const response = await fetch(url);
                if (response.ok) {
                    const content = await response.text();
                    const results = parseResultFile(content);
                    const dateKey = filename.replace('.txt', '');
                    allResults[dateKey] = results;
                }
            } catch (error) {
                // Skip missing files
            }
        }
        
        // Merge with localStorage
        const stored = JSON.parse(localStorage.getItem('kolkataFFResults') || '{}');
        const merged = { ...stored, ...allResults };
        localStorage.setItem('kolkataFFResults', JSON.stringify(merged));
        
        console.log(`✅ Loaded ${Object.keys(allResults).length} old results`);
        return allResults;
    }
    
    // ==========================================
    // DISPLAY FUNCTIONS
    // ==========================================
    
    function displayTodayResults() {
        const today = getISTDate();
        const dateKey = formatDateForFile(today).replace('.txt', '');
        const allResults = JSON.parse(localStorage.getItem('kolkataFFResults') || '{}');
        const todayResults = allResults[dateKey];
        
        if (!todayResults) {
            console.log('No results for today');
            return;
        }
        
        // Display on page
        let html = '<div class="result-table-wrapper">';
        html += '<table class="result-table">';
        html += '<thead><tr>';
        html += '<th colspan="8" class="date-header-cell">' + formatDateDisplay(today) + '</th>';
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
            const value = todayResults.rounds[i]?.digits || '–';
            html += `<td>${value}</td>`;
        }
        html += '</tr>';
        
        // Second row - sum
        html += '<tr>';
        for (let i = 0; i < 8; i++) {
            const value = todayResults.rounds[i]?.sum || '–';
            html += `<td>${value}</td>`;
        }
        html += '</tr>';
        
        html += '</tbody></table></div>';
        
        const container = document.getElementById('todayTable');
        if (container) {
            container.innerHTML = html;
        }
    }
    
    function displayOldResults() {
        const allResults = JSON.parse(localStorage.getItem('kolkataFFResults') || '{}');
        const today = formatDateForFile(getISTDate()).replace('.txt', '');
        
        // Get all dates except today, sorted newest first
        const dates = Object.keys(allResults)
            .filter(date => date !== today)
            .sort()
            .reverse()
            .slice(0, 20); // Show last 20 results
        
        let html = '';
        
        dates.forEach(dateKey => {
            const results = allResults[dateKey];
            const [year, month, day] = dateKey.split('-');
            const date = new Date(year, month - 1, day);
            
            html += '<div class="result-table-wrapper" style="margin-bottom: 20px;">';
            html += '<table class="result-table old-result">';
            html += '<thead><tr>';
            html += '<th colspan="8" class="date-header-cell">' + formatDateDisplay(date) + '</th>';
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
                const value = results.rounds[i]?.digits || '–';
                html += `<td>${value}</td>`;
            }
            html += '</tr>';
            
            // Second row - sum
            html += '<tr>';
            for (let i = 0; i < 8; i++) {
                const value = results.rounds[i]?.sum || '–';
                html += `<td>${value}</td>`;
            }
            html += '</tr>';
            
            html += '</tbody></table></div>';
        });
        
        if (html === '') {
            html = '<p style="text-align: center; padding: 20px; color: #ffd700;">No old results available yet.</p>';
        }
        
        const container = document.getElementById('oldResults');
        if (container) {
            container.innerHTML = html;
        }
    }
    
    // ==========================================
    // AUTO-UPDATE SYSTEM
    // ==========================================
    
    async function autoUpdate() {
        console.log('🔄 Fetching latest results...');
        
        // Fetch today's results
        await fetchTodayResults();
        
        // Display
        displayTodayResults();
        displayOldResults();
    }
    
    // ==========================================
    // INITIALIZE
    // ==========================================
    
    document.addEventListener('DOMContentLoaded', async function() {
        console.log('📊 Results Fetcher System Loaded');
        
        // Initial load
        await autoUpdate();
        
        // Fetch old results (background)
        fetchOldResults(30);
        
        // Auto-refresh every 5 minutes
        setInterval(autoUpdate, 5 * 60 * 1000);
        
        console.log('✅ Auto-update enabled (5 min interval)');
    });
    
    // Expose for manual refresh
    window.refreshResults = autoUpdate;
    
})();

