# Legal & Licensing

## NOIR AI HUB Policy

### Independence

NOIR AI HUB is an **independent open-source software project**. NOIR is not affiliated with, endorsed by, or associated with:

- OpenAI / ChatGPT
- Google / Gemini
- Anthropic / Claude
- Perplexity
- xAI / Grok
- Hugging Face
- Meta / Llama
- Mistral
- Other AI providers

### What NOIR Does NOT Do

NOIR **does not**:

- Provide unauthorized access to paid subscriptions
- Bypass provider authentication systems
- Circumvent rate limits or usage restrictions
- Claim ownership of third-party models or services
- Violate provider terms of service
- Share provider API keys between users
- Store or cache provider responses without permission

### What NOIR DOES Do

NOIR provides:

1. **Unified Interface** — One dashboard for managing multiple providers
2. **Official API Access** — Uses publicly documented, officially supported APIs
3. **Free Tier Access** — Respects provider-offered free tiers (subject to provider limits)
4. **Bring Your Own Key** — Secure storage of user-provided provider credentials
5. **Local Models** — Access to open-source models via Ollama
6. **Smart Routing** — Intelligent model selection based on task type

### User Responsibility

Users are responsible for:

- Complying with each provider's terms of service
- Understanding each provider's pricing and usage limits
- Maintaining valid API credentials (if using BYOK)
- Monitoring their usage and costs
- Reviewing provider privacy policies
- Not using NOIR to violate provider terms

### Provider Terms

#### OpenAI
- Terms: https://openai.com/policies/terms-of-use
- Privacy: https://openai.com/policies/privacy-policy
- NOIR users must accept OpenAI's terms when connecting their API key

#### Google Gemini
- Terms: https://policies.google.com/terms
- Privacy: https://policies.google.com/privacy
- Free tier available with limits

#### Anthropic Claude
- Terms: https://www.anthropic.com/terms
- Privacy: https://www.anthropic.com/privacy
- NOIR users must accept Anthropic's terms

#### Perplexity
- Terms: https://www.perplexity.ai/terms
- Privacy: https://www.perplexity.ai/privacy
- Free tier available

#### xAI Grok
- Terms: https://x.ai/terms
- Privacy: https://x.ai/privacy
- Requires valid API credentials

#### Hugging Face
- Terms: https://huggingface.co/terms-of-service
- Privacy: https://huggingface.co/privacy
- Open models subject to model-specific licenses

#### Ollama
- License: https://github.com/ollama/ollama/blob/main/LICENSE
- Models have individual licenses

## NOIR Licensing

### Source Code License

NOIR AI HUB source code is licensed under **Apache License 2.0**.

You are free to:
- Use commercially
- Modify
- Distribute
- Use privately
- Use in patent claims

Conditions:
- State changes
- Disclose source
- Include license and copyright notice

### Third-Party Licenses

See [THIRD_PARTY_LICENSES.md](../THIRD_PARTY_LICENSES.md) for all dependencies and their licenses.

Key dependencies:
- Next.js — MIT
- Express — MIT
- Prisma — Apache 2.0
- Tailwind CSS — MIT
- shadcn/ui — MIT
- Redis — BSD
- PostgreSQL — PostgreSQL License

### Model Licenses

Models available through NOIR are subject to their respective licenses:

- **Ollama models** — Various (check model card)
- **Open models (Hugging Face)** — Various (check model card)
- **Proprietary models** — Subject to provider terms

## Data & Privacy

### NOIR's Data Handling

NOIR collects minimal data:

- Account information (email, name, hashed password)
- Conversation history (stored locally, encrypted)
- Usage records (tokens, latency, provider)
- Device information (for analytics, optional)

NOIR **does not**:

- Sell user data
- Share conversations with third parties
- Use conversations for model training (without consent)
- Store provider API keys in plain text
- Log sensitive request/response data

### Provider Data Sharing

When you use a provider through NOIR:

- Your prompt is sent to that provider
- Provider's privacy policy applies
- Provider may retain data per their terms
- NOIR does not claim ownership of responses
- Users own their usage data (tokens, costs)

### GDPR & Compliance

NOIR supports:

- Data export (download your data)
- Data deletion (erasure)
- Account deletion
- Transparent privacy practices

For privacy concerns: privacy@noir-ai-hub.dev

## Disclaimer

### Accuracy

AI models can make mistakes. NOIR does not:

- Guarantee accuracy
- Warrant output quality
- Accept liability for model errors
- Endorse model outputs

### Liability

NOIR is provided "as-is" without warranties. To the maximum extent permitted by law, NOIR and its contributors are not liable for:

- Loss of data
- Lost profits
- Business interruption
- Provider service disruptions
- Costs from model usage

You assume all risks associated with using NOIR.

### Content

Users are responsible for:

- Content they input
- Complying with laws
- Not violating others' rights
- Not using NOIR for illegal purposes

NOIR reserves the right to suspend accounts violating these terms.

## Changes to These Terms

We may update this policy. Continued use of NOIR constitutes acceptance of updated terms.

Notable changes will be announced via:
- GitHub releases
- Email notification (for accounts)
- In-app banner

## Questions?

Email: legal@noir-ai-hub.dev
