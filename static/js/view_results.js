/**
 * JavaScript for Game Ranking - View Results Page
 * 
 * Chart-Erstellung und Interaktionen für die Ergebnisanzeige
 * Author: GameRanking Team
 * Version: 1.0
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeResultsChart();
});

/**
 * Initialisiert das Ergebnisse-Chart mit Chart.js
 */
function initializeResultsChart() {
    const ctx = document.getElementById('resultsChart');
    if (!ctx) {
        console.error('Canvas-Element "resultsChart" nicht gefunden');
        return;
    }

    // Chart-Kontext abrufen
    const chartContext = ctx.getContext('2d');
    
    // Daten aus dem Backend (werden vom Template eingefügt)
    if (typeof gameData === 'undefined' || typeof detailedData === 'undefined') {
        console.error('Spieldaten nicht verfügbar');
        return;
    }

    // Daten vorbereiten und sortieren
    const chartData = prepareChartData(gameData);
    
    // Chart erstellen
    createChart(chartContext, chartData);
}

/**
 * Bereitet die Chart-Daten vor und sortiert sie
 */
function prepareChartData(gameData) {
    // Umwandeln des Objekts in Array und nach Punkten sortieren (höchste zuerst)
    const sortedGameData = Object.entries(gameData).sort((a, b) => b[1] - a[1]);
    
    // Spielnamen und Punkte extrahieren
    const gameNames = sortedGameData.map(item => item[0]);
    const gameScores = sortedGameData.map(item => item[1]);
    
    // Farbpalette für die Balken
    const colors = getChartColors();
    const backgroundColors = gameScores.map((_, index) => colors[index % colors.length]);
    const borderColors = backgroundColors.map(color => color.replace('0.8', '1'));
    
    return {
        gameNames,
        gameScores,
        backgroundColors,
        borderColors
    };
}

/**
 * Gibt die Farbpalette für das Chart zurück
 */
function getChartColors() {
    return [
        'rgba(79, 70, 229, 0.8)',    // Indigo
        'rgba(16, 185, 129, 0.8)',   // Emerald
        'rgba(245, 158, 11, 0.8)',   // Amber
        'rgba(239, 68, 68, 0.8)',    // Red
        'rgba(139, 92, 246, 0.8)',   // Violet
        'rgba(6, 182, 212, 0.8)',    // Cyan
        'rgba(236, 72, 153, 0.8)',   // Pink
        'rgba(34, 197, 94, 0.8)',    // Green
        'rgba(251, 146, 60, 0.8)',   // Orange
        'rgba(168, 85, 247, 0.8)'    // Purple
    ];
}

/**
 * Erstellt das Chart mit allen Konfigurationen
 */
function createChart(ctx, chartData) {
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.gameNames,
            datasets: [{
                label: 'Punktzahl',
                data: chartData.gameScores,
                backgroundColor: chartData.backgroundColors,
                borderColor: chartData.borderColors,
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: getChartOptions()
    });
}

/**
 * Gibt die Chart-Optionen zurück
 */
function getChartOptions() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y', // Horizontale Balken
        plugins: {
            legend: {
                display: false
            },
            tooltip: getTooltipConfig()
        },
        scales: getScalesConfig()
    };
}

/**
 * Konfiguration für Tooltips
 */
function getTooltipConfig() {
    return {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: 'white',
        bodyColor: 'white',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        cornerRadius: 12,
        padding: 12,
        titleFont: {
            size: 14,
            weight: 'bold'
        },
        bodyFont: {
            size: 12
        },
        callbacks: {
            title: function(context) {
                return '🎲 ' + context[0].label;
            },
            label: function(context) {
                return generateTooltipContent(context);
            }
        }
    };
}

/**
 * Generiert den Tooltip-Inhalt mit detaillierten Benutzerinformationen
 */
function generateTooltipContent(context) {
    const gameName = context.label;
    const totalPoints = context.parsed.x;
    const gameDetails = detailedData[gameName];
    
    const lines = ['📊 Gesamtpunkte: ' + totalPoints];
    lines.push(''); // Leerzeile
    lines.push('👥 Bewertungen:');
    
    if (gameDetails && gameDetails.users) {
        // Sortiere Benutzer nach Punkten (niedrigste zuerst = beste Bewertung)
        const sortedUsers = gameDetails.users.sort((a, b) => a.points - b.points);
        
        sortedUsers.forEach(function(userEntry) {
            const emoji = getRankEmoji(userEntry.points);
            lines.push(emoji + ' ' + userEntry.user + ': Rang ' + userEntry.points);
        });
    }
    
    return lines;
}

/**
 * Gibt das entsprechende Emoji für den Rang zurück
 */
function getRankEmoji(points) {
    switch(points) {
        case 1: return '🥇';
        case 2: return '🥈';
        case 3: return '🥉';
        default: return '📍';
    }
}

/**
 * Konfiguration für Chart-Achsen
 */
function getScalesConfig() {
    return {
        x: {
            beginAtZero: true,
            grid: {
                color: 'rgba(0, 0, 0, 0.1)',
                borderDash: [5, 5]
            },
            ticks: {
                font: {
                    weight: 'bold'
                }
            }
        },
        y: {
            grid: {
                display: false
            },
            ticks: {
                font: {
                    weight: 'bold',
                    size: 12
                },
                color: '#374151'
            }
        }
    };
}
