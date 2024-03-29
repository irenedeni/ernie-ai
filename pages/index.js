import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState();

  const resetForm = () => {
    setUserInput("");
    setResult("");
  }

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
          <div className={styles.text}>
            <h1 className={styles.ernie}>ERNIE<sup>😎</sup><sub>🤓</sub></h1> 
            <h3>
              The chatbot that answers in emojish.
            </h3>
          </div>
          <form onSubmit={onSubmit}>
            <textarea
              name="userPrompt"
              className={styles.textarea}
              placeholder="Ask any important question or statement"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <div className={styles.btns}>
              <input type="submit" value="Ask Ernie" />
              <input type="button" value="Clear 🧼" onClick={resetForm}/>
            </div>
          </form>
          <div className={styles.result}>
            {result &&
              <>
                <p><span style={{ fontSize: '20px' }}>"</span>{userInput}<span style={{ fontSize: '20px' }}>"</span></p>
                <h2>{result}</h2>
              </>
            }
          </div>
        
      </main>
    </div>
  );
}
