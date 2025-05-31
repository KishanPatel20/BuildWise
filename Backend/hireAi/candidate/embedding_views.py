from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .profile_embeddings import update_profile_embeddings, search_candidates
from .models import Candidate

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_embeddings(request):
    """
    Update embeddings for a candidate profile.
    This endpoint should be called whenever a profile is updated.
    """
    try:
        candidate = Candidate.objects.get(user=request.user)
        update_profile_embeddings(candidate.id)
        return Response({
            'message': 'Profile embeddings updated successfully'
        })
    except Candidate.DoesNotExist:
        return Response({
            'error': 'Candidate profile not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': f'Error updating embeddings: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_similar_profiles(request):
    """
    Search for similar profiles based on a query.
    Query parameter 'q' should contain the search text.
    Optional parameter 'k' specifies the number of results (default: 5).
    """
    query = request.query_params.get('q')
    k = int(request.query_params.get('k', 5))

    if not query:
        return Response({
            'error': 'Query parameter "q" is required'
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        results = search_candidates(query, k)
        return Response({
            'results': results,
            'query': query,
            'count': len(results)
        })
    except Exception as e:
        return Response({
            'error': f'Error searching profiles: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 