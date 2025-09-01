
import doubtsImg from '../assets/ask-doubts.png';
import feedbackImg from '../assets/attempt-questions.png';
import rawNotesImg from '../assets/raw_notes.png';
import { ClipboardList, FileText, HelpCircle } from 'lucide-react';


 
 export const landingContent = {


useCases : [
  {
    title: "Can’t resolve doubts while learning?",
    description: "Use ILON AI to ask questions directly while watching videos. Get instant help without pausing your learning flow.",
    image: doubtsImg,
    icon: HelpCircle,
  },
  {
    title: "No feedback during learning?",
    description: "ILON AI generates smart questions every few minutes. Attempt them to get timely, personalized feedback.",
    image: feedbackImg,
    icon: ClipboardList,
  },
  {
    title: "No time to make notes?",
    description: "Just write raw notes while learning, and ILON AI takes care of the rest. Get clean, structured notes automatically.",
    image: rawNotesImg,
    icon: FileText,
  },
],
faqs : [
  {
    question: "Is my data and privacy secure?",
    answer:
      "Absolutely. We only process tab audio during active learning sessions and delete it immediately after processing. No personal data is stored without your explicit consent, and we're fully GDPR compliant.",
  },
  
  {
    question: "Will it always be free?",
    answer:
      "Yes, it will be forever free for core features. We may offer optional pro features in the future, but the essential experience will always remain free.",
  },
  {
    question: "Does it work with all YouTube videos?",
    answer:
      "Yes! Our extension works with any YouTube video that has audio. It's optimized for educational content but can generate meaningful interactions for any video type.",
  },
  {
    question: "How accurate are the AI-generated questions?",
    answer:
      "Our AI achieves 99%+ accuracy in question relevance. It's trained on educational content and continuously improves based on user interactions and feedback.",
  }
]

 };
