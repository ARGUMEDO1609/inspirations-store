// Ensure Stimulus controllers reinitialize on Turbo navigation
// Fixes Stimulus controllers not refreshing in ActiveAdmin with Turbo Drive

(function() {
  'use strict';

  function reconnectStimulus() {
    if (window.Stimulus && window.Stimulus.controllers) {
      window.Stimulus.controllers.forEach(function(controller) {
        if (typeof controller.connect === 'function') {
          try {
            controller.connect();
          } catch (e) {
            console.warn('Stimulus reconnect failed:', e);
          }
        }
      });
    }
  }

  // Reconnect on Turbo render (page navigation)
  document.addEventListener('turbo:render', reconnectStimulus);

  // Also handle turbo:load for initial load
  document.addEventListener('turbo:load', reconnectStimulus);

  // Handle Turbo cache restore
  document.addEventListener('turbo:before-cache', function() {
    // Disconnect controllers before caching
    if (window.Stimulus && window.Stimulus.controllers) {
      window.Stimulus.controllers.forEach(function(controller) {
        if (typeof controller.disconnect === 'function') {
          try {
            controller.disconnect();
          } catch (e) {
            console.warn('Stimulus disconnect failed:', e);
          }
        }
      });
    }
  });

  // Reconnect after Turbo restores from cache
  document.addEventListener('turbo:restore', function() {
    setTimeout(reconnectStimulus, 0);
  });

})();