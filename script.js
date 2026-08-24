document.addEventListener('DOMContentLoaded', () => {

  const countdownContainer = document.getElementById('countdown');
  const targetDateStr = countdownContainer ? countdownContainer.getAttribute('data-date') : '2026-09-08T17:00:00';
  const targetDate = new Date(targetDateStr).getTime();

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      if (countdownContainer) {
        countdownContainer.innerHTML = "<div style='grid-column: span 4; font-weight: 700; color: #e11d48;'>ŽURKA JE POČELA! 🎉</div>";
      }
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

 const rsvpForm = document.querySelector('.rsvp-form');

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = rsvpForm.querySelector('.submit-btn');
      const originalBtnText = submitBtn.innerHTML;

      const nameInput = rsvpForm.querySelector('input[name="Ime i Prezime"]');
      const noteInput = rsvpForm.querySelector('input[name="Napomena"]');

      const attendanceRadio = rsvpForm.querySelector('input[name="Dolazak"]:checked');

      if (!attendanceRadio) {
        alert("Molimo izaberite da li dolazite klikom na jednu od kartica.");
        return;
      }

      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
      submitBtn.innerHTML = '<span>Šaljem...</span>';

      const payload = {
        data: [
          {
            'Ime': nameInput.value.trim(),
            'Dolazak': attendanceRadio.value, 
            'Napomena': noteInput.value.trim() || 'Nema napomene',
            'DatumPrijave': new Date().toLocaleString('sr-RS')
          }
        ]
      };

      try {
        const response = await fetch('https://sheetdb.io/api/v1/4tfd0azb14lsk', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          rsvpForm.innerHTML = `
            <div style="padding: 20px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; text-align: center;">
              <h3 style="color: #166534; margin-bottom: 6px;text-align: center; font-size: 1.1rem;">Hvala na odgovoru! 🙌</h3>
              <p style="color: #15803d; font-size: 0.85rem;">Tvoj odgovor je uspešno zabeležen.</p>
            </div>
          `;
        } else {
          throw new Error('Greška prilikom slanja na server.');
        }
      } catch (error) {
        alert('Došlo je do greške prilikom slanja. Molimo te pokušaj ponovo.');
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.innerHTML = originalBtnText;
      }
    });
  } 

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => {
      const activeElement = document.activeElement;
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'SELECT')) {
        setTimeout(() => {
          activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    });
  }
document.querySelectorAll('input, select, textarea').forEach(element => {
  element.addEventListener('focus', function() {
    setTimeout(() => {
      this.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  });
});
});
