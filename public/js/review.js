/**
 * Vehicle Review System - Client-side JavaScript
 * This file handles interactive star rating, form validation, and AJAX functionality
 * for the vehicle review system.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ===== Interactive Star Rating =====
  const initializeStarRating = () => {
    const starRating = document.querySelector('.star-rating');
    if (!starRating) return;

    const stars = Array.from(starRating.querySelectorAll('input[type="radio"]'));
    const labels = Array.from(starRating.querySelectorAll('label'));

    // Add click event to labels for better mobile support
    labels.forEach(label => {
      label.addEventListener('click', () => {
        const forAttr = label.getAttribute('for');
        const correspondingInput = document.getElementById(forAttr);
        if (correspondingInput) {
          correspondingInput.checked = true;
          
          // Trigger validation on star selection
          validateForm();
        }
      });
    });

    // Ensure the star rating is properly initialized with any existing value
    const checkedStar = stars.find(star => star.checked);
    if (checkedStar) {
      const event = new Event('click');
      const correspondingLabel = document.querySelector(`label[for="${checkedStar.id}"]`);
      if (correspondingLabel) {
        correspondingLabel.dispatchEvent(event);
      }
    }
  };

  // ===== Form Validation =====
  const validateForm = () => {
    const form = document.querySelector('.review-form');
    if (!form) return;

    const reviewText = form.querySelector('#review_text');
    const ratingInputs = form.querySelectorAll('input[name="review_rating"]');
    const submitBtn = form.querySelector('.submit-btn');
    
    // Create or get error containers
    let textErrorEl = document.getElementById('review_text_error');
    let ratingErrorEl = document.getElementById('review_rating_error');
    
    if (!textErrorEl) {
      textErrorEl = document.createElement('div');
      textErrorEl.id = 'review_text_error';
      textErrorEl.className = 'validation-error';
      reviewText.parentNode.appendChild(textErrorEl);
    }
    
    if (!ratingErrorEl) {
      ratingErrorEl = document.createElement('div');
      ratingErrorEl.id = 'review_rating_error';
      ratingErrorEl.className = 'validation-error';
      ratingInputs[0].closest('.form-group').appendChild(ratingErrorEl);
    }
    
    // Clear previous errors
    textErrorEl.textContent = '';
    ratingErrorEl.textContent = '';
    
    // Validate review text
    let isValid = true;
    
    if (!reviewText.value.trim()) {
      textErrorEl.textContent = 'Review text is required.';
      isValid = false;
    } else if (reviewText.value.trim().length < 10) {
      textErrorEl.textContent = 'Review text must be at least 10 characters.';
      isValid = false;
    } else if (reviewText.value.trim().length > 200) {
      textErrorEl.textContent = 'Review text must be less than 200 characters.';
      isValid = false;
    }
    
    // Validate star rating
    const ratingSelected = Array.from(ratingInputs).some(input => input.checked);
    if (!ratingSelected) {
      ratingErrorEl.textContent = 'Please select a rating.';
      isValid = false;
    }
    
    // Update submit button state
    submitBtn.disabled = !isValid;
    
    return isValid;
  };

  // ===== Character Counter =====
  const initializeCharCounter = () => {
    const reviewText = document.querySelector('#review_text');
    if (!reviewText) return;
    
    // Create character counter element
    const charCounter = document.createElement('div');
    charCounter.className = 'char-counter';
    reviewText.parentNode.appendChild(charCounter);
    
    // Update counter function
    const updateCounter = () => {
      const currentLength = reviewText.value.trim().length;
      const maxLength = 200;
      const remaining = maxLength - currentLength;
      
      charCounter.textContent = `${currentLength}/200 characters`;
      
      // Visual feedback
      if (currentLength < 10) {
        charCounter.className = 'char-counter too-short';
      } else if (currentLength > 180) {
        charCounter.className = 'char-counter almost-full';
      } else {
        charCounter.className = 'char-counter';
      }
    };
    
    // Initial update
    updateCounter();
    
    // Add event listeners
    reviewText.addEventListener('input', updateCounter);
    reviewText.addEventListener('keyup', updateCounter);
  };

  // ===== Form Submission Handling =====
  const handleFormSubmission = () => {
    const form = document.querySelector('.review-form');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
      // Validate form before submission
      if (!validateForm()) {
        e.preventDefault();
        return;
      }
      
      // If AJAX submission is desired, uncomment this section
      /*
      e.preventDefault();
      
      try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
          method: 'POST',
          body: new URLSearchParams(formData),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest'
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          
          // Show success message
          const successMessage = document.createElement('div');
          successMessage.className = 'success-message';
          successMessage.textContent = result.message || 'Review submitted successfully!';
          form.parentNode.insertBefore(successMessage, form);
          
          // Optionally redirect or reset form
          setTimeout(() => {
            window.location.href = result.redirect || `/inv/detail/${formData.get('inv_id')}`;
          }, 2000);
        } else {
          throw new Error('Server responded with an error');
        }
      } catch (error) {
        console.error('Error submitting review:', error);
        
        // Show error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'There was an error submitting your review. Please try again.';
        form.parentNode.insertBefore(errorMessage, form);
      }
      */
    });
    
    // Live validation on input
    const reviewText = form.querySelector('#review_text');
    if (reviewText) {
      reviewText.addEventListener('input', validateForm);
      reviewText.addEventListener('blur', validateForm);
    }
  };

  // ===== Initialize All Functionality =====
  initializeStarRating();
  initializeCharCounter();
  handleFormSubmission();
  
  // Add CSS for validation errors and character counter
  const addStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      .validation-error {
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }
      
      .char-counter {
        color: #666;
        font-size: 0.875rem;
        text-align: right;
        margin-top: 0.25rem;
      }
      
      .char-counter.too-short {
        color: #dc3545;
      }
      
      .char-counter.almost-full {
        color: #fd7e14;
      }
      
      .success-message {
        background-color: #d4edda;
        color: #155724;
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 0.25rem;
        border-left: 4px solid #28a745;
      }
      
      .error-message {
        background-color: #f8d7da;
        color: #721c24;
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 0.25rem;
        border-left: 4px solid #dc3545;
      }
    `;
    document.head.appendChild(style);
  };
  
  addStyles();
});