/*!
 * GameRanking List Details JavaScript
 * Funktionalität für das Bewertungsformular
 * =====================================
 */

/**
 * List Details Form Handler
 * Verwaltet die Dropdown-Menüs und Formularvalidierung
 */
class ListDetailsHandler {
    constructor() {
        this.selects = null;
        this.form = null;
        this.init();
    }

    /**
     * Initialisiert die Event-Listener und UI-Elemente
     */
    init() {
        // Warten auf DOM-Ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }
    }

    /**
     * Richtet alle Event-Listener ein
     */
    setupEventListeners() {
        this.selects = document.querySelectorAll('select');
        this.form = document.querySelector('form');

        // Event-Listener für Dropdown-Änderungen
        this.selects.forEach(select => {
            select.addEventListener('change', () => this.updateDropdowns());
        });

        // Event-Listener für Formular-Submit
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.validateForm(e));
        }

        // Initiale Aktualisierung der Dropdowns
        this.updateDropdowns();

        console.log('List Details Handler initialized with', this.selects.length, 'dropdowns');
    }

    /**
     * Aktualisiert alle Dropdown-Menüs und deaktiviert bereits ausgewählte Werte
     */
    updateDropdowns() {
        // Sammle alle aktuell ausgewählten Werte
        const allSelectedValues = Array.from(this.selects)
            .map(select => select.value)
            .filter(value => value !== ''); // Leere Werte ausschließen

        // Aktualisiere jedes Dropdown
        this.selects.forEach(select => {
            const currentValue = select.value;
            
            select.querySelectorAll('option').forEach(option => {
                // Option ist deaktiviert wenn:
                // 1. Sie bereits in einem anderen Dropdown ausgewählt ist
                // 2. Sie nicht der aktuell ausgewählte Wert in diesem Dropdown ist
                if (option.value !== currentValue && 
                    option.value !== '' && 
                    allSelectedValues.includes(option.value)) {
                    option.disabled = true;
                } else {
                    option.disabled = false;
                }
            });
        });

        // Visual Feedback für ausgefüllte Dropdowns
        this.updateVisualFeedback();
    }

    /**
     * Bietet visuelles Feedback für ausgefüllte und leere Dropdowns
     */
    updateVisualFeedback() {
        this.selects.forEach(select => {
            if (select.value !== '') {
                select.style.borderColor = '#10b981';
                select.style.backgroundColor = '#f0fdf4';
            } else {
                select.style.borderColor = '#e5e7eb';
                select.style.backgroundColor = 'white';
            }
        });
    }

    /**
     * Validiert das Formular vor dem Absenden
     * @param {Event} event - Submit Event
     * @returns {boolean} - True wenn gültig, false sonst
     */
    validateForm(event) {
        // Prüfe ob Name eingegeben wurde
        const nameInput = document.querySelector('input[name="name"]');
        if (!nameInput || nameInput.value.trim() === '') {
            event.preventDefault();
            this.showValidationError('Bitte geben Sie Ihren Namen ein.');
            nameInput.focus();
            return false;
        }

        // Prüfe ob alle Dropdowns ausgefüllt sind
        const emptySelects = Array.from(this.selects).filter(select => select.value === '');
        
        if (emptySelects.length > 0) {
            event.preventDefault();
            this.showValidationError(
                `Bitte füllen Sie alle Felder aus. ${emptySelects.length} Spiel(e) noch nicht bewertet.`
            );
            
            // Fokussiere das erste leere Dropdown
            emptySelects[0].focus();
            return false;
        }

        // Prüfe auf doppelte Bewertungen
        const values = Array.from(this.selects).map(select => select.value);
        const uniqueValues = [...new Set(values)];
        
        if (values.length !== uniqueValues.length) {
            event.preventDefault();
            this.showValidationError('Jeder Rang darf nur einmal vergeben werden.');
            return false;
        }

        // Erfolgreiche Validierung
        this.showSuccessMessage('Formular wird gesendet...');
        return true;
    }

    /**
     * Zeigt eine Fehlermeldung an
     * @param {string} message - Fehlermeldung
     */
    showValidationError(message) {
        // Entferne bestehende Nachrichten
        this.clearMessages();

        const errorDiv = document.createElement('div');
        errorDiv.className = 'message error';
        errorDiv.innerHTML = `⚠️ ${message}`;
        errorDiv.style.animation = 'fadeInShake 0.5s ease-out';

        // Füge die Nachricht am Anfang des Formulars ein
        const formContainer = document.querySelector('.form-container');
        formContainer.insertBefore(errorDiv, formContainer.firstChild);

        // Automatisch nach 5 Sekunden entfernen
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    /**
     * Zeigt eine Erfolgsmeldung an
     * @param {string} message - Erfolgsmeldung
     */
    showSuccessMessage(message) {
        this.clearMessages();

        const successDiv = document.createElement('div');
        successDiv.className = 'message success';
        successDiv.innerHTML = `✅ ${message}`;
        successDiv.style.animation = 'fadeIn 0.3s ease-out';

        const formContainer = document.querySelector('.form-container');
        formContainer.insertBefore(successDiv, formContainer.firstChild);
    }

    /**
     * Entfernt alle Nachrichten
     */
    clearMessages() {
        const messages = document.querySelectorAll('.message');
        messages.forEach(msg => msg.remove());
    }

    /**
     * Gibt Debugging-Informationen aus
     */
    getDebugInfo() {
        const selectedValues = Array.from(this.selects).map(select => ({
            name: select.name,
            value: select.value,
            game: select.name.replace('rank-', '')
        }));

        return {
            totalGames: this.selects.length,
            selectedCount: selectedValues.filter(item => item.value !== '').length,
            selections: selectedValues
        };
    }
}

// CSS-Animationen hinzufügen
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeInShake {
        0% { opacity: 0; transform: translateY(-10px) translateX(0); }
        25% { opacity: 0.5; transform: translateY(-5px) translateX(-5px); }
        50% { opacity: 0.75; transform: translateY(-2px) translateX(5px); }
        75% { opacity: 0.9; transform: translateY(-1px) translateX(-2px); }
        100% { opacity: 1; transform: translateY(0) translateX(0); }
    }
`;
document.head.appendChild(style);

// Initialisiere Handler
const listDetailsHandler = new ListDetailsHandler();

// Global verfügbare Funktionen für Debugging
window.gameRankingDebug = {
    getHandler: () => listDetailsHandler,
    getDebugInfo: () => listDetailsHandler.getDebugInfo(),
    clearMessages: () => listDetailsHandler.clearMessages()
};
