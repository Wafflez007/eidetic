# 🧠 Eidetic — An Alexithymia Translator

Eidetic is a mechanism-driven mental health prototype that helps users externalize difficult-to-name internal states by translating somatic sensations into visual representations using Generative AI.

Instead of asking users to name an emotion, Eidetic bypasses language entirely — supporting individuals who struggle with alexithymia, emotional numbing, or non-verbal emotional awareness.

## 🚩 The Problem

Many mental health tools rely on verbal emotional labeling:

- "How do you feel?"
- "Select an emotion"
- "Describe your mood"

For individuals with alexithymia, this is a dead end.

**Alexithymia** is a clinically recognized difficulty in identifying and describing emotions. Traditional talk-based tools fail because they depend on the very skill that is impaired.

This creates a major accessibility gap in mental health support — especially for youth and neurodivergent users.

## 💡 The Core Idea

Eidetic does not ask users to name emotions.

Instead, it operates one level earlier:

**Somatic sensation → Visual externalization → Reflection**

Users describe physical or sensory qualities (e.g. heavy, spiky, hollow) and a perceived arousal level. Eidetic translates this input into a visual representation that exists outside the user, enabling reflection without requiring emotional vocabulary.

This approach is grounded in art therapy, externalization theory, and dimensional affect models.

## 🔁 How It Works (High-Level Flow)

```
Somatic descriptors (non-verbal)
        ↓
Affective translation layer
        ↓
Visual semantics (color, texture, composition)
        ↓
Generative image output
        ↓
Reflection & longitudinal pattern recognition
```

The AI model acts only as a renderer. The therapeutic mechanism lives in the translation logic, not the prompt.

## 🧬 Psychological & Design Principles

Eidetic is informed by:

- **Alexithymia research** — avoiding forced emotional labeling
- **Art Therapy** — externalization reduces cognitive load and emotional reactivity
- **Dimensional affect models** (valence × arousal), not categorical emotion wheels
- **Somatic awareness** — physical descriptors as pre-verbal emotional signals

**Importantly, Eidetic does not attempt to diagnose, treat, or replace therapy.**

## 🧠 The Translation Layer (What Makes This Different)

Unlike typical "AI art" tools:

- Users never write prompts
- Emotional categories are never selected
- Outputs are not random or purely aesthetic

Eidetic uses a **deterministic somatic-to-visual mapping layer** that converts sensation descriptors and arousal levels into visual properties such as:

- Geometry (jagged vs soft)
- Composition (dense vs spacious)
- Color saturation
- Contrast and lighting

This ensures the same internal state produces consistent visual semantics.

**The AI generates the image — the system defines what the image represents.**

## 🗂️ The Gallery: Longitudinal Evidence

Eidetic includes a Gallery that stores previous visualizations.

This is not a portfolio feature — **it is evidence.**

Over time, users can observe:

- Recurring patterns
- Shifts in intensity
- Increased differentiation of internal states

This supports reflective awareness without requiring emotional labeling.

## 🧪 What Eidetic Claims (and What It Does Not)

### ✅ Eidetic supports:

- Non-verbal emotional articulation
- Reflection through externalization
- Reduced pressure to "name feelings"
- Longitudinal self-awareness

### ❌ Eidetic does NOT:

- Diagnose mental health conditions
- Replace therapy
- Claim clinical treatment efficacy
- "Cure" alexithymia

**This prototype demonstrates a mechanism, not a medical intervention.**

## 🛠️ Tech Stack (Prototype)

- **Frontend:** Next.js (React, TypeScript, Tailwind CSS)
- **Animation:** Framer Motion
- **AI Rendering:** Stable Diffusion / image generation API
- **Backend Logic:** Custom affective translation layer
- **Storage:** Supabase (images + metadata)

## 🎯 Why This Matters

Most mental health apps operate in a saturated space of:

- Mood trackers
- Chatbots
- Emotion selection UIs

Eidetic explores a blue-ocean approach:

**Using Generative AI as a prosthetic imagination for users who cannot articulate emotions verbally.**

This reframes AI not as a therapist — but as a translation interface for internal experience.

## 📌 Status

Eidetic is an early-stage prototype developed for **PeerBridge Mental Health Hacks 2025**.

Future work could include:

- User studies
- Expanded somatic dictionaries
- Biosignal-aware input (optional)
- Clinician-guided refinement

## 🤝 Ethical Note

Eidetic is designed with safety and humility:

- Crisis language is detected and redirected
- No therapeutic claims are made
- The tool encourages reflection, not diagnosis

---

*Eidetic — Translating the untranslatable*