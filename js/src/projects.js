/**
 * Projects Slider
 * Implements horizontal scrolling for project cards
 */
(function() {
  'use strict';

  function initProjectsSlider() {
    const slider = document.getElementById('projectsSlider');
    const track = document.getElementById('projectsTrack');
    const prevBtn = document.getElementById('projectsPrev');
    const nextBtn = document.getElementById('projectsNext');

    if (!slider || !track) {
      return;
    }

    const cards = track.querySelectorAll('.project-card');
    if (cards.length === 0) {
      return;
    }

    let currentIndex = 0;
    let cardWidth = 0;
    let visibleCards = 3;
    let gap = 20;

    function updateCardWidth() {
      const firstCard = cards[0];
      if (firstCard) {
        const computedStyle = window.getComputedStyle(firstCard);
        cardWidth = firstCard.offsetWidth + parseInt(computedStyle.marginRight || 0);
        
        // Calculate visible cards based on screen width
        const sliderWidth = slider.offsetWidth;
        if (sliderWidth < 480) {
          visibleCards = 1;
        } else if (sliderWidth < 768) {
          visibleCards = 2;
        } else {
          visibleCards = 3;
        }
      }
    }

    function updateSlider() {
      const translateX = -currentIndex * (cardWidth + gap);
      track.style.transform = `translateX(${translateX}px)`;
      
      // Update button states
      if (prevBtn) {
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
      }
      
      if (nextBtn) {
        const maxIndex = Math.max(0, cards.length - visibleCards);
        nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
        nextBtn.style.pointerEvents = currentIndex >= maxIndex ? 'none' : 'auto';
      }
    }

    function slideNext() {
      const maxIndex = Math.max(0, cards.length - visibleCards);
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateSlider();
      }
    }

    function slidePrev() {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
      }
    }

    // Initialize
    updateCardWidth();
    updateSlider();

    // Event listeners
    if (nextBtn) {
      nextBtn.addEventListener('click', slideNext);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', slidePrev);
    }

    // Touch/swipe support
    let startX = 0;
    let isDragging = false;

    track.addEventListener('touchstart', function(e) {
      startX = e.touches[0].clientX;
      isDragging = true;
    });

    track.addEventListener('touchmove', function(e) {
      if (!isDragging) return;
      e.preventDefault();
    });

    track.addEventListener('touchend', function(e) {
      if (!isDragging) return;
      isDragging = false;
      
      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;
      
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          slideNext();
        } else {
          slidePrev();
        }
      }
    });

    // Mouse drag support
    let mouseStartX = 0;
    let isMouseDown = false;

    track.addEventListener('mousedown', function(e) {
      mouseStartX = e.clientX;
      isMouseDown = true;
      track.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', function(e) {
      if (!isMouseDown) return;
      e.preventDefault();
    });

    document.addEventListener('mouseup', function() {
      if (!isMouseDown) return;
      isMouseDown = false;
      track.style.cursor = 'grab';
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        updateCardWidth();
        // Reset to first card if current index is out of bounds
        const maxIndex = Math.max(0, cards.length - visibleCards);
        if (currentIndex > maxIndex) {
          currentIndex = maxIndex;
        }
        updateSlider();
      }, 250);
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjectsSlider);
  } else {
    initProjectsSlider();
  }
})();

