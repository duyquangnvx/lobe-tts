import nlp from 'compromise';
import { markdownToTxt } from 'markdown-to-txt';

const toHalfWidthAndCleanSpace = (str: string): string => {
  return (
    markdownToTxt(str)
      // Convert full-width characters to half-width
      .replaceAll(/[\uFF01-\uFF5E]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xFE_E0))
      // Normalize spaces
      .replaceAll('\u3000', ' ')
      // Convert Chinese punctuation to English punctuation for better sentence detection
      .replaceAll('。', '.')
      .replaceAll('，', ',')
      .replaceAll('！', '!')
      .replaceAll('？', '?')
      .replaceAll('；', ';')
      .replaceAll('：', ':')
      .replaceAll('（', '(')
      .replaceAll('）', ')')
      .replaceAll('【', '[')
      .replaceAll('】', ']')
      .replaceAll('《', '<')
      .replaceAll('》', '>')
      .replaceAll('\u201C', '"')
      .replaceAll('\u201D', '"')
      .replaceAll('\u2018', "'")
      .replaceAll('\u2019', "'")
      // Convert line breaks to sentence endings for better tokenization
      .replaceAll('\n', '. ')
      // Normalize multiple spaces to single space
      .replaceAll(/\s+/g, ' ')
      // Ensure proper sentence endings for compromise tokenizer
      .replaceAll(/([!.?])\s*([A-Z])/g, '$1 $2')
      // Clean up any double periods that might have been created
      .replaceAll(/\.\s*\./g, '.')
      .trim()
  );
};

export const splitTextIntoSegments = (text: string, chunkSize: number = 100): string[] => {
  // Clean and normalize the text
  text = toHalfWidthAndCleanSpace(text);

  // Use compromise to parse and split text into sentences
  const doc = nlp(text);
  const sentences = doc.sentences().out('array');

  const chunks: string[] = [];
  let currentChunk = '';

  function addChunk(chunk: string) {
    if (chunk.trim()) {
      chunks.push(chunk.trim());
    }
  }

  // Group sentences into chunks based on chunkSize
  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();

    // If adding this sentence would exceed chunkSize, save current chunk and start new one
    if (currentChunk.length + trimmedSentence.length + 1 > chunkSize && currentChunk.length > 0) {
      addChunk(currentChunk);
      currentChunk = '';
    }

    // Add sentence to current chunk
    currentChunk += (currentChunk ? ' ' : '') + trimmedSentence;
  }

  // Add the last chunk if it exists
  if (currentChunk) {
    addChunk(currentChunk);
  }

  return chunks;
};
