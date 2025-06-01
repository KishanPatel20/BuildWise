import axios from 'axios';
import { RecruiterSearchFilters, GroqProcessedFilters } from '@/types/recruiter';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

if (!GROQ_API_KEY) {
  console.error('GROQ_API_KEY is not set in environment variables');
}

// Helper function to extract JSON from LLM response
const extractJsonFromResponse = (content: string): string => {
  // Remove markdown code block if present
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || 
                   content.match(/\{[\s\S]*\}/);
  
  if (jsonMatch) {
    return jsonMatch[1] || jsonMatch[0];
  }
  
  throw new Error('No valid JSON found in response');
};

// Helper function to validate processed filters
const validateProcessedFilters = (filters: Partial<GroqProcessedFilters>): GroqProcessedFilters => {
  if (!filters.extractedFilters || !filters.userFilters || 
      typeof filters.confidence !== 'number' || 
      typeof filters.reasoning !== 'string' ||
      !Array.isArray(filters.considerations) ||
      !Array.isArray(filters.suggestedModifications)) {
    throw new Error('Invalid processed filters structure');
  }

  return {
    extractedFilters: filters.extractedFilters,
    userFilters: filters.userFilters,
    originalFilters: filters.originalFilters || {} as RecruiterSearchFilters,
    enhancedFilters: filters.enhancedFilters || {} as RecruiterSearchFilters,
    confidence: Math.min(Math.max(filters.confidence, 0), 1), // Ensure confidence is between 0 and 1
    reasoning: filters.reasoning,
    considerations: filters.considerations,
    suggestedModifications: filters.suggestedModifications
  };
};

export const processFiltersWithGroq = async (
  filters: RecruiterSearchFilters,
  jobDescription: string,
  extensiveFilters?: Partial<RecruiterSearchFilters>
): Promise<GroqProcessedFilters> => {
  try {
    // Get all possible filter keys from the RecruiterSearchFilters type
    const allFilterKeys = Object.keys(filters);

    // Filter out empty/default values to only include explicitly selected filters
    const activeFilters = Object.entries(filters).reduce((acc, [category, value]) => {
      // Skip empty arrays, zero ranges, and false booleans
      if (Array.isArray(value) && value.length === 0) return acc;
      if (typeof value === 'object' && value !== null) {
        // Handle nested objects
        const activeNestedFilters = Object.entries(value).reduce((nestedAcc, [key, nestedValue]) => {
          if (Array.isArray(nestedValue) && nestedValue.length > 0) {
            nestedAcc[key] = nestedValue;
          } else if (typeof nestedValue === 'object' && nestedValue !== null) {
            // Handle range objects (min/max)
            const range = nestedValue as { min: number; max: number };
            if (range.min !== 0 || range.max !== 0) {
              nestedAcc[key] = range;
            }
          } else if (typeof nestedValue === 'boolean' && nestedValue === true) {
            nestedAcc[key] = nestedValue;
          } else if (typeof nestedValue === 'string' && nestedValue.trim() !== '') {
            nestedAcc[key] = nestedValue;
          }
          return nestedAcc;
        }, {} as Record<string, unknown>);

        if (Object.keys(activeNestedFilters).length > 0) {
          acc[category] = activeNestedFilters;
        }
      }
      return acc;
    }, {} as Partial<RecruiterSearchFilters>);

    // Process extensive filters if provided
    const processedExtensiveFilters = extensiveFilters ? Object.entries(extensiveFilters).reduce((acc, [category, value]) => {
      if (value && typeof value === 'object') {
        const activeNestedFilters = Object.entries(value).reduce((nestedAcc, [key, nestedValue]) => {
          if (Array.isArray(nestedValue) && nestedValue.length > 0) {
            nestedAcc[key] = nestedValue;
          } else if (typeof nestedValue === 'object' && nestedValue !== null) {
            const range = nestedValue as { min: number; max: number };
            if (range.min !== 0 || range.max !== 0) {
              nestedAcc[key] = range;
            }
          } else if (typeof nestedValue === 'boolean' && nestedValue === true) {
            nestedAcc[key] = nestedValue;
          } else if (typeof nestedValue === 'string' && nestedValue.trim() !== '') {
            nestedAcc[key] = nestedValue;
          }
          return nestedAcc;
        }, {} as Record<string, unknown>);

        if (Object.keys(activeNestedFilters).length > 0) {
          acc[category] = activeNestedFilters;
        }
      }
      return acc;
    }, {} as Partial<RecruiterSearchFilters>) : {};

    const prompt = {
      system: `You are an AI recruitment assistant specialized in parsing and analyzing recruitment criteria.

IMPORTANT INSTRUCTIONS:
1. ONLY work with the filter keys that are provided in the input. Do not create new keys.
2. Extract information from the job description and prompt ONLY for the existing filter keys.
3. NEVER add default values or make assumptions about missing filters.
4. ONLY include values that are explicitly mentioned in either:
   - The job description
   - The user's prompt
   - The user's selected filters
   - The user's extensive filters

FILTER PROCESSING RULES:
1. For each existing filter key:
   - Look for relevant information in the job description
   - Look for relevant information in the user's prompt
   - Use any explicitly selected filter values
   - Consider any extensive filters provided
2. Only include a filter if it has explicit values from any of these sources
3. Do not modify or enhance filter values beyond what is explicitly provided
4. Maintain the exact structure of the provided filter keys
5. When both regular filters and extensive filters are provided for the same key:
   - Use the more specific/extensive values
   - Combine unique values from both sources
   - Maintain the most restrictive ranges

RESPONSE FORMAT:
Return a JSON object with ONLY the following structure:
{
  "extractedFilters": {
    // ONLY include filters that were found in job description or prompt
    // Use the EXACT same keys as provided in the input
    // Do not add new keys or default values
  },
  "userFilters": {
    // The combined filters from user's regular and extensive selections
    // Use the EXACT same keys as provided in the input
  },
  "confidence": number, // 0-1 score based on match quality
  "reasoning": string,  // Explanation of the analysis
  "considerations": string[], // Key points about the provided filters
  "suggestedModifications": [
    {
      "field": string,    // Existing filter field that could be modified
      "originalValue": any, // Current value
      "suggestedValue": any, // Suggested value based on explicit information
      "reason": string    // Why this modification is suggested
    }
  ]
}`,
      user: `Available Filter Keys: ${JSON.stringify(allFilterKeys)}

Job Description:
${jobDescription.trim() || 'No job description provided'}

User Selected Filters:
${Object.entries(activeFilters).length > 0 
  ? JSON.stringify(activeFilters, null, 2)
  : 'No specific filters selected by the user'}

User Extensive Filters:
${Object.entries(processedExtensiveFilters).length > 0
  ? JSON.stringify(processedExtensiveFilters, null, 2)
  : 'No extensive filters selected by the user'}

Please:
1. ONLY extract information for the provided filter keys
2. ONLY include values that are explicitly mentioned
3. Do not add any default values or assumptions
4. Maintain the exact structure of the provided keys
5. Consider both regular and extensive filters when available
6. Provide confidence score and reasoning based on explicit values only

Remember:
- Work ONLY with the provided filter keys
- Extract values ONLY from explicit mentions
- Do not create new keys or add default values
- Focus on mapping explicit information to existing keys
- Combine regular and extensive filters appropriately`,
      response_format: { type: "json_object" }
    };

    console.log('Sending to Groq API:', {
      availableFilterKeys: allFilterKeys,
      activeFilters: Object.keys(activeFilters).length > 0 ? activeFilters : 'No active filters',
      extensiveFilters: Object.keys(processedExtensiveFilters).length > 0 ? processedExtensiveFilters : 'No extensive filters',
      hasJobDescription: Boolean(jobDescription.trim())
    });

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: prompt.system },
          { role: "user", content: prompt.user }
        ],
        temperature: 0.9, // Lower temperature for more precise extraction
        max_tokens: 2000,
        response_format: prompt.response_format
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Groq API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(`Groq API Error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content in Groq API response');
    }

    console.log('Raw Groq API Response:', content);

    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const extractedJson = jsonMatch[0];
    console.log('Extracted JSON:', extractedJson);

    const processedFilters = JSON.parse(extractedJson) as GroqProcessedFilters;

    // Enhanced validation
    if (typeof processedFilters.confidence !== 'number' || 
        typeof processedFilters.reasoning !== 'string' ||
        !Array.isArray(processedFilters.considerations) ||
        !Array.isArray(processedFilters.suggestedModifications) ||
        !processedFilters.extractedFilters ||
        !processedFilters.userFilters) {
      throw new Error('Invalid response structure from Groq API');
    }

    // Validate that no new keys were added
    const validateFilterKeys = (filterObj: Partial<RecruiterSearchFilters>) => {
      const providedKeys = Object.keys(filterObj);
      const invalidKeys = providedKeys.filter(key => !allFilterKeys.includes(key));
      if (invalidKeys.length > 0) {
        throw new Error(`Invalid filter keys found: ${invalidKeys.join(', ')}`);
      }
    };

    validateFilterKeys(processedFilters.extractedFilters);
    validateFilterKeys(processedFilters.userFilters);
    if (extensiveFilters) {
      validateFilterKeys(extensiveFilters);
    }

    // Ensure confidence is between 0 and 1
    processedFilters.confidence = Math.min(Math.max(processedFilters.confidence, 0), 1);

    console.log('Processed Filters:', {
      extractedFilters: processedFilters.extractedFilters,
      userFilters: processedFilters.userFilters,
      confidence: processedFilters.confidence,
      considerations: processedFilters.considerations,
      suggestedModifications: processedFilters.suggestedModifications
    });

    return processedFilters;

  } catch (error) {
    console.error('Error processing filters with Groq:', error);
    throw error;
  }
};

interface SearchResult {
  email: string;
  name: string;
  current_role: string;
  company: string;
  total_similarity_score: number;
  aspect_scores: {
    profile: number;
    skills: number;
    experience: number;
    projects: number;
    education: number;
    location: number;
    additional: number;
  };
  aspect_queries: {
    profile: string;
    skills: string;
    experience: string;
    projects: string;
    education: string;
    location: string;
    additional: string;
  };
  user_token: string;
}

interface SearchResponse {
  results: SearchResult[];
  query: string;
  count: number;
  weights: {
    profile: number;
    skills: number;
    experience: number;
    projects: number;
    education: number;
    location: number;
    additional: number;
  };
}

interface RefinedMatchScore {
  matchScore: number;
  reasoning: string;
  topMatches: string[];
  considerations: string[];
}

export const processSearchResultsWithGroq = async (
  searchResponse: SearchResponse
): Promise<RefinedMatchScore[]> => {
  try {
    const prompt = {
      system: `You are an AI recruitment assistant specialized in analyzing candidate matches.

IMPORTANT INSTRUCTIONS:
1. Analyze the candidate's aspect scores and queries
2. Consider the weights provided for each aspect
3. Provide a refined match score (50-100) based on:
   - The quality of matches in each aspect
   - The importance (weight) of each aspect
   - The completeness of the candidate's profile
4. IMPORTANT: All scores must be between 50 and 100
   - Minimum score should be 50
   - Maximum score should be 100
   - Even for candidates with minimal matches, start at 50
5. Provide clear reasoning for the score
6. List top matching aspects
7. List any important considerations

RESPONSE FORMAT:
Return a JSON object with this structure:
{
  "scores": [
    {
      "matchScore": number, // MUST be between 50-100
      "reasoning": string,  // Clear explanation of the score
      "topMatches": string[], // List of top matching aspects
      "considerations": string[] // Important points to consider
    }
  ]
}`,
      user: `Search Results to Analyze:
${JSON.stringify(searchResponse, null, 2)}

Please analyze each candidate and provide:
1. A refined match score (MUST be between 50-100)
2. Clear reasoning for the score
3. Top matching aspects
4. Important considerations

Remember:
- ALL scores must be between 50 and 100
- Start at 50 for minimal matches
- Consider both scores and queries
- Weight the aspects according to their importance
- Be thorough in your analysis
- Provide actionable insights
- Return an array of scores, one for each candidate in the results`,
      response_format: { type: "json_object" }
    };

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: prompt.system },
          { role: "user", content: prompt.user }
        ],
        temperature: 0.2,
        max_tokens: 2000,
        response_format: prompt.response_format
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Groq API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(`Groq API Error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content in Groq API response');
    }

    console.log('Raw Groq Response:', content);

    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
    } catch (error) {
      console.error('Failed to parse Groq response:', content);
      throw new Error('Invalid JSON response from Groq API');
    }

    // Ensure we have the correct structure
    if (!parsedContent.scores || !Array.isArray(parsedContent.scores)) {
      console.error('Invalid response structure:', parsedContent);
      // If we got a single score object instead of an array, wrap it
      if (parsedContent.matchScore !== undefined) {
        parsedContent = { scores: [parsedContent] };
      } else {
        throw new Error('Invalid response structure from Groq API');
      }
    }

    const refinedScores = parsedContent.scores;

    // Validate each score in the array and ensure minimum score of 50
    refinedScores.forEach((score: any, index: number) => {
      if (typeof score.matchScore !== 'number' || 
          score.matchScore < 50 || 
          score.matchScore > 100 ||
          typeof score.reasoning !== 'string' ||
          !Array.isArray(score.topMatches) ||
          !Array.isArray(score.considerations)) {
        console.error('Invalid score structure:', score);
        // If score is below 50, adjust it to 50
        if (typeof score.matchScore === 'number' && score.matchScore < 50) {
          score.matchScore = 50;
          score.reasoning = `${score.reasoning} (Score adjusted to minimum threshold)`;
        } else {
          throw new Error(`Invalid refined score structure for candidate ${index}`);
        }
      }
    });

    // Ensure we have the same number of scores as candidates
    if (refinedScores.length !== searchResponse.results.length) {
      console.warn(`Mismatch in number of scores (${refinedScores.length}) and candidates (${searchResponse.results.length})`);
      // If we have fewer scores than candidates, pad with default scores
      while (refinedScores.length < searchResponse.results.length) {
        refinedScores.push({
          matchScore: 50, // Changed from 0 to 50
          reasoning: "Initial match score based on available data",
          topMatches: ["Basic profile match"],
          considerations: ["Candidate data needs further analysis"]
        });
      }
    }

    return refinedScores;

  } catch (error) {
    console.error('Error processing search results with Groq:', error);
    // Return default scores in case of error, with minimum score of 50
    return searchResponse.results.map(() => ({
      matchScore: 50, // Changed from 0 to 50
      reasoning: "Initial match score based on available data",
      topMatches: ["Basic profile match"],
      considerations: ["Unable to process detailed match at this time"]
    }));
  }
}; 