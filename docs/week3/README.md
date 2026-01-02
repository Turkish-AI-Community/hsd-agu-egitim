# Hafta 3: LLM Entegrasyonu ve AI Agent'lar

## Genel Bakış

Bu haftanın amacı Week 2'de oluşturduğumuz **KrediPusula** API'sini Google Gemini ile entegre ederek müşterilere akıllı destek sağlayan bir chatbot sistemi geliştirmek.

---

## Konu Başlıkları

### 1. Generative AI Temelleri
- Generative AI nedir?
- LLM (Large Language Model) kavramı
- Transformer architecture temelleri
- API vs Local models

### 2. LLM Parametreleri
- Temperature
- Max tokens
- Stop sequences
- Parametrelerin çıktıya etkisi

### 3. Prompt Engineering Teknikleri
- Zero-shot prompting
- Few-shot prompting
- Chain-of-thought reasoning
- System prompts ve role definition
- Prompt templates
- Best practices ve anti-patterns

### 4. Google Gemini Modelleri
- Gemini model ailesii (Pro, Flash)
- Google GenAI SDK kurulumu
- API kullanımı
- Multi-modal capabilities
- Rate limits ve pricing

### 5. Agent/RAG Mimarileri
- Agent nedir?
- Tool/Function calling
- RAG (Retrieval Augmented Generation)
- Memory management
- Conversation history

### 6. Use Case İçin Mimari Tasarımı
- KrediPusula chatbot mimarisi
- API entegrasyon stratejisi
- Frontend-Backend iletişimi
- Error handling ve fallbacks
- User experience considerations

---


## Kullanılan Teknolojiler

| Teknoloji | Kullanım Alanı |
|-----------|----------------|
| **google-generativeai** | Gemini API client |
| **HTML/CSS/JavaScript** | Frontend UI |
| **FastAPI** | Backend API |

---


## Frontend Yapısı

```
week3-llm-agents/
├── agent/
│   ├── chatbot.py        # Main chatbot logic
│   ├── prompts.py        # Prompt templates
│   └── utils.py          # Utility functions
├── frontend/
│   ├── index.html        # Main HTML
│   ├── style.css         # Styling
│   └── script.js         # JavaScript logic
└── examples/
    └── conversations.md  # Sample dialogs
```

