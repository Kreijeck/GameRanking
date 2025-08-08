/*!
 * GameRanking Show Rankings JavaScript
 * Funktionalität für die Rankings-Verwaltung
 * =========================================
 */

/**
 * Rankings Management Handler
 * Verwaltet die Benutzerinteraktionen für Rankings-Verwaltung
 */
class RankingsManager {
    constructor() {
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
        // Event-Listener für Lösch-Buttons
        this.setupDeleteButtons();
        
        // Event-Listener für Ranking-Items (Hover-Effekte)
        this.setupRankingInteractions();

        // Event-Listener für Listen-Sektionen (Collapse-Funktionalität)
        this.setupListSections();

        console.log('Rankings Manager initialized');
    }

    /**
     * Richtet die Lösch-Button-Funktionalität ein
     */
    setupDeleteButtons() {
        const deleteButtons = document.querySelectorAll('button.delete-btn');
        
        deleteButtons.forEach(button => {
            const form = button.closest('form');
            
            if (form) {
                form.addEventListener('submit', (e) => this.handleDeleteUser(e, form));
            }
        });
    }

    /**
     * Behandelt das Löschen von Benutzern
     * @param {Event} event - Submit Event
     * @param {HTMLFormElement} form - Das Formular
     */
    handleDeleteUser(event, form) {
        event.preventDefault();
        
        const userNameInput = form.querySelector('input[name="user_name_display"]');
        const userName = userNameInput ? userNameInput.value : 'diesem Benutzer';
        
        // Zeige erweiterte Bestätigungsdialog
        this.showDeleteConfirmation(userName, () => {
            // Benutzer hat bestätigt - sende das Formular
            this.showLoadingState(form);
            form.submit();
        });
    }

    /**
     * Zeigt einen erweiterten Bestätigungsdialog
     * @param {string} userName - Name des zu löschenden Benutzers
     * @param {Function} onConfirm - Callback bei Bestätigung
     */
    showDeleteConfirmation(userName, onConfirm) {
        const modal = document.createElement('div');
        modal.className = 'delete-confirmation-modal';
        modal.innerHTML = `
            <div class="modal-backdrop">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>🗑️ Benutzer löschen</h3>
                    </div>
                    <div class="modal-body">
                        <p>Sind Sie sicher, dass Sie <strong>"${userName}"</strong> löschen möchten?</p>
                        <p class="warning">Diese Aktion kann nicht rückgängig gemacht werden!</p>
                    </div>
                    <div class="modal-actions">
                        <button class="btn-cancel">Abbrechen</button>
                        <button class="btn-confirm">Löschen</button>
                    </div>
                </div>
            </div>
        `;

        // Event-Listener für Modal-Buttons
        const cancelBtn = modal.querySelector('.btn-cancel');
        const confirmBtn = modal.querySelector('.btn-confirm');
        const backdrop = modal.querySelector('.modal-backdrop');

        const closeModal = () => {
            modal.remove();
        };

        cancelBtn.addEventListener('click', closeModal);
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) closeModal();
        });

        confirmBtn.addEventListener('click', () => {
            closeModal();
            onConfirm();
        });

        // Escape-Taste zum Schließen
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

        document.body.appendChild(modal);
        
        // Fokussiere den Abbrechen-Button
        setTimeout(() => cancelBtn.focus(), 100);
    }

    /**
     * Zeigt einen Ladezustand für das Formular
     * @param {HTMLFormElement} form - Das Formular
     */
    showLoadingState(form) {
        const button = form.querySelector('.delete-btn');
        if (button) {
            button.innerHTML = '⏳ Löschen...';
            button.disabled = true;
        }
    }

    /**
     * Richtet Interaktionen für Ranking-Items ein
     */
    setupRankingInteractions() {
        const rankingItems = document.querySelectorAll('.ranking-item');
        
        rankingItems.forEach(item => {
            // Tooltip bei Hover
            item.addEventListener('mouseenter', () => {
                this.showRankingTooltip(item);
            });

            item.addEventListener('mouseleave', () => {
                this.hideRankingTooltip(item);
            });
        });
    }

    /**
     * Zeigt ein Tooltip für ein Ranking-Item
     * @param {HTMLElement} item - Das Ranking-Item
     */
    showRankingTooltip(item) {
        const gameName = item.querySelector('.game-name')?.textContent;
        const rankNumber = item.querySelector('.rank-number')?.textContent;
        
        if (gameName && rankNumber) {
            item.setAttribute('title', `${gameName}: Platz ${rankNumber}`);
        }
    }

    /**
     * Versteckt das Tooltip
     * @param {HTMLElement} item - Das Ranking-Item
     */
    hideRankingTooltip(item) {
        item.removeAttribute('title');
    }

    /**
     * Richtet die Collapse-Funktionalität für Listen-Sektionen ein
     */
    setupListSections() {
        const listHeaders = document.querySelectorAll('.list-header');
        
        listHeaders.forEach(header => {
            // Mache Header klickbar
            header.style.cursor = 'pointer';
            header.setAttribute('title', 'Klicken zum Ein-/Ausklappen');
            
            header.addEventListener('click', () => {
                this.toggleListSection(header);
            });
        });
    }

    /**
     * Klappt eine Listen-Sektion ein oder aus
     * @param {HTMLElement} header - Der Header der Liste
     */
    toggleListSection(header) {
        const section = header.closest('.list-section');
        const userEntries = section.querySelector('.user-entries');
        
        if (!userEntries) return;

        const isCollapsed = userEntries.style.display === 'none';
        
        if (isCollapsed) {
            // Ausklappen
            userEntries.style.display = 'block';
            header.innerHTML = header.innerHTML.replace('▶', '▼');
            
            if (!header.innerHTML.includes('▼')) {
                header.innerHTML += ' ▼';
            }
        } else {
            // Einklappen
            userEntries.style.display = 'none';
            header.innerHTML = header.innerHTML.replace('▼', '▶');
            
            if (!header.innerHTML.includes('▶')) {
                header.innerHTML += ' ▶';
            }
        }
    }

    /**
     * Gibt Statistiken über die Rankings zurück
     */
    getStatistics() {
        const listSections = document.querySelectorAll('.list-section');
        const userEntries = document.querySelectorAll('.user-entry');
        const rankingItems = document.querySelectorAll('.ranking-item');
        
        return {
            totalLists: listSections.length,
            totalUsers: userEntries.length,
            totalRankings: rankingItems.length,
            averageRankingsPerUser: userEntries.length > 0 ? 
                (rankingItems.length / userEntries.length).toFixed(1) : 0
        };
    }
}

// CSS-Styles für Modal und Interaktionen hinzufügen
const style = document.createElement('style');
style.textContent = `
    /* Delete Confirmation Modal */
    .delete-confirmation-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1000;
    }
    
    .modal-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease-out;
    }
    
    .modal-content {
        background: white;
        border-radius: 15px;
        padding: 0;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        animation: slideInUp 0.3s ease-out;
        overflow: hidden;
    }
    
    .modal-header {
        background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
        color: white;
        padding: 20px;
        text-align: center;
    }
    
    .modal-header h3 {
        margin: 0;
        font-size: 1.2rem;
        font-weight: 700;
    }
    
    .modal-body {
        padding: 25px;
        text-align: center;
    }
    
    .modal-body p {
        margin-bottom: 15px;
        color: #374151;
    }
    
    .modal-body .warning {
        color: #dc2626;
        font-weight: 600;
        font-size: 0.9rem;
    }
    
    .modal-actions {
        padding: 0 25px 25px 25px;
        display: flex;
        gap: 15px;
        justify-content: center;
    }
    
    .btn-cancel, .btn-confirm {
        padding: 12px 24px;
        border: none;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        flex: 1;
    }
    
    .btn-cancel {
        background: #f3f4f6;
        color: #374151;
    }
    
    .btn-cancel:hover {
        background: #e5e7eb;
        transform: translateY(-1px);
    }
    
    .btn-confirm {
        background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
        color: white;
    }
    
    .btn-confirm:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4);
    }
    
    /* Animations */
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideInUp {
        from { 
            opacity: 0; 
            transform: translateY(20px) scale(0.9); 
        }
        to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
        }
    }
    
    /* Enhanced ranking item interactions */
    .ranking-item:hover {
        transform: scale(1.05);
        z-index: 10;
    }
    
    /* Collapsible list headers */
    .list-header:hover {
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    }
`;
document.head.appendChild(style);

// Initialisiere Manager
const rankingsManager = new RankingsManager();

// Global verfügbare Funktionen für Debugging und Kompatibilität
window.gameRankingRankings = {
    getManager: () => rankingsManager,
    getStatistics: () => rankingsManager.getStatistics(),
    // Legacy-Funktion für Kompatibilität
    confirmDeleteUser: (form) => {
        const userName = form.querySelector('input[name="user_name_display"]')?.value || 'diesem Benutzer';
        return confirm(`Sind Sie sicher, dass Sie "${userName}" löschen möchten?`);
    }
};
