import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userPrompt: userInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setUserInput("");
    } catch(error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div id="container" className={styles.container}>
      <Head>
        <title>OpenAI - Ernie the emoji chatbot</title>
        <link rel="icon" href="/ernie.png" />
      </Head>

      <main className={styles.main}>
      <i><span style={{ color: '#45ffca' }}>#</span>BecauseBotsHaveEmoti(c)onsToo</i>
        <h1 className={styles.ernie}>ERNIE<sup>😎</sup><sub>🤓</sub></h1> 
        <h3>
          the chatbot that answers in emojish.
        </h3>
        <form onSubmit={onSubmit}>
          <textarea
            name="userPrompt"
            className={styles.textarea}
            placeholder="Paste any very important question"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <input type="submit" value="Ask Ernie" />
        </form>
        <div className={styles.result}>
          <h2>{result}</h2>
        </div>
      </main>
    </div>
  );
}
