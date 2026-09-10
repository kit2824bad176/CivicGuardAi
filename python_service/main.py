from fastapi import FastAPI
from pydantic import BaseModel
import re

app = FastAPI(title="CivicGuard AI Service")

class ComplaintInput(BaseModel):
    description: str

class ClassificationOutput(BaseModel):
    category: str
    priority: str
    confidence: float

# Simple keyword-based NLP models for MVP
CATEGORIES = {
    "Theft": ["steal", "stolen", "robber", "thief", "burglary", "wallet", "phone taken", "rob"],
    "Assault": ["hit", "punch", "attack", "fight", "assault", "beat", "weapon", "knife"],
    "Vandalism": ["graffiti", "smash", "break", "damage", "property", "window"],
    "Fraud": ["scam", "fake", "money", "bank", "credit card", "fraud", "deceive"]
}

HIGH_RISK_WORDS = ["gun", "knife", "blood", "kill", "murder", "emergency", "weapon", "shooting", "critical"]
MEDIUM_RISK_WORDS = ["fight", "stolen", "injury", "threat", "danger", "robbed", "assault"]

def classify_text(text: str) -> str:
    text_lower = text.lower()
    scores = {cat: 0 for cat in CATEGORIES}
    
    for category, keywords in CATEGORIES.items():
        for kw in keywords:
            if kw in text_lower:
                scores[category] += 1
                
    best_match = max(scores, key=scores.get)
    return best_match if scores[best_match] > 0 else "Other"

def assess_risk(text: str) -> str:
    text_lower = text.lower()
    
    if any(word in text_lower for word in HIGH_RISK_WORDS):
        return "High"
    if any(word in text_lower for word in MEDIUM_RISK_WORDS):
        return "Medium"
    
    return "Low"

@app.post("/analyze", response_model=ClassificationOutput)
async def analyze_complaint(complaint: ComplaintInput):
    # Step 9 logic
    category = classify_text(complaint.description)
    
    # Step 10 logic
    priority = assess_risk(complaint.description)
    
    return ClassificationOutput(
        category=category,
        priority=priority,
        confidence=0.89 
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
