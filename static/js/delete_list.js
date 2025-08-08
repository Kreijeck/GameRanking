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
            const confirmMessage = `🔴 ACHTUNG - Liste löschen!\n\n` +
                                 `Sie möchten die Liste "${listName}" permanent löschen.\n\n` +
                                 `⚠️  Diese Aktion kann NICHT rückgängig gemacht werden!\n` +
                                 `⚠️  Alle zugehörigen Rankings werden ebenfalls gelöscht!\n\n` +
                                 `Sind Sie sich sicher, dass Sie fortfahren möchten?`;
            
            if (!confirm(confirmMessage)) {
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
