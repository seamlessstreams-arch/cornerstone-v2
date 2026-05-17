// ══════════════════════════════════════════════════════════════════════════════
// Aria Intelligence — Base Provider Interface
//
// All AI provider adapters implement this interface.
// Provides unified API regardless of underlying model service.
// ═══════════════��══════════════════════════════════════════════════════════════

import type {
  AriaProviderName,
  AriaProviderCapabilities,
  AriaTokenUsage,
} from "../core/types";

// ── Request/Response Types ────────────────────────────────────────────────

export interface ProviderTextRequest {
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  stopSequences?: string[];
  responseFormat?: "text" | "json";
  tools?: ProviderTool[];
}

export interface ProviderTextResponse {
  text: string;
  tokenUsage: AriaTokenUsage;
  finishReason: string;
  modelVersion?: string;
}

export interface ProviderStreamChunk {
  text: string;
  done: boolean;
  tokenUsage?: AriaTokenUsage;
  finishReason?: string;
}

export interface ProviderEmbeddingRequest {
  texts: string[];
  model?: string;
  dimensions?: number;
}

export interface ProviderEmbeddingResponse {
  embeddings: number[][];
  tokenUsage: AriaTokenUsage;
  model: string;
}

export interface ProviderRerankRequest {
  query: string;
  documents: string[];
  topK?: number;
  model?: string;
}

export interface ProviderRerankResponse {
  results: { index: number; relevanceScore: number }[];
  tokenUsage: AriaTokenUsage;
}

export interface ProviderTool {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export interface ProviderDocumentRequest {
  document: Buffer | string;
  mimeType: string;
  prompt: string;
  maxTokens?: number;
}

export interface ProviderImageRequest {
  image: Buffer | string;
  mimeType: string;
  prompt: string;
  maxTokens?: number;
}

// ── Abstract Provider ─────────────────────────────────────────────────────

export abstract class BaseAriaProvider {
  abstract readonly name: AriaProviderName;
  abstract readonly displayName: string;

  /**
   * Validate that all required environment variables are present.
   * Throws if configuration is invalid.
   */
  abstract validateConfiguration(): void;

  /**
   * Return capabilities of this provider.
   */
  abstract getCapabilities(): AriaProviderCapabilities;

  /**
   * Check if the provider is currently available and configured.
   */
  abstract isAvailable(): boolean;

  /**
   * Generate text completion.
   */
  abstract generateText(request: ProviderTextRequest): Promise<ProviderTextResponse>;

  /**
   * Generate structured output (JSON mode or function calling).
   */
  abstract generateStructured(
    request: ProviderTextRequest & { schema: Record<string, unknown> },
  ): Promise<ProviderTextResponse>;

  /**
   * Stream text completion.
   */
  abstract streamText(
    request: ProviderTextRequest,
  ): AsyncGenerator<ProviderStreamChunk>;

  /**
   * Generate embeddings. Not all providers support this.
   */
  async embed(_request: ProviderEmbeddingRequest): Promise<ProviderEmbeddingResponse> {
    throw new Error(`Provider ${this.name} does not support embeddings`);
  }

  /**
   * Rerank documents by relevance. Not all providers support this.
   */
  async rerank(_request: ProviderRerankRequest): Promise<ProviderRerankResponse> {
    throw new Error(`Provider ${this.name} does not support reranking`);
  }

  /**
   * Analyse a document (PDF, DOCX, etc). Not all providers support this.
   */
  async analyseDocument(_request: ProviderDocumentRequest): Promise<ProviderTextResponse> {
    throw new Error(`Provider ${this.name} does not support document analysis`);
  }

  /**
   * Analyse an image. Not all providers support this.
   */
  async analyseImage(_request: ProviderImageRequest): Promise<ProviderTextResponse> {
    throw new Error(`Provider ${this.name} does not support image analysis`);
  }

  /**
   * Estimate cost in GBP for a given token count.
   */
  abstract estimateCost(inputTokens: number, outputTokens: number, model?: string): number;

  /**
   * Get the default model for this provider.
   */
  abstract getDefaultModel(): string;

  /**
   * List available models for this provider.
   */
  abstract getAvailableModels(): string[];
}
