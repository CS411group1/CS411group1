const artistInput = document.querySelector('#artist-input');
const searchBtn = document.querySelector('#search-btn');

const placeholderText = "So, whose concert is it?";

function typeWriterEffect(element, text) {
  let i = 0;
  const interval = setInterval(() => {
    if (i >= text.length) {
      clearInterval(interval);
      return;
    }
    element.setAttribute('placeholder', text.slice(0, ++i));
  }, 50);
}

typeWriterEffect(artistInput, placeholderText);
