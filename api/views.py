from rest_framework.generics import RetrieveAPIView, RetrieveUpdateDestroyAPIView, ListCreateAPIView
from rest_framework import permissions

from api.models import PDUser, Level
from api.serializers import LevelSerializer, PDUserSerializer
from api.permissions import IsOwnerOrReadOnly


class UserList(ListCreateAPIView):
    queryset = PDUser.objects.all()
    serializer_class = PDUserSerializer


class UserDetail(RetrieveAPIView):
    queryset = PDUser.objects.all()
    serializer_class = PDUserSerializer


class LevelList(ListCreateAPIView):
    queryset = Level.objects.all()
    serializer_class = LevelSerializer

    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def perform_create(self, serializer):
        owner = PDUser.objects.get(user_id=self.request.user.id)
        serializer.save(owner=owner)


class LevelDetail(RetrieveUpdateDestroyAPIView):
    queryset = Level.objects.all()
    serializer_class = LevelSerializer

    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly)


'''class LevelList(APIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get(self, request, format=None):
        levels = Level.objects.all()
        serializer = LevelSerializer(levels, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = LevelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class LevelDetail(APIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get_object(self, pk):
        try:
            return Level.objects.get(pk=pk)
        except Level.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        level = self.get_object(pk)
        serializer = LevelSerializer(level)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        snippet = self.get_object(pk)
        level = LevelSerializer(snippet, data=request.data)
        if level.is_valid():
            level.save()
            return Response(level.data)
        return Response(level.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        level = self.get_object(pk)
        level.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
'''