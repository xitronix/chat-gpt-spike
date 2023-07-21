import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const chatHistory = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [
      {
        role: "assistant",
        content:
          "Hey. I am here to help you buy a laptop. What laptop are you looking for?",
      },
    ]
  );

  useEffect(() => {
    chatHistory.current.scrollTop = chatHistory.current.scrollHeight;
  }, [messages]);

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const newUserMessage = { role: "user", content: input };
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, newUserMessage],
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setMessages((messages) => [...messages, newUserMessage, data.result]);
      setInput("");
      console.log(chatHistory.current);
      console.log(chatHistory);
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
    setIsLoading(false);
  }

  return (
    <div>
      <Head>
        <title>AI consultant</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <h3>Chat GPT 3.5 turbo</h3>

        <div ref={chatHistory} className={styles.result}>
          {messages.map(({ role, content }, i) => (
            <div key={i} className={styles["result-line"]}>
              <div className={styles.role}>{role}:</div>{" "}
              <div className={styles.content}>{content}</div>
            </div>
          ))}
        </div>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="message"
            placeholder="Enter message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <input type="submit" value="Send" disabled={!input || isLoading} />
        </form>
      </main>
    </div>
  );
}
