import { useState } from "react";
import { Configuration, OpenAIApi } from "openai";
import BeatLoader from "react-spinners/BeatLoader";

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

function App() {
  const [difficulty, setDifficulty] = useState("beginner");
  const [wod, setWod] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  console.log(wod);
  const generateWod = async () => {
    const chatGptMessage = `Create a ${difficulty} wod for me`;

    setIsLoading(true);

    try {
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: chatGptMessage,
        max_tokens: 1000,
      }
      ,{
        timeout: 30000,
      });

      setWod(completion.data.choices[0].text);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <div className="brand">Workout Of The Day</div>
      </header>
      <section className="main">
        <div className="actions">
          <div className="difficulties">
            <button
              className={difficulty === "beginner" ? "active" : null}
              onClick={() => setDifficulty("beginner")}
            >
              Beginner
            </button>
            <button
              className={difficulty === "intermediate" ? "active" : null}
              onClick={() => setDifficulty("intermediate")}
            >
              Intermediate
            </button>
            <button
              className={difficulty === "advanced" ? "active" : null}
              onClick={() => setDifficulty("advanced")}
            >
              Advanced
            </button>
          </div>
          <button className="generate" onClick={generateWod}>
            Generate WOD
          </button>
        </div>
        {isLoading ? (
          <div className="loading">
            <BeatLoader color="#d6cfb5" size={30} />
          </div>
        ) : null}
        {wod && !isLoading ? <pre className="wod">{wod}</pre> : null}
      </section>
    </div>
  );
}

export default App;
