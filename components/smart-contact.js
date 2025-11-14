/**
 * Smart Contact Form
 * Inspired by Syncratik's intelligent form handling
 * Features: Real-time validation, smart suggestions, submission tracking
 */

class SmartContact {
  constructor() {
    this.form = null;
    this.isSubmitting = false;
    this.hasSubmitted = false;
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.createForm();
  }

  createForm() {
    const contactSection = document.querySelector('.contact__info');
    if (!contactSection) return;

    // Replace simple email link with interactive form
    const existingContent = contactSection.innerHTML;
    
    contactSection.innerHTML = `
      <p>Got any questions? Fill out the form below and I'll get back to you as soon as possible!</p>
      
      <form class="smart-contact-form" id="contact-form">
        <!-- Honeypot field for spam detection (hidden from real users) -->
        <input type="text" name="website" id="website-field" style="position: absolute; left: -9999px; width: 1px; height: 1px;" tabindex="-1" autocomplete="off" />
        
        <div class="form-group">
          <label for="contact-name">
            Your Name <span class="required">*</span>
          </label>
          <input 
            type="text" 
            id="contact-name" 
            name="name" 
            class="form-input"
            placeholder="John Doe"
            required
            autocomplete="name"
          />
          <span class="form-feedback" data-field="name"></span>
        </div>

        <div class="form-group">
          <label for="contact-email">
            Your Email <span class="required">*</span>
          </label>
          <input 
            type="email" 
            id="contact-email" 
            name="email" 
            class="form-input"
            placeholder="john@example.com"
            required
            autocomplete="email"
          />
          <span class="form-feedback" data-field="email"></span>
        </div>

        <div class="form-group">
          <label for="contact-subject">
            Subject <span class="required">*</span>
          </label>
          <select 
            id="contact-subject" 
            name="subject" 
            class="form-input form-select"
            required
          >
            <option value="">-- Select a topic --</option>
            <option value="job">💼 Job Opportunity</option>
            <option value="collaboration">🤝 Collaboration</option>
            <option value="consulting">💡 Consulting</option>
            <option value="question">❓ General Question</option>
            <option value="other">📧 Other</option>
          </select>
          <span class="form-feedback" data-field="subject"></span>
        </div>

        <div class="form-group">
          <label for="contact-message">
            Message <span class="required">*</span>
          </label>
          <textarea 
            id="contact-message" 
            name="message" 
            class="form-input form-textarea"
            placeholder="Tell me about your project or question..."
            rows="5"
            required
            minlength="10"
          ></textarea>
          <div class="form-message-info">
            <span class="form-feedback" data-field="message"></span>
            <span class="char-count">0 / 500</span>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn--primary" id="submit-btn">
            <span class="btn-text">📧 Send via Email</span>
          </button>
        </div>

        <div class="form-status" id="form-status" style="display: none;"></div>
      </form>

      <div class="contact-stats" style="margin-top: 3rem;">
        <p style="font-size: 1.4rem; color: rgba(255,255,255,0.6); text-align: center;">
          📊 Response time: Usually within 24 hours
        </p>
      </div>
    `;

    this.form = document.getElementById('contact-form');
    this.attachEventListeners();
  }

  attachEventListeners() {
    if (!this.form) return;

    // Real-time validation
    const inputs = this.form.querySelectorAll('.form-input');
    inputs.forEach(input => {
      input.addEventListener('blur', (e) => this.validateField(e.target));
      input.addEventListener('input', (e) => {
        if (input.classList.contains('error')) {
          this.validateField(e.target);
        }
      });
    });

    // Character counter for message
    const messageInput = document.getElementById('contact-message');
    messageInput.addEventListener('input', (e) => this.updateCharCount(e.target));

    // Form submission
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    // Smart suggestions based on subject
    const subjectSelect = document.getElementById('contact-subject');
    subjectSelect.addEventListener('change', (e) => this.handleSubjectChange(e.target.value));
  }

  validateField(field) {
    const feedback = document.querySelector(`[data-field="${field.name}"]`);
    let isValid = true;
    let message = '';

    // Clear previous state
    field.classList.remove('error', 'success');
    feedback.textContent = '';

    if (!field.value.trim() && field.required) {
      isValid = false;
      message = 'This field is required';
    } else if (field.type === 'email' && field.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        isValid = false;
        message = 'Please enter a valid email address';
      } else {
        message = '✓ Valid email';
      }
    } else if (field.name === 'message' && field.value) {
      if (field.value.length < 10) {
        isValid = false;
        message = 'Message must be at least 10 characters';
      } else {
        message = '✓ Looking good!';
      }
    } else if (field.value && field.required) {
      message = '✓ Perfect!';
    }

    if (message) {
      feedback.textContent = message;
      field.classList.add(isValid ? 'success' : 'error');
    }

    return isValid;
  }

  updateCharCount(textarea) {
    const charCount = document.querySelector('.char-count');
    const length = textarea.value.length;
    const max = 500;
    
    charCount.textContent = `${length} / ${max}`;
    
    if (length > max) {
      textarea.value = textarea.value.substring(0, max);
      charCount.textContent = `${max} / ${max}`;
      charCount.style.color = '#f87171';
    } else if (length > max * 0.9) {
      charCount.style.color = '#fbbf24';
    } else {
      charCount.style.color = 'rgba(255,255,255,0.6)';
    }
  }

  handleSubjectChange(subject) {
    const messageInput = document.getElementById('contact-message');
    
    // Smart suggestions based on subject
    const suggestions = {
      'job': "I'm interested in discussing potential opportunities. ",
      'collaboration': "I'd like to explore collaboration on ",
      'consulting': "I need expert advice on ",
      'question': "I have a question about "
    };

    if (suggestions[subject] && !messageInput.value) {
      messageInput.placeholder = suggestions[subject] + '...';
    }
    
    // Show contextual tips based on subject
    this.showSmartTip(subject);
  }

  showSmartTip(subject) {
    const tips = {
      'job': '💡 Tip: Mention your timeline and what role interests you most',
      'collaboration': '💡 Tip: Describe your project and how we could work together',
      'consulting': '💡 Tip: Share your challenge and desired outcomes',
      'question': '💡 Tip: Be specific about what you\'d like to know',
      'other': '💡 Tip: Feel free to share whatever\'s on your mind'
    };

    let tipElement = document.querySelector('.smart-tip');
    if (!tipElement) {
      tipElement = document.createElement('div');
      tipElement.className = 'smart-tip';
      const messageGroup = document.getElementById('contact-message').closest('.form-group');
      messageGroup.insertBefore(tipElement, messageGroup.querySelector('.form-message-info'));
    }

    if (tips[subject]) {
      tipElement.textContent = tips[subject];
      tipElement.style.display = 'block';
      setTimeout(() => tipElement.classList.add('visible'), 10);
    } else {
      tipElement.style.display = 'none';
      tipElement.classList.remove('visible');
    }
  }

  generateAISuggestions(message) {
    // AI-powered message suggestions based on keywords
    const keywords = {
      'machine learning': ['What ML frameworks do you specialize in?', 'Do you have experience with model deployment?'],
      'data': ['What kind of data analysis do you offer?', 'Can you help with data visualization?'],
      'project': ['What\'s your typical project timeline?', 'Do you work remotely or on-site?'],
      'hire': ['What\'s your availability?', 'Do you offer contract or full-time positions?'],
      'consulting': ['What\'s your consulting rate?', 'Do you offer package deals?']
    };

    const lowerMessage = message.toLowerCase();
    for (const [keyword, suggestions] of Object.entries(keywords)) {
      if (lowerMessage.includes(keyword)) {
        return suggestions;
      }
    }
    return [];
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    if (this.isSubmitting) return;

    // Spam detection: Check honeypot field
    const honeypot = document.getElementById('website-field');
    if (honeypot && honeypot.value) {
      // Silently reject spam
      console.log('🚫 Spam detected');
      this.showStatus('✅ Message sent! I\'ll get back to you soon.', 'success');
      this.form.reset();
      return;
    }

    // Validate all fields
    const inputs = this.form.querySelectorAll('.form-input');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    if (!isValid) {
      this.showStatus('Please correct the errors above', 'error');
      return;
    }

    // Collect form data
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const subjectValue = document.getElementById('contact-subject').value;
    const message = document.getElementById('contact-message').value;

    // Map subject values to readable text
    const subjectText = {
      'job': '💼 Job Opportunity',
      'collaboration': '🤝 Collaboration',
      'consulting': '💡 Consulting',
      'question': '❓ General Question',
      'other': '📧 Other'
    }[subjectValue] || 'Contact from Portfolio';

    // Create email body
    const emailBody = `Name: ${name}
Email: ${email}
Subject: ${subjectText}

Message:
${message}

---
Sent from Portfolio Contact Form
Date: ${new Date().toLocaleString()}`;

    // Create mailto link and open email client
    const mailtoLink = `mailto:mingshanlee00@gmail.com?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(emailBody)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show personalized auto-confirmation message
    const firstName = name.split(' ')[0];
    const confirmationMessages = {
      'job': `Thanks, ${firstName}! 🎯 I'll review your opportunity and get back to you within 24 hours.`,
      'collaboration': `Exciting, ${firstName}! 🤝 I'm looking forward to exploring this collaboration with you.`,
      'consulting': `Perfect, ${firstName}! 💡 I'll reach out soon to discuss your consulting needs.`,
      'question': `Got it, ${firstName}! ❓ I'll answer your question as soon as possible.`,
      'other': `Thanks for reaching out, ${firstName}! 📧 I'll get back to you shortly.`
    };
    
    const confirmationMessage = confirmationMessages[subjectValue] || `Thanks, ${firstName}! I'll get back to you soon.`;
    this.showStatus(`✅ Opening your email client... ${confirmationMessage}`, 'success');
    
    // Track routing (which "team" would handle this)
    const routing = {
      'job': 'Recruitment Team',
      'collaboration': 'Partnerships Team',
      'consulting': 'Consulting Team',
      'question': 'General Support',
      'other': 'General Support'
    };
    console.log(`📮 Message routed to: ${routing[subjectValue]}`);
    
    // Reset form after a short delay
    setTimeout(() => {
      this.form.reset();
      this.showAlternativeContact();
    }, 2000);
  }

  updateSubmitButton(isLoading) {
    // Not needed anymore - keeping for backwards compatibility
  }

  showStatus(message, type) {
    const status = document.getElementById('form-status');
    status.textContent = message;
    status.className = `form-status form-status--${type}`;
    status.style.display = 'block';

    // Auto-hide after 5 seconds for success messages
    if (type === 'success') {
      setTimeout(() => {
        status.style.display = 'none';
      }, 5000);
    }
  }

  showAlternativeContact() {
    const stats = document.querySelector('.contact-stats');
    if (stats) {
      stats.innerHTML = `
        <div style="text-align: center; padding: 2rem; background: rgba(74, 222, 128, 0.1); border-radius: 12px; border: 1px solid rgba(74, 222, 128, 0.3);">
          <p style="font-size: 1.6rem; color: #4ade80; margin-bottom: 1rem;">
            ✅ Thanks for reaching out!
          </p>
          <p style="font-size: 1.4rem; color: rgba(255,255,255,0.7);">
            You can also find me on:
          </p>
          <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1rem;">
            <a href="https://linkedin.com/in/ming-shan-lee-53a192280/" target="_blank" style="color: #4ade80;">LinkedIn</a>
            <span style="color: rgba(255,255,255,0.3);">•</span>
            <a href="https://github.com/Atatsuki2000" target="_blank" style="color: #4ade80;">GitHub</a>
          </div>
        </div>
      `;
    }
  }


}

// Initialize Smart Contact Form
const smartContact = new SmartContact();
