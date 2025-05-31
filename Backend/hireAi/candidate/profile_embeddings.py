import os
from typing import List, Dict, Any
import numpy as np
import faiss
from google import genai
from django.conf import settings
from .models import Candidate, Project, WorkExperience, Education

# Initialize Gemini client
genai.configure(api_key=settings.GEMINI_API_KEY)
client = genai.Client()

class ProfileEmbeddingManager:
    def __init__(self):
        # Initialize FAISS index for 1536-dimensional vectors
        self.dimension = 1536
        self.index = faiss.IndexFlatL2(self.dimension)
        self.candidate_ids = []  # Store candidate IDs in the same order as vectors

    def _get_embedding(self, text: str) -> List[float]:
        """Get embedding for a text using Gemini."""
        try:
            result = client.models.embed_content(
                model="gemini-embedding-exp-03-07",
                contents=text
            )
            return result.embeddings[0].values
        except Exception as e:
            print(f"Error getting embedding: {str(e)}")
            return [0.0] * self.dimension

    def _prepare_profile_text(self, candidate: Candidate) -> Dict[str, str]:
        """Prepare text for different sections of the profile."""
        # Basic profile information
        profile_text = f"""
        Name: {candidate.name}
        Current Role: {candidate.current_job_title or 'Not specified'}
        Company: {candidate.current_company or 'Not specified'}
        Experience: {candidate.experience or 0} years
        Skills: {candidate.skills or 'Not specified'}
        """

        # Skills section
        skills_text = candidate.skills or "No skills specified"

        # Experience summary
        work_experiences = WorkExperience.objects.filter(candidate=candidate)
        experience_text = "\n".join([
            f"Role: {exp.role_designation} at {exp.company_name} "
            f"({exp.start_date} to {exp.end_date or 'Present'})"
            for exp in work_experiences
        ]) or "No work experience specified"

        # Projects summary
        projects = Project.objects.filter(candidate=candidate)
        projects_text = "\n".join([
            f"Project: {proj.title}\n"
            f"Description: {proj.description}\n"
            f"Tech Stack: {proj.tech_stack}"
            for proj in projects
        ]) or "No projects specified"

        # Location preferences
        location_text = f"""
        Preferred Locations: {candidate.preferred_locations or 'Not specified'}
        Willing to Relocate: {'Yes' if candidate.willingness_to_relocate else 'No'}
        """

        return {
            "profile": profile_text,
            "skills": skills_text,
            "experience": experience_text,
            "projects": projects_text,
            "location": location_text
        }

    def generate_embeddings(self, candidate: Candidate) -> Dict[str, List[float]]:
        """Generate embeddings for all sections of a candidate's profile."""
        texts = self._prepare_profile_text(candidate)
        
        embeddings = {
            "profile_embedding": self._get_embedding(texts["profile"]),
            "skills_embedding": self._get_embedding(texts["skills"]),
            "experience_embedding": self._get_embedding(texts["experience"]),
            "projects_embedding": self._get_embedding(texts["projects"]),
            "location_embedding": self._get_embedding(texts["location"])
        }
        
        return embeddings

    def add_to_index(self, candidate: Candidate) -> None:
        """Add a candidate's profile to the FAISS index."""
        embeddings = self.generate_embeddings(candidate)
        
        # Add profile embedding to index
        vector = np.array([embeddings["profile_embedding"]], dtype=np.float32)
        self.index.add(vector)
        self.candidate_ids.append(candidate.id)

    def search_similar_profiles(self, query_text: str, k: int = 5) -> List[Dict[str, Any]]:
        """Search for similar profiles based on a query."""
        query_embedding = self._get_embedding(query_text)
        query_vector = np.array([query_embedding], dtype=np.float32)
        
        # Search in FAISS index
        distances, indices = self.index.search(query_vector, k)
        
        # Get candidate IDs for the results
        results = []
        for i, idx in enumerate(indices[0]):
            if idx < len(self.candidate_ids):
                candidate_id = self.candidate_ids[idx]
                candidate = Candidate.objects.get(id=candidate_id)
                results.append({
                    "candidate_id": candidate_id,
                    "name": candidate.name,
                    "similarity_score": float(1 / (1 + distances[0][i])),  # Convert distance to similarity score
                    "current_role": candidate.current_job_title,
                    "company": candidate.current_company
                })
        
        return results

    def save_index(self, filepath: str) -> None:
        """Save the FAISS index and candidate IDs to disk."""
        faiss.write_index(self.index, f"{filepath}.index")
        np.save(f"{filepath}_ids.npy", np.array(self.candidate_ids))

    def load_index(self, filepath: str) -> None:
        """Load the FAISS index and candidate IDs from disk."""
        self.index = faiss.read_index(f"{filepath}.index")
        self.candidate_ids = np.load(f"{filepath}_ids.npy").tolist()

# Create a singleton instance
embedding_manager = ProfileEmbeddingManager()

def update_profile_embeddings(candidate_id: int) -> None:
    """Update embeddings for a specific candidate."""
    try:
        candidate = Candidate.objects.get(id=candidate_id)
        embedding_manager.add_to_index(candidate)
        # Save the updated index
        embedding_manager.save_index("candidate_embeddings")
    except Exception as e:
        print(f"Error updating embeddings for candidate {candidate_id}: {str(e)}")

def search_candidates(query: str, k: int = 5) -> List[Dict[str, Any]]:
    """Search for candidates based on a query."""
    try:
        return embedding_manager.search_similar_profiles(query, k)
    except Exception as e:
        print(f"Error searching candidates: {str(e)}")
        return [] 