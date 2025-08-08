/**
 * JavaScript für die Spieleliste-Löschseite
 * Handles confirmation dialogs und form validation
 */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const passwordField = document.getElementById('password');
    const listSelect = document.getElementById('list_name');
    
    if (form) {
        form.addEventListener('submit', function(event) {
            // Prüfe ob alle Felder ausgefüllt sind
            if (!passwordField || !passwordField.value.trim()) {
                alert('⚠️ Bitte geben Sie das Admin-Passwort ein!');
                if (passwordField) passwordField.focus();
                event.preventDefault();
                return false;
            }
            
            if (!listSelect || !listSelect.value) {
                alert('⚠️ Bitte wählen Sie eine Liste zum Löschen aus!');
                if (listSelect) listSelect.focus();
                event.preventDefault();
                return false;
            }
            
            // Bestätigungsdialog
            const listName = listSelect.options[listSelect.selectedIndex].text;
            const confirmMessage = `⚠️ ACHTUNG!\n\n` +
                                 `Sie sind dabei, die Liste "${listName}" zu löschen.\n\n` +
                                 `Diese Aktion kann NICHT rückgängig gemacht werden!\n` +
                                 `Alle zugehörigen Rankings werden ebenfalls gelöscht.\n\n` +
                                 `Sind Sie sich sicher?`;
            
            if (!confirm(confirmMessage)) {
                event.preventDefault();
                return false;
            }
            
            // Zusätzliche Bestätigung für besonders kritische Aktion
            const doubleConfirm = confirm('🔴 LETZTE WARNUNG!\n\nSind Sie wirklich sicher, dass Sie diese Liste endgültig löschen möchten?');
            if (!doubleConfirm) {
                event.preventDefault();
                return false;
            }
            
            // Form abschicken
            return true;
        });
    }
    
    // Visual feedback für Passwort-Feld
    if (passwordField) {
        passwordField.addEventListener('input', function() {
            if (this.value.length > 0) {
                this.style.borderColor = '#10b981';
                this.style.backgroundColor = '#f0fdf4';
            } else {
                this.style.borderColor = '#dc2626';
                this.style.backgroundColor = '#fef2f2';
            }
        });
    }
    
    // Visual feedback für Listen-Auswahl
    if (listSelect) {
        listSelect.addEventListener('change', function() {
            if (this.value) {
                this.style.borderColor = '#10b981';
                this.style.backgroundColor = '#f0fdf4';
            } else {
                this.style.borderColor = '#ccc';
                this.style.backgroundColor = '#fff';
            }
        });
    }
});

/**
 * Zeigt eine Warnung an, wenn der Benutzer die Seite verlassen will
 */
window.addEventListener('beforeunload', function(event) {
    const form = document.querySelector('form');
    const passwordField = document.getElementById('password');
    const listSelect = document.getElementById('list_name');
    
    // Warnung nur anzeigen, wenn Daten eingegeben wurden
    if (form && ((passwordField && passwordField.value.trim()) || (listSelect && listSelect.value))) {
        const message = 'Sie haben Daten eingegeben. Sind Sie sicher, dass Sie die Seite verlassen möchten?';
        event.returnValue = message;
        return message;
    }
});
