**🛡️ PII-Shield: AI-Driven Privacy Gateway**

An enterprise-grade, privacy-preserving MERN middleware that intercepts raw text and files to redact Personally Identifiable Information (PII). By executing an edge-optimized BERT-base-NER Transformer model 100% locally, it functions as an on-premise compliance firewall preventing data leakage to public cloud LLMs.

**🛠️ System Architecture**

Ingestion Layer: Accepts text strings or batch .txt documents via a modern React interface.

Deterministic Layer (Regex): Instantly filters structured data like mobile numbers and emails.

Contextual Layer (Local AI): Uses an in-memory Xenova/bert-base-NER pipeline to accurately isolate entity names based on conversational context.

Tokenization Mapping: Replaces sensitive text with index-persistent tokens (e.g., [NAME_1]).

Audit Logging: Saves anonymized transaction metadata securely to MongoDB for dashboard analytics.

**✨ Features**

🧠 100% Local Inference: Zero outbound network requests; runs completely offline via CPU-quantized models.

⚡ Optimized Latency: Utilizes a Singleton Pattern for model instantiation, maintaining a processing speed of <200ms.

📊 Compliance Dashboard: Real-time metrics dashboard to visualize redaction logs and threat instances.

⚙️ Granular Policy Engine: Multi-toggle admin panel to enable/disable specific entity filters on the fly.

📂 File Stream Support: Built-in multipart document stream using multer to handle batch document scrubbing.

**💻 Tech Stack**

Frontend: React.js, Axios, Modern Glassmorphism CSS

Backend: Node.js, Express.js

Database: MongoDB, Mongoose ODM

AI Engine: HuggingFace Transformers.js, Xenova/bert-base-NER
