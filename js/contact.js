/**
 * contact.js — Contact Form & Toast Notifications
 * Powered by Web3Forms (https://api.web3forms.com/submit) for direct, serverless
 * email delivery without opening any external mail app.
 */

// ============================================================================
// CONFIGURATION: Web3Forms Access Key
// Replace this key anytime with your Web3Forms access key from web3forms.com
// ============================================================================
export const WEB3FORMS_ACCESS_KEY = 'c3d4c5b9-85fc-481c-852f-45e9617a4498';
export const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

// Client-side anti-spam submission cooldown (in seconds)
const SUBMISSION_COOLDOWN_SECONDS = 30;

/**
 * Initializes the contact form submission handler and copy email button
 */
export function initContact() {
  const form = document.getElementById('contact-form');
  const copyBtn = document.getElementById('copy-email-btn');

  // --------------------------------------------------------------------------
  // 1. "Copy Email" Button in Contact Details
  // --------------------------------------------------------------------------
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const email = 'rawatkapish942@gmail.com';
      let copied = false;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          try {
            await navigator.clipboard.writeText(email);
            copied = true;
          } catch (e) {
            // Fallback below
          }
        }
        if (!copied) {
          const tempInput = document.createElement('textarea');
          tempInput.value = email;
          tempInput.style.position = 'fixed';
          tempInput.style.opacity = '0';
          document.body.appendChild(tempInput);
          tempInput.focus();
          tempInput.select();
          document.execCommand('copy');
          tempInput.remove();
        }
        showToast('Email address copied to clipboard!', 'success');
        const copyText = copyBtn.querySelector('.copy-text');
        if (copyText) {
          const orig = copyText.textContent;
          copyText.textContent = 'Copied!';
          copyBtn.classList.add('copied');
          setTimeout(() => {
            copyText.textContent = orig;
            copyBtn.classList.remove('copied');
          }, 2000);
        }
      } catch (err) {
        showToast('rawatkapish942@gmail.com', 'success');
      }
    });
  }

  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const submitBtn = document.getElementById('contact-submit-btn');
  const btnText = submitBtn?.querySelector('.btn__text');
  const btnIcon = submitBtn?.querySelector('.btn__icon');
  const botcheckInput = form.querySelector('input[name="botcheck"]');
  const statusAnnouncer = document.getElementById('form-status');

  // Input validation listeners on blur
  nameInput?.addEventListener('blur', () => validateName(nameInput));
  emailInput?.addEventListener('blur', () => validateEmail(emailInput));
  messageInput?.addEventListener('blur', () => validateMessage(messageInput));

  // Clear errors on typing
  nameInput?.addEventListener('input', () => clearError(nameInput, 'name-error'));
  emailInput?.addEventListener('input', () => clearError(emailInput, 'email-error'));
  messageInput?.addEventListener('input', () => clearError(messageInput, 'message-error'));

  // --------------------------------------------------------------------------
  // 2. Direct Web3Forms Form Submission
  // --------------------------------------------------------------------------
  form.addEventListener('submit', async (e) => {
    // Intercept default action (never open mailto: or navigate)
    e.preventDefault();

    // Spam Protection: Honeypot check
    if (botcheckInput && botcheckInput.checked) {
      console.warn('Bot detected by honeypot; discarding submission.');
      return;
    }

    // Client-side Cooldown check (30 seconds between submissions)
    const lastSubmitTimestamp = sessionStorage.getItem('last_contact_submit_time');
    const now = Date.now();
    if (lastSubmitTimestamp) {
      const secondsElapsed = Math.floor((now - parseInt(lastSubmitTimestamp, 10)) / 1000);
      if (secondsElapsed < SUBMISSION_COOLDOWN_SECONDS) {
        const remaining = SUBMISSION_COOLDOWN_SECONDS - secondsElapsed;
        const cooldownMsg = `Please wait ${remaining}s before sending another message.`;
        showToast(cooldownMsg, 'error');
        announceStatus(statusAnnouncer, cooldownMsg);
        return;
      }
    }

    // Field validations
    const isNameValid = validateName(nameInput);
    const isEmailValid = validateEmail(emailInput);
    const isMessageValid = validateMessage(messageInput);

    if (!isNameValid || !isEmailValid || !isMessageValid) {
      const errMsg = 'Please correct the highlighted fields before sending.';
      showToast(errMsg, 'error');
      announceStatus(statusAnnouncer, errMsg);
      return;
    }

    const senderName = nameInput.value.trim();
    const senderEmail = emailInput.value.trim();
    const senderMessage = messageInput.value.trim();

    // Prepare Web3Forms payload
    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      name: senderName,
      email: senderEmail,
      message: senderMessage,
      subject: `New message from your portfolio: ${senderName}`,
      from_name: 'Kapish Rawat Portfolio'
    };

    // Set Loading State on Button
    setButtonState(submitBtn, btnText, btnIcon, 'loading');

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success !== false) {
        // Record timestamp for cooldown
        sessionStorage.setItem('last_contact_submit_time', String(Date.now()));

        // Show Success Feedback
        const successMsg = "Thanks! Your message has been sent. I'll reply soon.";
        showToast(successMsg, 'success');
        announceStatus(statusAnnouncer, successMsg);

        // Reset form inputs
        form.reset();

        // Play Success Animation on Button
        setButtonState(submitBtn, btnText, btnIcon, 'success');
      } else {
        throw new Error(data.message || `Server returned error status ${response.status}`);
      }
    } catch (err) {
      console.warn('Web3Forms submission failed:', err.message || err);

      // On failure: Show error toast & retain user text in inputs
      const failureMsg =
        'Could not send your message. Please try again or email me at rawatkapish942@gmail.com.';
      showToast(failureMsg, 'error');
      announceStatus(statusAnnouncer, failureMsg);

      // Restore button to idle state
      setButtonState(submitBtn, btnText, btnIcon, 'idle');
    }
  });
}

/**
 * Updates submit button loading, success, and idle states with smooth animations
 */
function setButtonState(btn, textEl, iconEl, state) {
  if (!btn) return;

  if (state === 'loading') {
    btn.disabled = true;
    btn.classList.add('loading');
    btn.classList.remove('success');
    if (textEl) textEl.textContent = 'Sending...';
  } else if (state === 'success') {
    btn.disabled = true;
    btn.classList.remove('loading');
    btn.classList.add('success');
    if (textEl) textEl.textContent = 'Sent Successfully!';
    if (iconEl) {
      iconEl.className = 'fa-solid fa-check btn__icon btn__icon--success';
    }

    // Restore to normal idle after 3.2 seconds
    setTimeout(() => {
      setButtonState(btn, textEl, iconEl, 'idle');
    }, 3200);
  } else {
    // Idle state
    btn.disabled = false;
    btn.classList.remove('loading', 'success');
    if (textEl) textEl.textContent = 'Send Message';
    if (iconEl) {
      iconEl.className = 'fa-solid fa-paper-plane btn__icon';
    }
  }
}

/**
 * Screen Reader Live Region Announcer
 */
function announceStatus(el, message) {
  if (el) {
    el.textContent = message;
  }
}

/**
 * Validate Name field (at least 2 characters)
 */
function validateName(input) {
  if (!input) return false;
  const value = input.value.trim();
  const errorEl = document.getElementById('name-error');

  if (!value) {
    showError(input, errorEl, 'Please enter your name.');
    return false;
  }
  if (value.length < 2) {
    showError(input, errorEl, 'Name must be at least 2 characters.');
    return false;
  }
  clearError(input, 'name-error');
  return true;
}

/**
 * Validate Email field
 */
function validateEmail(input) {
  if (!input) return false;
  const value = input.value.trim();
  const errorEl = document.getElementById('email-error');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!value) {
    showError(input, errorEl, 'Please enter your email address.');
    return false;
  }
  if (!emailRegex.test(value)) {
    showError(input, errorEl, 'Please enter a valid email address (e.g. name@example.com).');
    return false;
  }
  clearError(input, 'email-error');
  return true;
}

/**
 * Validate Message field (at least 10 characters)
 */
function validateMessage(input) {
  if (!input) return false;
  const value = input.value.trim();
  const errorEl = document.getElementById('message-error');

  if (!value) {
    showError(input, errorEl, 'Please enter a message.');
    return false;
  }
  if (value.length < 10) {
    showError(input, errorEl, 'Message must be at least 10 characters.');
    return false;
  }
  clearError(input, 'message-error');
  return true;
}

function showError(input, errorEl, message) {
  input.closest('.input-wrapper')?.classList.add('error');
  if (errorEl) errorEl.textContent = message;
}

function clearError(input, errorId) {
  input.closest('.input-wrapper')?.classList.remove('error');
  const errorEl = document.getElementById(errorId);
  if (errorEl) errorEl.textContent = '';
}

/**
 * Toast Notification Helper
 * @param {string} message - Message to display
 * @param {'success' | 'error'} type - Toast type
 */
export function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.setAttribute('role', 'alert');

  const iconClass =
    type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation';
  toast.innerHTML = `
    <i class="${iconClass} toast-icon" aria-hidden="true"></i>
    <span class="toast-message">${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  // Trigger smooth entrance animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Auto-dismiss after 4.5 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 4500);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
