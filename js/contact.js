/**
 * contact.js — Contact Form & Toast Notifications
 * Validates user input, sends message to Flask backend (/api/contact),
 * and provides seamless automatic fallback to mailto: if backend is offline.
 */

export function initContact() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const submitBtn = document.getElementById('contact-submit-btn');

  // Input validation listeners on blur
  nameInput?.addEventListener('blur', () => validateName(nameInput));
  emailInput?.addEventListener('blur', () => validateEmail(emailInput));
  messageInput?.addEventListener('blur', () => validateMessage(messageInput));

  // Clear errors on typing
  nameInput?.addEventListener('input', () => clearError(nameInput, 'name-error'));
  emailInput?.addEventListener('input', () => clearError(emailInput, 'email-error'));
  messageInput?.addEventListener('input', () => clearError(messageInput, 'message-error'));

  // Form submission handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isNameValid = validateName(nameInput);
    const isEmailValid = validateEmail(emailInput);
    const isMessageValid = validateMessage(messageInput);

    if (!isNameValid || !isEmailValid || !isMessageValid) {
      showToast('Please correct the highlighted fields before sending.', 'error');
      return;
    }

    const payload = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      message: messageInput.value.trim()
    };

    // Set loading state on button
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
      // Attempt sending to Flask backend API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        showToast(data.message || 'Thank you! Your message was sent successfully.', 'success');
        form.reset();
      } else {
        // Backend returned an error response
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with code ${response.status}`);
      }
    } catch (err) {
      console.warn('Backend contact API unavailable, switching to mailto fallback:', err.message);

      // Fallback: Open mailto client with pre-filled subject and body
      triggerMailtoFallback(payload);
      showToast('Opening your email client to send message directly...', 'success');
      form.reset();
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
}

/**
 * Validate Name field
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
 * Validate Message field
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
 * Mailto fallback generator
 */
function triggerMailtoFallback({ name, email, message }) {
  // Read recipient from profile or fallback
  const recipient = 'kapishrawat.placeholder@example.com';
  const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
  const body = encodeURIComponent(
    `Hello Kapish,\n\n${message}\n\n---\nSender: ${name}\nEmail: ${email}`
  );
  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
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

  const iconClass = type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation';
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

