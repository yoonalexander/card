"use client";

import { useEffect, useRef, useState } from "react";

const faqs = [
  {
    question: "what are you focused on right now?",
    answer:
      "I am focused on software engineering work around AI, machine learning, data systems, Android, and interactive product experiences.",
  },
  {
    question: "what kind of roles are you interested in?",
    answer:
      "I am interested in software engineering roles where I can work on backend systems, data pipelines, ML-powered features, mobile apps, or polished user-facing tools.",
  },
  {
    question: "what did you work on at Amazon?",
    answer:
      "I worked as a Software Development Engineer Intern on Amazon Photos Android, building Overnight Upload in Kotlin across Android UI and AWS-backed services.",
  },
  {
    question: "what did you work on at CIBC?",
    answer:
      "I worked as a Software Engineer Intern on Salesforce ECRM, building Azure Data Factory and Databricks pipelines, Python services, REST APIs, and ML feature pipelines.",
  },
  {
    question: "what technologies do you like using?",
    answer:
      "Python, Kotlin, JavaScript, React, React Native, Next.js, FastAPI, Databricks, Pandas, NumPy, AWS, Azure, and anything that helps turn an idea into something usable.",
  },
  {
    question: "can I reach out?",
    answer:
      "Yes. Email, LinkedIn, and the chat link are all good ways to reach me. The Links and Contact windows have the fastest routes.",
  },
  {
    question: "what is your favorite kind of project?",
    answer:
      "Projects with a useful system underneath and a clean interface on top: recommendation tools, ML workflows, mobile apps, games, and small products that feel nice to use.",
  },
  {
    question: "why do you like volleyball?",
    answer: "Volleyball is amazing. You should play with me, it brings everyone together as friends!",
  },
  {
    question: "what position do you play in volleyball?",
    answer: "Right side! But I want to learn setter.",
  },
  {
    question: "what's your favourite anime/manga?",
    answer: "Gurren Lagann for anime and Vagabond for manga!",
  },
  {
    question: "what's your favourite food?",
    answer: "I'm biased but I don't careeee, Korean food is so good.",
  },
  {
    question: "why do you like matcha?",
    answer: "Why wouldn't I? It's great.",
  },
  {
    question: "do you wanna thrift together?",
    answer: "Yes, absolutely. I'd love to.",
  },
];

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<Set<number>>(() => new Set([0]));
  const faqAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/assets/sounds/faq_slide_down_up.mp3");
    audio.preload = "auto";
    faqAudioRef.current = audio;
  }, []);

  function playFAQSound() {
    if (window.localStorage.getItem("sound") === "off") return;

    const audio = faqAudioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    void audio.play().catch(() => {
      // Browser audio policies can block playback until a user gesture is accepted.
    });
  }

  function toggleItem(index: number) {
    playFAQSound();

    setOpenItems((currentItems) => {
      const nextItems = new Set(currentItems);

      if (nextItems.has(index)) {
        nextItems.delete(index);
      } else {
        nextItems.add(index);
      }

      return nextItems;
    });
  }

  return (
    <div className="faq-list">
      {faqs.map((faq, index) => {
        const isOpen = openItems.has(index);
        const answerId = `faq-answer-${index}`;

        return (
          <article className={`faq-item${isOpen ? " faq-item-open" : ""}`} key={faq.question}>
            <button
              className="faq-trigger"
              type="button"
              onClick={() => toggleItem(index)}
              aria-expanded={isOpen}
              aria-controls={answerId}
            >
              <span>{faq.question}</span>
              <span className="faq-chevron" aria-hidden="true">
                ^
              </span>
            </button>
            <div className="faq-answer" id={answerId}>
              <div className="faq-answer-inner">
                <p>{faq.answer}</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
