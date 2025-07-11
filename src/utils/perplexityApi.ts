
import { PERPLEXITY_API_KEY, PERPLEXITY_API_URL } from '@/config/api';

interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export const chatWithAI = async (message: string): Promise<string> => {
  const apiKey = PERPLEXITY_API_KEY;
  console.log('Attempting to chat with AI. API key is present.');
  
  const response = await fetch(PERPLEXITY_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'sonar-pro',
      messages: [
        {
          role: 'system',
          content: `You are a helpful AI assistant specialized in scientific research and analysis. Provide accurate, evidence-based information and help users understand complex scientific concepts.

When a user asks a question, provide a conversational answer and support it with 2-4 peer-reviewed research papers.

RESPONSE FORMAT - Return ONLY valid JSON:
{
  "message": "Your conversational, helpful response to the user's query. This is the text that will be displayed in the chat.",
  "sources": [
    {
      "title": "Complete research paper title exactly as published",
      "url": "Direct URL to the actual research paper (ArXiv, DOI, PubMed, journal website)",
      "summary": "A brief, one-sentence summary of the paper's relevance to the user's question."
    }
  ]
}

IMPORTANT:
- Always return a valid JSON object.
- If you cannot find relevant sources, return an empty "sources" array.
- The "message" should be a friendly, conversational response.
- Do not include bracketed citations like [1], [2] in the "message" field. All sources should be in the "sources" array.
- Access URLs and social media posts if provided by the user to understand the context.`
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.2,
      top_p: 0.9,
      max_tokens: 2000,
      return_images: false,
      return_related_questions: false,
      frequency_penalty: 1,
      presence_penalty: 0
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Perplexity API Error (chat):', { status: response.status, statusText: response.statusText, body: errorText });
    throw new Error(`API request failed with status ${response.status}.`);
  }

  const data: PerplexityResponse = await response.json();
  
  if (!data.choices || data.choices.length === 0 || !data.choices[0].message || !data.choices[0].message.content) {
    console.error('Invalid response structure from Perplexity API (chat):', data);
    throw new Error('Received an invalid response from the AI.');
  }

  const responseContent = data.choices[0].message.content;
  console.log('Raw response from Perplexity (chat):', responseContent);

  return parseAIResponse(responseContent, 'chat');
};

export const analyzeContent = async (content: string, type: 'url' | 'text' | 'pdf'): Promise<string> => {
  const apiKey = PERPLEXITY_API_KEY;
  console.log('=== STARTING CONTENT ANALYSIS ===');
  console.log('Content to analyze (first 200 chars):', content.substring(0, 200));
  console.log('Analysis type:', type);

  // Bridge to Python backend for url
  if (type === 'url') {
    try {
      // Debug log
      console.log('Sending to backend:', content, 'type:', type);
      // Validate URL
      if (!/^https?:\/\//.test(content)) {
        throw new Error('Invalid URL: must start with http:// or https://');
      }
      const backendUrl = 'http://localhost:8000/scrape';
      const reqBody = { url: content };
      const backendResp = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqBody)
      });
      if (!backendResp.ok) {
        const errText = await backendResp.text();
        let userMessage = '';
        try {
          const errJson = JSON.parse(errText);
          if (errJson.detail && typeof errJson.detail === 'string' && errJson.detail.match(/scrap|block|login|copy and paste/i)) {
            userMessage = "Sorry, we couldn't analyze this link. This could be because the source link does not allow external tools to extract information. Please find a different public page, or, copy and paste the content manually and input it into the \"Text\" option.";
          }
        } catch {}
        if (!userMessage) userMessage = errText;
        throw new Error(userMessage);
      }
      const backendData = await backendResp.json();
      // Use the extracted text as the content for Perplexity
      const extracted = backendData.text;
      // Fallback if nothing extracted
      if (!extracted || extracted.length < 50) {
        throw new Error('No content extracted from backend.');
      }
      // Recursively call analyzeContent as 'text'
      return await analyzeContent(extracted, 'text');
    } catch (err) {
      console.error('Bridge backend error:', err);
      return JSON.stringify({
        summary: `Failed to extract content for analysis: ${err instanceof Error ? err.message : String(err)}`,
        accuracy: 'partially-accurate',
        confidence: 0,
        sources: []
      });
    }
  }

  // Type-specific prompt engineering
  let userPrompt = '';
  let systemPrompt = '';

  if (type === 'url') {
    systemPrompt = `You are a scientific fact-checker with access to current research databases and web scraping tools. Your job is to scrape the provided URL, analyze its content, and find REAL, ACCESSIBLE peer-reviewed research papers that support or contradict the claims.\n\nCRITICAL REQUIREMENTS:\n1. Scrape the content at the provided URL.\n2. Find at least 3-5 REAL research papers from PubMed, ArXiv, DOI links, or major scientific journals.\n3. Each paper MUST have a working URL that leads directly to the research.\n4. Provide detailed analysis of how each paper relates to the content's claims, with relevant quotes.\n5. Be thorough in your scientific assessment but strict about accuracy.\n\nMANDATORY JSON FORMAT - Return ONLY this exact structure:\n{\n  "summary": "Your detailed analysis of the content's scientific accuracy in plain text format without any markdown or special formatting. Explain what claims were made and how the research supports or contradicts them.",\n  "accuracy": "accurate|partially-accurate|inaccurate",\n  "confidence": 85,\n  "sources": [\n    {\n      "title": "Exact title of the research paper as published",\n      "url": "Direct working URL to the research paper (DOI, PubMed, ArXiv, journal website)",\n      "authors": "Author names and affiliations",\n      "journal": "Journal name, volume, issue, pages, year",\n      "summary": "What this study found and its methodology in 1-2 sentences",\n      "evidence": "Specifically how this research supports or contradicts the analyzed content in 1-2 sentences, with a relevant quote from the paper."
    }
  ]\n}\n\nSTRICT REQUIREMENTS:\n- Return ONLY the JSON object, nothing else\n- Find AT LEAST 3 research papers for every analysis\n- Use only peer-reviewed sources from reputable journals\n- Include working URLs to actual papers (DOI links, PubMed URLs, ArXiv links)\n- NO markdown formatting anywhere in the JSON\n- Make accuracy assessment based on scientific consensus from the sources you find\n- If you cannot find enough sources, indicate lower confidence and partial accuracy`;
    userPrompt = `Scrape and analyze the content at this URL for scientific accuracy using only peer-reviewed research: ${content}`;
  } else if (type === 'text') {
    systemPrompt = `You are a scientific fact-checker with access to current research databases. Your job is to analyze the provided text and find REAL, ACCESSIBLE peer-reviewed research papers that support or contradict the claims.\n\nCRITICAL REQUIREMENTS:\n1. Analyze the provided text.\n2. Find at least 3-5 REAL research papers from PubMed, ArXiv, DOI links, or major scientific journals.\n3. Each paper MUST have a working URL that leads directly to the research.\n4. Provide detailed analysis of how each paper relates to the content's claims, with relevant quotes.\n5. Be thorough in your scientific assessment but strict about accuracy.\n\nMANDATORY JSON FORMAT - Return ONLY this exact structure:\n{\n  "summary": "Your detailed analysis of the content's scientific accuracy in plain text format without any markdown or special formatting. Explain what claims were made and how the research supports or contradicts them.",\n  "accuracy": "accurate|partially-accurate|inaccurate",\n  "confidence": 85,\n  "sources": [\n    {\n      "title": "Exact title of the research paper as published",\n      "url": "Direct working URL to the research paper (DOI, PubMed, ArXiv, journal website)",\n      "authors": "Author names and affiliations",\n      "journal": "Journal name, volume, issue, pages, year",\n      "summary": "What this study found and its methodology in 1-2 sentences",\n      "evidence": "Specifically how this research supports or contradicts the analyzed content in 1-2 sentences, with a relevant quote from the paper."
    }
  ]\n}\n\nSTRICT REQUIREMENTS:\n- Return ONLY the JSON object, nothing else\n- Find AT LEAST 3 research papers for every analysis\n- Use only peer-reviewed sources from reputable journals\n- Include working URLs to actual papers (DOI links, PubMed URLs, ArXiv links)\n- NO markdown formatting anywhere in the JSON\n- Make accuracy assessment based on scientific consensus from the sources you find\n- If you cannot find enough sources, indicate lower confidence and partial accuracy`;
    userPrompt = `Analyze this text for scientific accuracy using only peer-reviewed research: ${content}`;
  } else if (type === 'pdf') {
    systemPrompt = `You are a scientific fact-checker with access to current research databases. Your job is to analyze the content of a PDF document (the user will provide the title or summary) and find REAL, ACCESSIBLE peer-reviewed research papers that support or contradict the claims.\n\nCRITICAL REQUIREMENTS:\n1. Analyze the provided PDF title/summary.\n2. Find at least 3-5 REAL research papers from PubMed, ArXiv, DOI links, or major scientific journals.\n3. Each paper MUST have a working URL that leads directly to the research.\n4. Provide detailed analysis of how each paper relates to the content's claims, with relevant quotes.\n5. Be thorough in your scientific assessment but strict about accuracy.\n\nMANDATORY JSON FORMAT - Return ONLY this exact structure:\n{\n  "summary": "Your detailed analysis of the content's scientific accuracy in plain text format without any markdown or special formatting. Explain what claims were made and how the research supports or contradicts them.",\n  "accuracy": "accurate|partially-accurate|inaccurate",\n  "confidence": 85,\n  "sources": [\n    {\n      "title": "Exact title of the research paper as published",\n      "url": "Direct working URL to the research paper (DOI, PubMed, ArXiv, journal website)",\n      "authors": "Author names and affiliations",\n      "journal": "Journal name, volume, issue, pages, year",\n      "summary": "What this study found and its methodology in 1-2 sentences",\n      "evidence": "Specifically how this research supports or contradicts the analyzed content in 1-2 sentences, with a relevant quote from the paper."
    }
  ]\n}\n\nSTRICT REQUIREMENTS:\n- Return ONLY the JSON object, nothing else\n- Find AT LEAST 3 research papers for every analysis\n- Use only peer-reviewed sources from reputable journals\n- Include working URLs to actual papers (DOI links, PubMed URLs, ArXiv links)\n- NO markdown formatting anywhere in the JSON\n- Make accuracy assessment based on scientific consensus from the sources you find\n- If you cannot find enough sources, indicate lower confidence and partial accuracy`;
    userPrompt = `Analyze the content of this PDF (title or summary provided) for scientific accuracy using only peer-reviewed research: ${content}`;
  } else {
    // fallback to text
    systemPrompt = `You are a scientific fact-checker with access to current research databases. Your job is to analyze the provided text and find REAL, ACCESSIBLE peer-reviewed research papers that support or contradict the claims.`;
    userPrompt = content;
  }

  try {
    const response = await fetch(PERPLEXITY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.1,
        top_p: 0.9,
        max_tokens: 4000,
        return_images: false,
        return_related_questions: false,
        search_recency_filter: 'year',
        frequency_penalty: 0.5,
        presence_penalty: 0
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API Error:', { status: response.status, statusText: response.statusText, body: errorText });
      throw new Error(`API request failed with status ${response.status}. ${errorText}`);
    }

    const data: PerplexityResponse = await response.json();
    console.log('=== RAW API RESPONSE ===');
    console.log(JSON.stringify(data, null, 2));
    
    if (!data.choices || data.choices.length === 0 || !data.choices[0].message || !data.choices[0].message.content) {
      console.error('Invalid response structure from Perplexity API:', data);
      throw new Error('Received an invalid response from the AI.');
    }

    const responseContent = data.choices[0].message.content;
    console.log('=== RAW RESPONSE CONTENT ===');
    console.log(responseContent);

    const result = parseAIResponse(responseContent, 'analysis');
    console.log('=== FINAL PARSED RESULT ===');
    console.log(result);
    return result;
    
  } catch (error) {
    console.error('=== ERROR IN ANALYZE CONTENT ===');
    console.error(error);
    
    const fallbackResponse = {
      summary: `Analysis failed due to an error: ${error instanceof Error ? error.message : 'Unknown error'}. The content could not be properly analyzed.`,
      accuracy: 'partially-accurate' as const,
      confidence: 0,
      sources: []
    };
    
    console.log('=== RETURNING FALLBACK RESPONSE ===');
    console.log(JSON.stringify(fallbackResponse));
    return JSON.stringify(fallbackResponse);
  }
};

function parseAIResponse(responseContent: string, type: 'chat' | 'analysis'): string {
  console.log(`=== PARSING ${type.toUpperCase()} RESPONSE ===`);
  console.log('Raw content length:', responseContent.length);
  console.log('Raw content:', responseContent);

  let cleanedContent = responseContent.trim();
  
  // Remove markdown code blocks
  cleanedContent = cleanedContent.replace(/^```json\s*/i, '');
  cleanedContent = cleanedContent.replace(/\s*```$/i, '');
  cleanedContent = cleanedContent.replace(/^```\s*/i, '');
  cleanedContent = cleanedContent.replace(/\s*```$/i, '');
  
  // Find JSON boundaries
  const firstBrace = cleanedContent.indexOf('{');
  const lastBrace = cleanedContent.lastIndexOf('}');
  
  if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
    console.error('No valid JSON braces found in response');
    console.log('Cleaned content:', cleanedContent);
    return createFallbackResponse(type, responseContent);
  }

  const jsonString = cleanedContent.substring(firstBrace, lastBrace + 1);
  console.log('=== EXTRACTED JSON STRING ===');
  console.log(jsonString);

  try {
    const parsed = JSON.parse(jsonString);
    console.log('=== SUCCESSFULLY PARSED JSON ===');
    console.log(parsed);
    
    if (type === 'analysis') {
      if (!parsed.summary || !parsed.accuracy || typeof parsed.confidence !== 'number') {
        console.error('Analysis JSON missing required fields:', parsed);
        return createFallbackResponse(type, responseContent);
      }
      if (!Array.isArray(parsed.sources)) {
        parsed.sources = [];
      }
      // If summary is a JSON string, parse and extract recursively
      let summaryValue = parsed.summary;
      while (typeof summaryValue === 'string' && summaryValue.trim().startsWith('{') && summaryValue.includes('"summary"')) {
        try {
          const summaryObj = JSON.parse(summaryValue);
          if (summaryObj.summary) summaryValue = summaryObj.summary;
          else break;
        } catch { break; }
      }
      parsed.summary = summaryValue;
      // Remove any fallback note line from summary
      if (parsed.summary) {
        parsed.summary = parsed.summary
          .split(/\n|\r/)
          .filter(line => !line.includes('Note: The analysis response could not be properly parsed'))
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
      }
      // If no sources, always set confidence very low and accuracy to 'partially-accurate' forcibly
      if (!parsed.sources || parsed.sources.length === 0) {
        parsed.confidence = 5;
        parsed.accuracy = 'partially-accurate';
      }
      parsed.summary = cleanMarkdown(parsed.summary);
      return JSON.stringify(parsed);
    } else if (type === 'chat') {
      if (!parsed.message) {
        console.error('Chat JSON missing required fields:', parsed);
        return createFallbackResponse(type, responseContent);
      }
      
      if (!Array.isArray(parsed.sources)) {
        parsed.sources = [];
      }
      
      console.log('✅ Valid chat JSON with', parsed.sources.length, 'sources');
      return JSON.stringify(parsed);
    }
    
  } catch (e) {
    console.error('❌ JSON Parse Error:', e instanceof Error ? e.message : 'Unknown parse error');
    console.log('Failed JSON string:', jsonString);
  }

  return createFallbackResponse(type, responseContent);
}

function cleanMarkdown(text: string): string {
  if (typeof text !== 'string') return String(text);
  
  return text
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italics
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links but keep text
    .replace(/^\s*[-*+]\s+/gm, '') // Remove bullet points
    .replace(/^\d+\.\s+/gm, '') // Remove numbered lists
    .replace(/\n\s*\n/g, ' ') // Replace multiple newlines with space
    .replace(/\n/g, ' ') // Replace single newlines with space
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

function createFallbackResponse(type: 'chat' | 'analysis', originalContent: string): string {
  console.warn(`⚠️ Creating fallback response for ${type}`);
  
  let fallbackResponse;
  if (type === 'analysis') {
    let summary = cleanMarkdown(originalContent);
    let accuracy: 'accurate' | 'partially-accurate' | 'inaccurate' = 'partially-accurate';
    let confidence = 30;
    
    if (originalContent.toLowerCase().includes('accurate') && !originalContent.toLowerCase().includes('inaccurate')) {
      accuracy = 'accurate';
      confidence = 60;
    } else if (originalContent.toLowerCase().includes('inaccurate')) {
      accuracy = 'inaccurate';
      confidence = 60;
    }
    
    if (summary.length > 500) {
      summary = summary.substring(0, 500) + '...';
    }
    
    summary += " Note: The analysis response could not be properly parsed, so detailed research sources are not available.";
    
    fallbackResponse = {
      summary,
      accuracy,
      confidence,
      sources: []
    };
  } else {
    fallbackResponse = {
      message: cleanMarkdown(originalContent).substring(0, 500) + (originalContent.length > 500 ? '...' : ''),
      sources: []
    };
  }
  
  const fallbackJson = JSON.stringify(fallbackResponse);
  console.log('=== CREATED FALLBACK RESPONSE ===');
  console.log(fallbackJson);
  return fallbackJson;
}
