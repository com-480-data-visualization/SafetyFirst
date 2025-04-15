import { useEffect, useState } from "react";

const useInfoTextsFromHtml = () => {
  const [infoTexts, setInfoTexts] = useState("boh");

  useEffect(() => {
    fetch("./infoTexts.html")  // adjust path accordingly
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((htmlText) => {
        console.log("Fetched HTML:", htmlText); // Debug: see the raw HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, "text/html");
        const elements = doc.querySelectorAll("[data-category]");
        const texts = {};
        elements.forEach((el) => {
          const category = el.getAttribute("data-category");
          texts[category] = el.innerHTML;
        });
        console.log("Parsed info texts:", texts); // Debug: see the parsed object
        setInfoTexts(texts);
      })
      .catch((error) => {
        console.error("Error loading info texts:", error);
      });
  }, []);

  return infoTexts;
};

export default useInfoTextsFromHtml;
