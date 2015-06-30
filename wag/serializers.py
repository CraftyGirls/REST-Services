from rest_framework import serializers

from wag.models import Choice, Option


class OptionSerializer(serializers.ModelSerializer):
    val = serializers.IntegerField()
    count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Option
        fields = ('val', 'count')


class ChoiceSerializer(serializers.ModelSerializer):
    name = serializers.CharField(read_only=False)
    options = OptionSerializer(many=True, read_only=True)

    class Meta:
        model = Choice
        fields = ('name',)

    def create(self, validated_data):
        return Choice.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.save()
        return instance
