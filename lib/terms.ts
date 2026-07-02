export type ReferenceType =
  | "Official Website"
  | "Documentation"
  | "Specification"
  | "GitHub"
  | "RFC"
  | "Research Paper"
  | "Blog"
  | "Conference"

export type Reference = {
  type: ReferenceType
  label: string
  url: string
}

export type FaqItem = {
  question: string
  answer: string
}

export type CodeExample = {
  title: string
  language: string
  code: string
}

export type Comparison = {
  slug: string
  note: string
}

export type Term = {
  slug: string
  name: string
  shortName?: string
  tagline: string
  category: string
  tags: string[]
  summary: string
  background: string
  history: string
  architecture: string
  workflow: string
  codeExamples: CodeExample[]
  advantages: string[]
  disadvantages: string[]
  comparisons: Comparison[]
  relatedTerms: string[]
  faq: FaqItem[]
  references: Reference[]
}

export const categories = [
  "Models",
  "Architecture",
  "Techniques",
  "Agents",
  "Infrastructure",
] as const

export const terms: Term[] = [
  {
    slug: "large-language-model",
    name: "Large Language Model",
    shortName: "LLM",
    tagline: "Neural network trained on massive text corpora to predict and generate language",
    category: "Models",
    tags: ["NLP", "Transformer", "Deep Learning"],
    summary:
      "A Large Language Model (LLM) is a neural network, typically based on the Transformer architecture, trained on large-scale text data to model the statistical structure of language and perform a wide range of generation and understanding tasks.",
    background:
      "LLMs emerged from advances in deep learning for NLP, scaling both model parameters and training data to unlock emergent capabilities such as few-shot reasoning and instruction following.",
    history:
      "2018: GPT and BERT introduce large-scale pretraining. 2020: GPT-3 demonstrates few-shot learning at 175B parameters. 2022: ChatGPT popularizes instruction-tuned LLMs. 2023-2024: Open-weight models (Llama, Mistral) and multimodal LLMs proliferate.",
    architecture:
      "Most LLMs use a decoder-only Transformer stack with self-attention layers, positional encodings, and feed-forward blocks, trained with next-token prediction.",
    workflow:
      "Pretraining on large text corpora → instruction tuning → alignment (RLHF/DPO) → deployment behind an inference API or local runtime.",
    codeExamples: [
      {
        title: "Basic completion request",
        language: "python",
        code: `from openai import OpenAI

client = OpenAI()
response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Explain LLMs in one sentence."}],
)
print(response.choices[0].message.content)`,
      },
    ],
    advantages: [
      "Generalizes across many NLP tasks without task-specific training",
      "Strong few-shot and zero-shot performance",
      "Rapid ecosystem growth (tooling, fine-tuning, agents)",
    ],
    disadvantages: [
      "High compute and energy cost for training and inference",
      "Prone to hallucination and factual errors",
      "Limited context window relative to full corpora",
    ],
    comparisons: [
      { slug: "transformer", note: "LLMs are typically built on the Transformer architecture" },
      { slug: "retrieval-augmented-generation", note: "RAG augments LLMs with external knowledge retrieval" },
    ],
    relatedTerms: ["transformer", "retrieval-augmented-generation", "fine-tuning"],
    faq: [
      {
        question: "What is the difference between an LLM and a chatbot?",
        answer:
          "An LLM is the underlying model; a chatbot is an application built on top of an LLM with additional prompting, memory, and UI.",
      },
      {
        question: "How large is a typical LLM?",
        answer: "Parameter counts range from a few billion to over a trillion, depending on the model family.",
      },
    ],
    references: [
      { type: "Research Paper", label: "Attention Is All You Need", url: "https://arxiv.org/abs/1706.03762" },
      { type: "Blog", label: "OpenAI GPT-4 Technical Report", url: "https://openai.com/research/gpt-4" },
    ],
  },
  {
    slug: "transformer",
    name: "Transformer",
    tagline: "Attention-based neural network architecture for sequence modeling",
    category: "Architecture",
    tags: ["Deep Learning", "Attention", "NLP"],
    summary:
      "The Transformer is a neural network architecture that relies entirely on self-attention mechanisms to model relationships between tokens in a sequence, replacing recurrence and convolution.",
    background:
      "Introduced to overcome the sequential bottleneck of RNNs, enabling parallel training and better long-range dependency modeling.",
    history:
      "2017: Vaswani et al. publish 'Attention Is All You Need'. 2018-2019: BERT and GPT apply Transformers to pretraining. 2020s: Transformer becomes the dominant architecture across NLP, vision, and audio.",
    architecture:
      "Encoder-decoder (or decoder-only) stack of multi-head self-attention and position-wise feed-forward layers, with residual connections and layer normalization.",
    workflow:
      "Input tokens → embeddings + positional encoding → stacked attention/FFN blocks → output projection (e.g. next-token logits).",
    codeExamples: [
      {
        title: "Minimal self-attention (PyTorch)",
        language: "python",
        code: `import torch.nn.functional as F

def self_attention(q, k, v):
    scores = q @ k.transpose(-2, -1) / (q.size(-1) ** 0.5)
    weights = F.softmax(scores, dim=-1)
    return weights @ v`,
      },
    ],
    advantages: [
      "Highly parallelizable training compared to RNNs",
      "Captures long-range dependencies via attention",
      "Scales predictably with data and compute",
    ],
    disadvantages: [
      "Quadratic complexity in sequence length",
      "Requires large amounts of training data to generalize well",
    ],
    comparisons: [
      { slug: "large-language-model", note: "LLMs are large-scale applications of the Transformer architecture" },
    ],
    relatedTerms: ["large-language-model", "fine-tuning"],
    faq: [
      {
        question: "Is the Transformer only used for text?",
        answer: "No, Transformers are also used for vision (ViT), audio, and multimodal tasks.",
      },
    ],
    references: [
      { type: "Research Paper", label: "Attention Is All You Need", url: "https://arxiv.org/abs/1706.03762" },
      { type: "GitHub", label: "tensor2tensor reference implementation", url: "https://github.com/tensorflow/tensor2tensor" },
    ],
  },
  {
    slug: "retrieval-augmented-generation",
    name: "Retrieval-Augmented Generation",
    shortName: "RAG",
    tagline: "Combines a retriever with a generative model to ground outputs in external knowledge",
    category: "Techniques",
    tags: ["NLP", "Search", "LLM"],
    summary:
      "Retrieval-Augmented Generation (RAG) is a technique that retrieves relevant documents from an external knowledge source and conditions an LLM's generation on that retrieved context, improving factual grounding.",
    background:
      "RAG addresses the static-knowledge and hallucination limitations of LLMs by letting the model consult up-to-date or domain-specific external data at inference time.",
    history:
      "2020: Lewis et al. introduce RAG for knowledge-intensive NLP tasks. 2023-2024: RAG becomes the default pattern for enterprise LLM applications via vector databases.",
    architecture:
      "Query encoder → vector similarity search over an indexed document store → retrieved passages injected into the LLM prompt → generation.",
    workflow:
      "Ingest documents → chunk and embed → store in a vector index → at query time, retrieve top-k chunks → generate answer conditioned on retrieved context.",
    codeExamples: [
      {
        title: "Basic RAG retrieval step",
        language: "python",
        code: `results = vector_store.similarity_search(query, k=4)
context = "\\n".join(r.page_content for r in results)
prompt = f"Answer using this context:\\n{context}\\n\\nQuestion: {query}"`,
      },
    ],
    advantages: [
      "Reduces hallucination by grounding answers in retrieved evidence",
      "Allows knowledge updates without retraining the model",
      "Supports citing sources",
    ],
    disadvantages: [
      "Retrieval quality bottlenecks overall answer quality",
      "Adds latency and infrastructure complexity (vector DB, indexing pipeline)",
    ],
    comparisons: [
      { slug: "fine-tuning", note: "RAG injects knowledge at inference time; fine-tuning bakes it into model weights" },
    ],
    relatedTerms: ["large-language-model", "fine-tuning"],
    faq: [
      {
        question: "Does RAG require fine-tuning the model?",
        answer: "No. RAG typically works with a frozen, off-the-shelf LLM plus a retrieval pipeline.",
      },
    ],
    references: [
      {
        type: "Research Paper",
        label: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
        url: "https://arxiv.org/abs/2005.11401",
      },
    ],
  },
  {
    slug: "fine-tuning",
    name: "Fine-Tuning",
    tagline: "Adapting a pretrained model to a specific task or domain via further training",
    category: "Techniques",
    tags: ["Training", "Transfer Learning"],
    summary:
      "Fine-tuning continues training a pretrained model on a smaller, task- or domain-specific dataset, adjusting its weights to specialize its behavior while retaining general knowledge from pretraining.",
    background:
      "Fine-tuning leverages transfer learning: rather than training from scratch, a general-purpose pretrained model is adapted at a fraction of the cost.",
    history:
      "2018: ULMFiT and BERT popularize pretrain-then-finetune for NLP. 2021-2022: Parameter-efficient methods (LoRA, adapters) reduce fine-tuning cost. 2023+: Instruction fine-tuning and RLHF become standard for aligning LLMs.",
    architecture:
      "Same base model architecture as pretraining; only the training objective, dataset, and optionally a subset of parameters (e.g. LoRA adapters) change.",
    workflow:
      "Select base model → prepare labeled/instruction dataset → train (full or parameter-efficient) → evaluate → deploy specialized model.",
    codeExamples: [
      {
        title: "LoRA fine-tuning setup (conceptual)",
        language: "python",
        code: `from peft import LoraConfig, get_peft_model

config = LoraConfig(r=8, lora_alpha=16, target_modules=["q_proj", "v_proj"])
model = get_peft_model(base_model, config)`,
      },
    ],
    advantages: [
      "Improves performance on narrow, domain-specific tasks",
      "Parameter-efficient methods make it accessible with limited compute",
    ],
    disadvantages: [
      "Risk of catastrophic forgetting of general capabilities",
      "Requires curated, task-specific training data",
    ],
    comparisons: [
      { slug: "retrieval-augmented-generation", note: "Fine-tuning bakes knowledge into weights; RAG retrieves it at inference time" },
    ],
    relatedTerms: ["large-language-model", "transformer", "retrieval-augmented-generation"],
    faq: [
      {
        question: "When should I fine-tune instead of using RAG?",
        answer:
          "Fine-tune when you need to change model behavior or style consistently; use RAG when you need up-to-date or large external knowledge.",
      },
    ],
    references: [
      { type: "Documentation", label: "OpenAI Fine-tuning Guide", url: "https://platform.openai.com/docs/guides/fine-tuning" },
      { type: "GitHub", label: "Hugging Face PEFT", url: "https://github.com/huggingface/peft" },
    ],
  },
]

export const getTermBySlug = (slug: string): Term | undefined =>
  terms.find((term) => term.slug === slug)

export const getTermsByCategory = (category: string): Term[] =>
  terms.filter((term) => term.category === category)

export const getRelatedTerms = (term: Term): Term[] =>
  term.relatedTerms
    .map((slug) => getTermBySlug(slug))
    .filter((t): t is Term => Boolean(t))
