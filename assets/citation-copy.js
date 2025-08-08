document.addEventListener('DOMContentLoaded', function() {
  const bibtexBlocks = document.querySelectorAll('.quarto-appendix-bibtex');
  
  bibtexBlocks.forEach(block => {
    block.addEventListener('click', function() {
      const clipboardText = this.getAttribute('data-clipboard-text');
      if (clipboardText) {
        navigator.clipboard.writeText(clipboardText).then(() => {
          // Show feedback by changing the icon
          this.style.setProperty('--copy-icon', '"✓"');
          setTimeout(() => {
            this.style.setProperty('--copy-icon', '"📋"');
          }, 1000);
        }).catch(err => {
          console.error('Failed to copy: ', err);
        });
      }
    });
  });
}); 