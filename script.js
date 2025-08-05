// Replace with your actual API key
const API_KEY = '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';

// Event listener for form submission
document.getElementById('flashcardForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const question = document.getElementById('question').value.trim();
  const answer = document.getElementById('answer').value.trim();

  if (!question || !answer) {
    alert('Please enter both question and answer.');
    return;
  }

  // Prepare prompt for ChatGPT
  const prompt = `Create a concise flashcard with the question: "${question}" and answer: "${answer}". Format it as "Q: ... A: ..."`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // or your preferred model
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      const generatedText = data.choices[0].message.content.trim();
      addFlashcard(generatedText);
    } else {
      alert('Error: ' + data.error.message);
    }
  } catch (error) {
    console.error('Error fetching from API:', error);
    alert('An error occurred while fetching the flashcard.');
  }
});

// Function to add a flashcard to the DOM
function addFlashcard(text) {
  const section = document.getElementById('flashcards');

  // Parse the returned text assuming format: "Q: ... A: ..."
  const match = text.match(/Q:\s*(.+)\s*A:\s*(.+)/s);
  let frontText = '';
  let backText = '';

  if (match) {
    frontText = match[1].trim();
    backText = match[2].trim();
  } else {
    // If format is unexpected, show full text on front
    frontText = text;
    backText = '';
  }

  // Create flashcard element
  const card = document.createElement('div');
  card.className = 'flashcard';
  card.onclick = () => flipCard(card);

  card.innerHTML = `
    <div class="inner">
      <div class="front">${frontText}</div>
      <div class="back">${backText}</div>
    </div>
  `;

  section.appendChild(card);
}

// Flip card function
function flipCard(card) {
  card.classList.toggle('flip');
}
