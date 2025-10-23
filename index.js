/* -----------------------------------------
  Have focus outline only for keyboard users 
 ---------------------------------------- */

const handleFirstTab = (e) => {
  if(e.key === 'Tab') {
    document.body.classList.add('user-is-tabbing')

    window.removeEventListener('keydown', handleFirstTab)
    window.addEventListener('mousedown', handleMouseDownOnce)
  }
}

const handleMouseDownOnce = () => {
  document.body.classList.remove('user-is-tabbing')

  window.removeEventListener('mousedown', handleMouseDownOnce)
  window.addEventListener('keydown', handleFirstTab)
}

window.addEventListener('keydown', handleFirstTab)

/* -----------------------------------------
  Enhanced Back to Top Button 
 ---------------------------------------- */

const backToTopButton = document.querySelector(".back-to-top");
let isBackToTopRendered = false;

let alterStyles = (isBackToTopRendered) => {
  backToTopButton.style.visibility = isBackToTopRendered ? "visible" : "hidden";
  backToTopButton.style.opacity = isBackToTopRendered ? 1 : 0;
  backToTopButton.style.transform = isBackToTopRendered ? "scale(1)" : "scale(0)";
};

// Throttle scroll events for better performance
let ticking = false;

window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      if (window.scrollY > 700) {
        isBackToTopRendered = true;
        alterStyles(isBackToTopRendered);
      } else {
        isBackToTopRendered = false;
        alterStyles(isBackToTopRendered);
      }
      ticking = false;
    });
    ticking = true;
  }
});

/* -----------------------------------------
  Lazy Loading for Images 
 ---------------------------------------- */

const images = document.querySelectorAll('img[loading="lazy"]');

const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.classList.add('loaded');
      observer.unobserve(img);
    }
  });
});

images.forEach(img => {
  imageObserver.observe(img);
});

/* -----------------------------------------
  Smooth Scrolling for Navigation 
 ---------------------------------------- */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

/* -----------------------------------------
  Animate Skill Bars
 ---------------------------------------- */

const skillBars = document.querySelectorAll('.skill__progress');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      // Store the width as a data attribute if not already stored
      if (!bar.dataset.width) {
        bar.dataset.width = bar.style.width;
      }
      const width = bar.dataset.width;
      bar.style.width = '0%';
      setTimeout(() => {
        bar.style.width = width;
      }, 200);
      // Unobserve after first animation
      skillObserver.unobserve(bar);
    }
  });
}, { threshold: 0.5 });

skillBars.forEach(bar => {
  skillObserver.observe(bar);
});

/* -----------------------------------------
  Tab Navigation Functionality
 ---------------------------------------- */

const tabs = document.querySelectorAll('.skills__tab');
const panels = document.querySelectorAll('.skills__panel');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const targetPanel = tab.dataset.tab;

    // Remove active class from all tabs and panels
    tabs.forEach(t => t.classList.remove('skills__tab--active'));
    panels.forEach(p => p.classList.remove('skills__panel--active'));

    // Add active class to clicked tab and corresponding panel
    tab.classList.add('skills__tab--active');
    const activePanel = document.querySelector(`[data-panel="${targetPanel}"]`);
    if (activePanel) {
      activePanel.classList.add('skills__panel--active');

      // Re-animate skill bars when tab is switched
      const skillBarsInPanel = activePanel.querySelectorAll('.skill__progress');
      skillBarsInPanel.forEach(bar => {
        // Store the width as a data attribute if not already stored
        if (!bar.dataset.width) {
          bar.dataset.width = bar.style.width;
        }
        const width = bar.dataset.width;
        bar.style.width = '0%';
        setTimeout(() => {
          bar.style.width = width;
        }, 100);
      });
    }
  });
});

/* -----------------------------------------
  Project Filtering Functionality
 ---------------------------------------- */

const filterButtons = document.querySelectorAll('.work__filter');
const projectBoxes = document.querySelectorAll('.work__box');

console.log('Found filter buttons:', filterButtons.length);
console.log('Found project boxes:', projectBoxes.length);

// Add animation class to all projects on initial page load
setTimeout(() => {
  projectBoxes.forEach(box => {
    box.classList.add('work__box--animating');
  });
}, 100);

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filterValue = button.dataset.filter;
    console.log('Filter clicked:', filterValue);

    // Update active button
    filterButtons.forEach(btn => btn.classList.remove('work__filter--active'));
    button.classList.add('work__filter--active');

    // First, remove all animations and hide/show projects
    projectBoxes.forEach(box => {
      box.classList.remove('work__box--animating');
      const categories = box.dataset.category;

      if (filterValue === 'all' || categories.includes(filterValue)) {
        box.classList.remove('work__box--hidden');
      } else {
        box.classList.add('work__box--hidden');
      }
    });

    // Then, after a brief moment, add animation class to visible projects
    setTimeout(() => {
      let visibleCount = 0;
      projectBoxes.forEach(box => {
        if (!box.classList.contains('work__box--hidden')) {
          // Clear any inline styles that might interfere
          box.style.opacity = '';
          box.style.transform = '';

          box.classList.add('work__box--animating');
          visibleCount++;
          console.log('Added animation to box:', box);
        }
      });
      console.log('Total visible projects with animation:', visibleCount);
    }, 50);
  });
});