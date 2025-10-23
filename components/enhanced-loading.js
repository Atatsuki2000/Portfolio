// Enhanced Lazy Loading and Animations
document.addEventListener('DOMContentLoaded', function() {
  
  // Simple enhanced lazy loading with smooth fade-in
  function setupCleanLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    // Create optimized intersection observer
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Simple image loading with fade-in
          img.addEventListener('load', function() {
            img.classList.add('loaded');
          });
          
          img.addEventListener('error', function() {
            img.classList.add('error');
          });
          
          // If image is already cached and loaded
          if (img.complete && img.naturalHeight !== 0) {
            img.classList.add('loaded');
          }
          
          // Stop observing this image
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '100px', // Start loading 100px before entering viewport
      threshold: 0.1
    });
    
    // Observe all lazy images
    images.forEach(img => {
      // Skip if already loaded
      if (img.complete && img.naturalHeight !== 0) {
        img.classList.add('loaded');
        return;
      }
      
      imageObserver.observe(img);
    });
    
    return imageObserver;
  }
  
  // Enhanced section-based lazy loading with staggered animations
  function setupSectionLazyLoading() {
    const sections = document.querySelectorAll('.about, .certificates');
    
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Staggered animation delay for multiple items
          setTimeout(() => {
            entry.target.classList.add('fade-in');
            
            // Also trigger any child image loading
            const childImages = entry.target.querySelectorAll('img[loading="lazy"]:not(.loaded)');
            childImages.forEach(img => {
              // Force image to start loading if not already
              if (!img.src || img.src === img.dataset.src) {
                // Image will be handled by the image observer
              }
            });
          }, index * 100); // 100ms delay between each item
          
          sectionObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '80px'
    });
    
    sections.forEach(section => {
      sectionObserver.observe(section);
    });
    
    return sectionObserver;
  }
  
  // Optimized scroll performance
  function setupOptimizedScrolling() {
    let ticking = false;
    
    function updateOnScroll() {
      // Any scroll-based optimizations can go here
      ticking = false;
    }
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
      }
    }, { passive: true }); // Passive for better performance
  }
  
  // Initialize sections to be hidden initially (excluding work__box - handled by filter animation)
  // const workBoxes = document.querySelectorAll('.work__box');
  // workBoxes.forEach(box => {
  //   box.style.opacity = '0';
  //   box.style.transform = 'translateY(20px)';
  // });
  
  // Initialize clean enhancements
  const imageObserver = setupCleanLazyLoading();
  const sectionObserver = setupSectionLazyLoading();
  setupOptimizedScrolling();
  
  // Performance monitoring (optional)
  if (window.performance && window.performance.mark) {
    window.performance.mark('lazy-loading-initialized');
  }
  
  // Cleanup observers when page is hidden (for SPA or navigation)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      imageObserver?.disconnect();
      sectionObserver?.disconnect();
    }
  });
});