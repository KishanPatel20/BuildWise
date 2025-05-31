from google import genai
from pydantic import BaseModel
import json
from dotenv import load_dotenv
import os
import PyPDF2
import docx

load_dotenv()

api_key = os.getenv("GEMINI_API")

class PersonalInfo(BaseModel):
    name: str | None = None
    title: str | None = None
    linkedin_url: str | None = None
    email: str | None = None
    phone: str | None = None
    location: str | None = None

class Experience(BaseModel):
    company: str | None = None
    location: str | None = None
    role: str | None = None
    start_date: str | None = None
    end_date: str | None = None
    responsibilities: list[str] | None = None

class Education(BaseModel):
    institution: str | None = None
    location: str | None = None
    degree: str | None = None
    start_date: str | None = None
    end_date: str | None = None

class TechnicalSkills(BaseModel):
    technical_skills: list[str] | None = None
    frameworks_libraries: list[str] | None = None
    tools: list[str] | None = None

class AdditionalInfo(BaseModel):
    info: list[str] | None = None

class Project(BaseModel):
    project_name: str | None = None
    description: str | None = None
    tech_stack: list[str] | None = None

class ResumeData(BaseModel):
    personal_info: PersonalInfo | None = None
    professional_experience: list[Experience] | None = None
    education: list[Education] | None = None
    technical_skills: TechnicalSkills | None = None
    additional_information: list[str] | None = None
    projects: list[Project] | None = None

def extract_text_from_file(file):
    """Extract text from PDF or DOCX file"""
    if file.name.endswith('.pdf'):
        pdf_reader = PyPDF2.PdfReader(file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text
    elif file.name.endswith('.docx'):
        doc = docx.Document(file)
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text
    else:
        raise ValueError("Unsupported file format. Please upload a PDF or DOCX file.")

def extract_resume_details(resume_content: str) -> ResumeData | None:
    """
    Extracts details from resume content using a Generative AI model.

    Args:
        resume_content: The text content of the resume.

    Returns:
        A ResumeData object containing the extracted information, or None if extraction fails.
    """
    client = genai.Client(api_key=api_key)
    prompt = f"""
    Extract ONLY the information that is EXPLICITLY mentioned in the resume content provided below.
    DO NOT make any assumptions or inferences about missing information.
    If a piece of information is not explicitly stated in the resume, set it to null.
    Format the extracted information as a JSON object according to the schema provided.

    Resume Content:
    ```
    {resume_content}
    ```

    JSON Schema:
    ```json
    {{
      "personal_info": {{
        "name": "string | null",
        "title": "string | null",
        "linkedin_url": "string | null",
        "email": "string | null",
        "phone": "string | null",
        "location": "string | null"
      }},
      "professional_experience": [
        {{
          "company": "string | null",
          "location": "string | null",
          "role": "string | null",
          "start_date": "string | null",
          "end_date": "string | null",
          "responsibilities": "list[string] | null"
        }}
      ],
      "education": [
        {{
          "institution": "string | null",
          "location": "string | null",
          "degree": "string | null",
          "start_date": "string | null",
          "end_date": "string | null"
        }}
      ],
      "technical_skills": {{
        "technical_skills": "list[string] | null",
        "frameworks_libraries": "list[string] | null",
        "tools": "list[string] | null"
      }},
      "additional_information": "list[string] | null",
      "projects": [
        {{
          "project_name": "string | null",
          "description": "string | null",
          "tech_stack": "list[string] | null"
        }}
      ]
    }}
    ```

    Important Rules:
    1. ONLY extract information that is EXPLICITLY stated in the resume
    2. DO NOT make assumptions about missing information
    3. DO NOT infer or guess values for any fields
    4. If a field is not explicitly mentioned, set it to null
    5. For dates, only extract if they are clearly stated in the resume
    6. For skills, only include those that are explicitly listed
    7. For projects, only include those that are clearly described
    8. For responsibilities, only include those that are explicitly stated
    9. If a section is not present in the resume, set all its fields to null
    10. Do not generate or infer any information that is not directly present in the resume

    Project Extraction Rules:
    1. Look for projects in ANY section of the resume, not just dedicated project sections
    2. Identify projects by looking for:
       - Project names or titles
       - Descriptions of work that appears to be a project
       - Bullet points or paragraphs that describe a specific project
       - Work that was done as part of a project
    3. Each project should have a name (can be extracted from the description if not explicitly stated)
    4. Include all projects mentioned anywhere in the resume
    5. If a project has no description, set it to an empty string
    6. Do not skip any projects mentioned in the resume
    7. For each project, extract the tech stack mentioned in its description
    8. Tech stack should include all technologies, frameworks, and tools mentioned for that specific project
    9. If no tech stack is mentioned for a project, set it to an empty list
    10. Projects can be found in:
        - Work experience sections
        - Dedicated project sections
        - Portfolio sections
        - Any other section that describes project work

    Ensure that the JSON object is valid and all extracted information is placed in the correct fields.
    If a piece of information is not found, set the corresponding field to null.
    For lists, if no items are found, return an empty list.
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": ResumeData,
            },
        )
        return response.parsed
    except Exception as e:
        print(f"Error during resume extraction: {e}")
        print(f"Raw response: {response.text if 'response' in locals() else 'No response'}")
        return None 