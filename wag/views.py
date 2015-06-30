from rest_framework import status

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions

from wag.models import Choice

from wag.serializers import ChoiceSerializer


class ChoiceList(APIView):

    def get(self, request, format=None):
        choices = Choice.objects.all()
        serializer = ChoiceSerializer(choices, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = ChoiceSerializer(data=request.data)
        if serializer.is_valid():
            exists = Choice.objects.filter(name=serializer.validated_data.get("name")).exists()
            if not exists:
                serializer.create(serializer.validated_data).save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                choice = Choice.objects.get(name=serializer.validated_data.get("name"))
                serializer.update(choice, serializer.validated_data)
                return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

