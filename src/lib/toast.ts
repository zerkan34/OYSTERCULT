// Simple toast implementation since sonner is not available
export const toast = {
  success: (message: string) => {
    console.log(`Success: ${message}`);
    // Display in DOM when needed
    const toastElement = document.createElement('div');
    toastElement.className = 'fixed top-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg z-50 flex items-center';
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    
    // Add check icon
    const iconSpan = document.createElement('span');
    iconSpan.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
    </svg>`;
    toastElement.appendChild(iconSpan);
    
    // Add text
    const textSpan = document.createElement('span');
    textSpan.textContent = message;
    toastElement.appendChild(textSpan);
    
    document.body.appendChild(toastElement);
    
    // Add animation
    toastElement.style.opacity = '0';
    toastElement.style.transform = 'translateY(-20px)';
    toastElement.style.transition = 'all 0.3s ease-in-out';
    
    // Force reflow
    void toastElement.offsetWidth;
    
    toastElement.style.opacity = '1';
    toastElement.style.transform = 'translateY(0)';
    
    setTimeout(() => {
      toastElement.style.opacity = '0';
      toastElement.style.transform = 'translateY(-20px)';
      setTimeout(() => toastElement.remove(), 300);
    }, 3000);
  },
  
  error: (message: string) => {
    console.error(`Error: ${message}`);
    // Display in DOM when needed
    const toastElement = document.createElement('div');
    toastElement.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded shadow-lg z-50 flex items-center';
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    
    // Add X icon
    const iconSpan = document.createElement('span');
    iconSpan.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
    </svg>`;
    toastElement.appendChild(iconSpan);
    
    // Add text
    const textSpan = document.createElement('span');
    textSpan.textContent = message;
    toastElement.appendChild(textSpan);
    
    document.body.appendChild(toastElement);
    
    // Add animation
    toastElement.style.opacity = '0';
    toastElement.style.transform = 'translateY(-20px)';
    toastElement.style.transition = 'all 0.3s ease-in-out';
    
    // Force reflow
    void toastElement.offsetWidth;
    
    toastElement.style.opacity = '1';
    toastElement.style.transform = 'translateY(0)';
    
    setTimeout(() => {
      toastElement.style.opacity = '0';
      toastElement.style.transform = 'translateY(-20px)';
      setTimeout(() => toastElement.remove(), 300);
    }, 4000);
  },
  
  info: (message: string) => {
    console.info(`Info: ${message}`);
    // Display in DOM when needed
    const toastElement = document.createElement('div');
    toastElement.className = 'fixed top-4 right-4 bg-blue-500 text-white p-4 rounded shadow-lg z-50 flex items-center';
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'polite');
    
    // Add info icon
    const iconSpan = document.createElement('span');
    iconSpan.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
    </svg>`;
    toastElement.appendChild(iconSpan);
    
    // Add text
    const textSpan = document.createElement('span');
    textSpan.textContent = message;
    toastElement.appendChild(textSpan);
    
    document.body.appendChild(toastElement);
    
    // Add animation
    toastElement.style.opacity = '0';
    toastElement.style.transform = 'translateY(-20px)';
    toastElement.style.transition = 'all 0.3s ease-in-out';
    
    // Force reflow
    void toastElement.offsetWidth;
    
    toastElement.style.opacity = '1';
    toastElement.style.transform = 'translateY(0)';
    
    setTimeout(() => {
      toastElement.style.opacity = '0';
      toastElement.style.transform = 'translateY(-20px)';
      setTimeout(() => toastElement.remove(), 300);
    }, 3000);
  },
  
  warning: (message: string) => {
    console.warn(`Warning: ${message}`);
    // Display in DOM when needed
    const toastElement = document.createElement('div');
    toastElement.className = 'fixed top-4 right-4 bg-yellow-500 text-white p-4 rounded shadow-lg z-50 flex items-center';
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'polite');
    
    // Add warning icon
    const iconSpan = document.createElement('span');
    iconSpan.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
    </svg>`;
    toastElement.appendChild(iconSpan);
    
    // Add text
    const textSpan = document.createElement('span');
    textSpan.textContent = message;
    toastElement.appendChild(textSpan);
    
    document.body.appendChild(toastElement);
    
    // Add animation
    toastElement.style.opacity = '0';
    toastElement.style.transform = 'translateY(-20px)';
    toastElement.style.transition = 'all 0.3s ease-in-out';
    
    // Media query for reduced motion
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Force reflow
      void toastElement.offsetWidth;
      
      toastElement.style.opacity = '1';
      toastElement.style.transform = 'translateY(0)';
    } else {
      // Simpler animation for users who prefer reduced motion
      toastElement.style.opacity = '1';
      toastElement.style.transform = 'none';
    }
    
    setTimeout(() => {
      toastElement.style.opacity = '0';
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        toastElement.style.transform = 'translateY(-20px)';
      }
      setTimeout(() => toastElement.remove(), 300);
    }, 3000);
  }
};
