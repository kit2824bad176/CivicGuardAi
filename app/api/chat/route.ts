import { NextResponse } from "next/server";

const LEGAL_RESPONSES = [
  { keywords: ["theft", "stolen", "robbed", "rob"], response: "For theft, please ensure you list all stolen items, their approximate values, and provide any evidence such as photos of forced entry or purchase receipts." },
  { keywords: ["assault", "hit", "attack", "fight"], response: "If reporting an assault, prioritize your safety first. Seek medical attention if necessary. Medical reports are crucial evidence for these cases." },
  { keywords: ["anonymous", "hide name", "secret"], response: "You can file a complaint anonymously using the toggle in our form. Note that police might have limited ability to follow up with you for additional details without contact info." },
  { keywords: ["status", "track", "progress"], response: "Once you file a complaint, you can track its progress on your Dashboard. It will move from 'Pending Review' to 'Resolved'." },
  { keywords: ["evidence", "upload", "photo", "video"], response: "You can upload images or videos when filing a complaint. We secure your evidence with SHA-256 tamper-proof hashing." },
  { keywords: ["hello", "hi", "help"], response: "Hello! I am the CivicGuard AI Assistant. I can help guide you on legal procedures, required evidence, or how to file a complaint. What do you need help with?" }
];

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const lowerMessage = message.toLowerCase();
    
    let botReply = "I'm sorry, I don't have specific legal guidance for that right now. Could you rephrase your question regarding complaints, evidence, or procedures?";
    
    for (const rule of LEGAL_RESPONSES) {
      if (rule.keywords.some(kw => lowerMessage.includes(kw))) {
        botReply = rule.response;
        break;
      }
    }
    
    // Simulate AI thinking delay to make it feel authentic
    await new Promise(r => setTimeout(r, 600));

    return NextResponse.json({ reply: botReply });
  } catch (error) {
    return NextResponse.json({ reply: "I am temporarily offline. Please try again later." });
  }
}
