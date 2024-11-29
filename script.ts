import GlitchedWriter, { wait } from "https://cdn.skypack.dev/glitched-writer@2.0.29";

// Glitched Writer npm module reference:
// https://www.npmjs.com/package/glitched-writer

// Initialize the GlitchedWriter instance
const Writer = new GlitchedWriter("#glitch_this", { letterize: true }, logString);

// Async function to handle the sequence of writing text
(async () => {
  try {
    // Introduce delays and write messages sequentially
    await wait(1000); // Wait for 1 second
    await Writer.write("my old friend."); // Write first message
    
    await wait(1200); // Wait for 1.2 seconds
    await Writer.write("This is only the beginning."); // Write second message
    
    await wait(1500); // Wait for 1.5 seconds
    await Writer.write("Please, say something..."); // Write third message
    
    // Enable the input element
    const input = document.querySelector("#input");
    if (input) {
      input.removeAttribute("disabled"); // Enable the input field
    } else {
      console.warn("Input element with ID '#input' not found.");
    }
  } catch (error) {
    console.error("An error occurred during the writing process:", error);
  }
})();

// Function to log the written strings
function logString(string) {
  const logs = document.querySelector("#logs");
  if (logs) {
    logs.innerHTML += `<p>${string}</p>`; // Append the string to the logs
  } else {
    console.warn("Logs container with ID '#logs' not found.");
  }
}
