/**
 * LexRank Algorithm Implementation for Extractive Text Summarization
 * Based on "LexRank: Graph-based Lexical Centrality As Salience in Text Summarization"
 * Uses TF-IDF vectors and cosine similarity with PageRank algorithm
 *
 * Compatible with service worker environments
 */

import { LEXRANK_PARAMS, BUFFER_LIMITS, QUALITY_THRESHOLDS, QUALITY_ADJUSTMENTS } from '../constants';

export interface LexRankSummaryResult {
  title: string
  sections: Array<{
    heading: string
    headingLevel?: number
    points?: string[]
    content?: string  // For paragraph-style content
  }>
  keyPoints: string[]
  totalSentences: number
  summaryRatio: number
}

export class LexRankSummarizer {
  private readonly dampingFactor = LEXRANK_PARAMS.DAMPING_FACTOR
  private readonly convergenceThreshold = LEXRANK_PARAMS.CONVERGENCE_THRESHOLD
  private readonly maxIterations = 50
  private readonly similarityThreshold = LEXRANK_PARAMS.SIMILARITY_THRESHOLD

  /**
   * Generate extractive summary using LexRank algorithm
   */
  public summarize(text: string, title: string = '', maxSentences: number = 5): LexRankSummaryResult {
    // Early exit for very short content
    if (text.length < 300) {
      return { title: title || 'Text Summary', sections: [], keyPoints: [], totalSentences: 0, summaryRatio: 0 }
    }
    
    // Step 1: Preprocess and split into sentences
    const sentences = this.splitIntoSentences(text)

    // Remove near-duplicate sentences before processing
    const uniqueSentences = this.removeDuplicates(sentences)
    
    // If we have very few sentences after deduplication, return early
    if (uniqueSentences.length <= 2) {
      return this.formatResult(uniqueSentences.slice(0, Math.min(3, uniqueSentences.length)), uniqueSentences, title)
    }
    
    // Adaptive max sentences based on content length and quality
    if (uniqueSentences.length <= 4) {
      maxSentences = Math.min(maxSentences, 2)  // Very short content
    } else if (uniqueSentences.length <= 8) {
      maxSentences = Math.min(maxSentences, 4)  // Medium content  
    } else {
      maxSentences = Math.min(maxSentences, 7)  // Longer content (for key points + main summary)
    }

    // Step 2: Create TF-IDF vectors for each sentence
    const tfidfVectors = this.computeTFIDFVectors(uniqueSentences)

    // Step 3: Build cosine similarity matrix
    const similarityMatrix = this.buildSimilarityMatrix(tfidfVectors)

    // Step 4: Apply LexRank (PageRank on similarity graph)
    const scores = this.lexRank(similarityMatrix)

    // Step 5: Select top sentences with diversity
    const rankedSentences = this.selectDiverseSentences(uniqueSentences, scores, maxSentences)

    return this.formatResult(rankedSentences, uniqueSentences, title)
  }

  /**
   * Split text into sentences with better preprocessing
   */
  private splitIntoSentences(text: string): string[] {
    // Better text cleaning and normalization
    let cleanedText = text
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/\b(\w+)\s+(\w{1,3})\b/g, (match, word, fragment) => {
        // Fix broken words like "ful" -> "full", "ing" -> "liking" etc
        if (fragment.length <= 3 && word.length > 3) {
          // Common fixes for truncated words
          if (fragment === 'ful' && !word.endsWith('ful')) return word + 'l'
          if (fragment === 'ing' && word.match(/[aeiou]k$/)) return word + 'ing'
        }
        return match
      })
      .replace(/([.!?])\s*([A-Z])/g, '$1\n$2')
      .replace(/\d{10,}/g, '[PHONE]') // Replace long numbers
      .trim()
    
    return cleanedText
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 20 && /[.!?]$/.test(s)) // Longer minimum for quality
      .filter(s => !/^\d+$/.test(s)) // Remove pure numbers
      .filter(s => !/^(CEO|VP|Director|Manager|Officer)\s+/i.test(s)) // Remove title fragments
      .slice(0, BUFFER_LIMITS.SUMMARIZATION_SENTENCES) // Reduce limit for better performance
  }

  /**
   * Compute TF-IDF vectors for all sentences
   */
  private computeTFIDFVectors(sentences: string[]): number[][] {
    // Step 1: Tokenize all sentences and build vocabulary
    const tokenizedSentences = sentences.map(s => this.tokenize(s))
    const vocabulary = new Set<string>()
    tokenizedSentences.forEach(tokens => tokens.forEach(token => vocabulary.add(token)))
    const vocabArray = Array.from(vocabulary)

    // Step 2: Compute TF (Term Frequency) for each sentence
    const tfVectors = tokenizedSentences.map(tokens => {
      const tf = new Array(vocabArray.length).fill(0)
      const termCounts = new Map<string, number>()
      
      // Count terms
      tokens.forEach(token => {
        termCounts.set(token, (termCounts.get(token) || 0) + 1)
      })
      
      // Calculate TF
      vocabArray.forEach((term, index) => {
        const count = termCounts.get(term) || 0
        tf[index] = count / tokens.length // Normalized TF
      })
      
      return tf
    })

    // Step 3: Compute IDF (Inverse Document Frequency)
    const idf = vocabArray.map(term => {
      const docsWithTerm = tokenizedSentences.filter(tokens => 
        tokens.includes(term)
      ).length
      return Math.log(sentences.length / (docsWithTerm + 1)) // +1 to avoid division by zero
    })

    // Step 4: Compute TF-IDF vectors
    const tfidfVectors = tfVectors.map(tf => 
      tf.map((tfValue, index) => tfValue * idf[index])
    )

    return tfidfVectors
  }

  /**
   * Build similarity matrix using cosine similarity
   */
  private buildSimilarityMatrix(tfidfVectors: number[][]): number[][] {
    const n = tfidfVectors.length
    const matrix: number[][] = Array(n).fill(null).map(() => Array(n).fill(0))

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          const similarity = this.cosineSimilarity(tfidfVectors[i], tfidfVectors[j])
          // Apply threshold to create meaningful connections
          matrix[i][j] = similarity > this.similarityThreshold ? similarity : 0
        }
      }
    }

    return matrix
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(vectorA: number[], vectorB: number[]): number {
    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < vectorA.length; i++) {
      dotProduct += vectorA[i] * vectorB[i]
      normA += vectorA[i] * vectorA[i]
      normB += vectorB[i] * vectorB[i]
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB)
    return denominator === 0 ? 0 : dotProduct / denominator
  }

  /**
   * Apply LexRank algorithm (PageRank on similarity graph)
   */
  private lexRank(similarityMatrix: number[][]): number[] {
    const n = similarityMatrix.length
    let scores = Array(n).fill(1.0)
    
    // Normalize similarity matrix (convert to transition probabilities)
    const transitionMatrix = similarityMatrix.map(row => {
      const sum = row.reduce((acc, val) => acc + val, 0)
      return sum > 0 ? row.map(val => val / sum) : row
    })
    
    for (let iter = 0; iter < this.maxIterations; iter++) {
      const newScores = Array(n).fill(0)
      
      for (let i = 0; i < n; i++) {
        let sum = 0
        
        for (let j = 0; j < n; j++) {
          if (i !== j) {
            sum += transitionMatrix[j][i] * scores[j]
          }
        }
        
        newScores[i] = (1 - this.dampingFactor) / n + this.dampingFactor * sum
      }
      
      // Check for convergence
      const diff = newScores.reduce((acc, score, i) => acc + Math.abs(score - scores[i]), 0)
      scores = newScores

      if (diff < this.convergenceThreshold) {
        break
      }
    }
    
    return scores
  }

  /**
   * Tokenize sentence into words
   */
  private tokenize(sentence: string): string[] {
    return sentence
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2)
      .filter(word => !this.isStopWord(word))
  }

  /**
   * Check if word is a stop word
   */
  private isStopWord(word: string): boolean {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these',
      'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'
    ])
    return stopWords.has(word)
  }

  /**
   * Remove duplicate and near-duplicate sentences
   */
  private removeDuplicates(sentences: string[]): string[] {
    const unique: string[] = []
    const seen = new Set<string>()
    
    for (const sentence of sentences) {
      // Create a normalized version for comparison
      const normalized = sentence.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
      
      // Check for exact duplicates
      if (seen.has(normalized)) {
        continue
      }
      
      // Check for near-duplicates (similarity > 85%)
      const isDuplicate = unique.some(existing => {
        const existingNormalized = existing.toLowerCase()
          .replace(/[^\w\s]/g, '')
          .replace(/\s+/g, ' ')
          .trim()
        return this.calculateStringSimilarity(normalized, existingNormalized) > QUALITY_THRESHOLDS.DUPLICATE_THRESHOLD
      })
      
      if (!isDuplicate) {
        unique.push(sentence)
        seen.add(normalized)
      }
    }
    
    return unique
  }

  /**
   * Calculate string similarity using Levenshtein distance
   */
  private calculateStringSimilarity(str1: string, str2: string): number {
    const len1 = str1.length
    const len2 = str2.length
    
    if (len1 === 0) return len2 === 0 ? 1 : 0
    if (len2 === 0) return 0
    
    const matrix: number[][] = []
    
    for (let i = 0; i <= len2; i++) {
      matrix[i] = [i]
    }
    
    for (let j = 0; j <= len1; j++) {
      matrix[0][j] = j
    }
    
    for (let i = 1; i <= len2; i++) {
      for (let j = 1; j <= len1; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          )
        }
      }
    }
    
    const maxLen = Math.max(len1, len2)
    return 1 - matrix[len2][len1] / maxLen
  }

  /**
   * Select diverse sentences to avoid redundancy with quality scoring
   */
  private selectDiverseSentences(sentences: string[], scores: number[], maxSentences: number): string[] {
    const candidates = sentences
      .map((sentence, index) => ({ 
        sentence, 
        score: scores[index], 
        index,
        qualityScore: this.calculateSentenceQuality(sentence)
      }))
      .filter(candidate => candidate.qualityScore > QUALITY_THRESHOLDS.MIN_SIMILARITY) // Filter out very poor quality sentences
      .sort((a, b) => (b.score * b.qualityScore) - (a.score * a.qualityScore)) // Combine LexRank and quality scores
    
    const selected: typeof candidates = []
    
    for (const candidate of candidates) {
      if (selected.length >= maxSentences) break
      
      // Check if this sentence is too similar to already selected ones
      const isTooSimilar = selected.some(selected => {
        const similarity = this.calculateStringSimilarity(
          candidate.sentence.toLowerCase(),
          selected.sentence.toLowerCase()
        )
        return similarity > QUALITY_THRESHOLDS.HIGH_QUALITY // Slightly lower threshold for better diversity
      })
      
      if (!isTooSimilar) {
        selected.push(candidate)
      }
    }
    
    // Sort by original order to maintain narrative flow
    return selected
      .sort((a, b) => a.index - b.index)
      .map(s => s.sentence)
  }

  /**
   * Calculate sentence quality score
   */
  private calculateSentenceQuality(sentence: string): number {
    let quality = 1.0
    
    // Penalize very short sentences
    if (sentence.length < 30) quality *= 0.5
    if (sentence.length < 15) quality *= 0.3
    
    // Penalize sentences with poor grammar indicators
    if (sentence.includes("'ve tried so many")) quality *= 0.2 // Awkward phrasing
    if (/^(Until|And|But|Or)\s+/i.test(sentence)) quality *= 0.6 // Fragment starters
    if (sentence.split(' ').length < 5) quality *= 0.4 // Very short sentences
    
    // Penalize repetitive patterns
    if (/\b(\w+)\b.*\b\1\b/i.test(sentence)) quality *= 0.7 // Repeated words
    
    // Boost sentences with complete thoughts
    if (/^[A-Z].*[.!?]$/.test(sentence)) quality *= 1.2 // Complete sentences
    if (sentence.includes('technique') || sentence.includes('method') || sentence.includes('approach')) quality *= 1.1
    
    // Penalize very common/generic phrases
    if (sentence.includes('might be for you')) quality *= 0.3
    if (/^This\s+(method|technique|approach)\s/i.test(sentence)) quality *= 0.5
    
    return Math.max(0, Math.min(1, quality))
  }

  /**
   * Format results into expected summary structure with smart key points logic
   */
  private formatResult(selectedSentences: string[], allSentences: string[], title: string): LexRankSummaryResult {
    const sections: Array<{heading: string, headingLevel?: number, points?: string[], content?: string}> = []
    let keyPoints: string[] = []
    
    // Determine content length category
    const isShortContent = allSentences.length <= 5  // Paragraph or less
    const isLongContent = allSentences.length >= 12  // Full article
    
    // For very short content, use adaptive bullet count (1-3)
    if (isShortContent) {
      const adaptiveBulletCount = Math.min(Math.max(1, Math.ceil(selectedSentences.length * 0.8)), 3)
      keyPoints = selectedSentences.slice(0, adaptiveBulletCount)
    } 
    // For longer content, provide both key points AND main summary
    else if (isLongContent && selectedSentences.length >= 4) {
      // Adaptive key points (2-4 based on quality and content)
      const adaptiveBulletCount = Math.min(Math.max(2, Math.floor(selectedSentences.length * 0.6)), 4)
      keyPoints = selectedSentences.slice(0, adaptiveBulletCount)
      
      // Add main content summary section as paragraph text (not bullets)
      const mainSummaryPoints = selectedSentences.slice(adaptiveBulletCount, Math.min(selectedSentences.length, adaptiveBulletCount + 3))
      if (mainSummaryPoints.length > 0) {
        sections.push({
          heading: 'Main Content',
          headingLevel: 3,
          content: mainSummaryPoints.join(' ')  // Join as natural paragraph text
        })
      }
    }
    // Medium content - just adaptive bullets
    else {
      const adaptiveBulletCount = Math.min(Math.max(1, Math.ceil(selectedSentences.length * 0.7)), 4)
      keyPoints = selectedSentences.slice(0, adaptiveBulletCount)
    }

    return {
      title: title || 'Text Summary',
      sections,
      keyPoints,
      totalSentences: allSentences.length,
      summaryRatio: Math.round((selectedSentences.length / allSentences.length) * 100) / 100
    }
  }
}