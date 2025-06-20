import { toast } from 'sonner';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

interface GenerateQuestionsParams {
  candidateName: string;
  candidateRole: string;
  questionPrompt: string;
  matchScore: number;
}

interface Question {
  id: string;
  question: string;
  skill: string;
  selected: boolean;
}

const formatQuestions = (questions: any[]): Question[] => {
  return questions.map((q, index) => ({
    id: (index + 1).toString(),
    question: typeof q === 'string' ? q : q.question || q.text || '',
    skill: typeof q === 'string' ? 'Technical Assessment' : q.skill || 'Technical Assessment',
    selected: false
  }));
};

export const generateScreeningQuestions = async ({
  candidateName,
  candidateRole,
  questionPrompt,
  matchScore
}: GenerateQuestionsParams): Promise<Question[]> => {
  try {
    const systemPrompt = `You are an expert technical recruiter creating screening questions for candidates.
Your task is to generate 5 highly relevant screening questions that:
1. Are tailored to the candidate's role (${candidateRole})
2. Match the specified focus areas (${questionPrompt})
3. Consider the candidate's match score (${matchScore}%)
4. Cover different aspects of their expertise

Guidelines:
- Questions should be specific and technical
- Include a mix of technical and soft skills
- Each question should target a specific skill area
- Questions should be clear and concise
- Format each question with a skill category

Return the questions in this exact JSON format:
{
  "questions": [
    {
      "question": "Can you walk me through your experience with React hooks and how you've used them in production applications?",
      "skill": "React Development"
    }
  ]
}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Generate 5 screening questions for ${candidateName}, a ${candidateRole} with a ${matchScore}% match score. 
            Focus on: ${questionPrompt}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate questions');
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;
    
    try {
      // First attempt: Try to parse as JSON
      const parsedQuestions = JSON.parse(generatedText);
      if (parsedQuestions.questions && Array.isArray(parsedQuestions.questions)) {
        return formatQuestions(parsedQuestions.questions);
      }
    } catch (error) {
      console.log('JSON parsing failed, trying alternative formats');
    }

    // Second attempt: Try to extract JSON from markdown code blocks
    try {
      const jsonMatch = generatedText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[1];
        const parsedQuestions = JSON.parse(jsonStr);
        if (parsedQuestions.questions && Array.isArray(parsedQuestions.questions)) {
          return formatQuestions(parsedQuestions.questions);
        }
      }
    } catch (error) {
      console.log('Markdown JSON parsing failed, trying text format');
    }

    // Third attempt: Try to extract questions from markdown or text format
    const lines = generatedText.split('\n');
    const questions: any[] = [];
    let currentQuestion = '';
    let currentSkill = 'Technical Assessment';

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine) continue;

      // Check for numbered questions (e.g., "1. Question here")
      if (/^\d+\./.test(trimmedLine)) {
        if (currentQuestion) {
          questions.push({ question: currentQuestion, skill: currentSkill });
        }
        currentQuestion = trimmedLine.replace(/^\d+\.\s*/, '');
        continue;
      }

      // Check for bullet points (e.g., "- Question here" or "* Question here")
      if (trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
        if (currentQuestion) {
          questions.push({ question: currentQuestion, skill: currentSkill });
        }
        currentQuestion = trimmedLine.replace(/^[-*]\s*/, '');
        continue;
      }

      // Check for skill headers (e.g., "Skill: React Development")
      if (trimmedLine.toLowerCase().includes('skill:')) {
        currentSkill = trimmedLine.split(':')[1].trim();
        continue;
      }

      // Add to current question if it's not a special format
      if (currentQuestion) {
        currentQuestion += ' ' + trimmedLine;
      } else {
        currentQuestion = trimmedLine;
      }
    }

    // Add the last question if exists
    if (currentQuestion) {
      questions.push({ question: currentQuestion, skill: currentSkill });
    }

    // Ensure we have exactly 5 questions
    const formattedQuestions = formatQuestions(questions.slice(0, 5));
    
    // If we have fewer than 5 questions, pad with generic ones
    while (formattedQuestions.length < 5) {
      formattedQuestions.push({
        id: (formattedQuestions.length + 1).toString(),
        question: `Please describe your experience with ${candidateRole} and how it relates to this position.`,
        skill: 'General Assessment',
        selected: false
      });
    }

    return formattedQuestions;
  } catch (error) {
    console.error('Error generating questions:', error);
    toast.error('Failed to generate questions. Please try again.');
    throw error;
  }
};

export const generateEmailContent = async ({
  candidateName,
  candidateRole,
  selectedQuestions,
  tone,
  candidateId,
  candidateToken,
  recruiterId,
  recruiterToken
}: {
  candidateName: string;
  candidateRole: string;
  selectedQuestions: Question[];
  tone: 'friendly' | 'professional' | 'direct';
  candidateId: string;
  candidateToken: string;
  recruiterId: string;
  recruiterToken: string;
}): Promise<string> => {
  try {
    const toneText = {
      friendly: 'warm and approachable',
      professional: 'professional and formal',
      direct: 'clear and concise'
    }[tone];

    const interviewLink = `https://recorder-tau.vercel.app/interview/?candidate_id=${candidateId}&candidate_token=${candidateToken}&recruiter_id=${recruiterId}&recruiter_token=${recruiterToken}`;

    const systemPrompt = `You are an expert technical recruiter crafting personalized outreach messages.
Your task is to create a compelling message that:
1. Is personalized to the candidate (${candidateName}, ${candidateRole})
2. Matches the specified tone (${toneText})
3. Includes the video interview link
4. Maintains a professional yet engaging style

Guidelines:
- Keep the message concise but impactful (2-3 paragraphs)
- Include a clear introduction and purpose
- Include the video interview link: ${interviewLink}
- End with a clear call to action
- Maintain a ${toneText} tone throughout
- Mention that the link will expire in 7 days`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Generate a ${toneText} outreach message for ${candidateName}, a ${candidateRole}, 
            including the video interview link: ${interviewLink}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate email content');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating email content:', error);
    toast.error('Failed to generate email content. Please try again.');
    throw error;
  }
}; 