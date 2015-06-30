from rest_framework import serializers

from wag.models import Choice, Option


class OptionSerializer(serializers.Serializer):
    val = serializers.IntegerField()
    count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Option
        fields = ('val', 'count')

    def update(self, instance, validated_data):
        instance.val = validated_data.get('val', instance.val)
        instance.save()
        return instance

    def create(self, validated_data):
        return Option.objects.create(**validated_data)


class ChoiceSerializer(serializers.Serializer):
    name = serializers.CharField(read_only=False)
    options = OptionSerializer(many=True, read_only=False)
    selected = serializers.IntegerField()

    class Meta:
        model = Choice
        fields = ('name', 'options', 'selected')

    def create(self, validated_data):

        if 'name' in validated_data and \
                        'selected' in validated_data and \
                        'options' in validated_data:

            name = validated_data.get('name')

            selected = validated_data.get('selected')

            choice = Choice(selected=selected, name=name)
            choice.save()

            for key in validated_data.get('options'):
                val = key.get("val")
                count = 0
                if val == selected:
                    count = 1
                option = Option(val=val, choice=choice, count=count)
                option.save()

            return choice

    def update(self, instance, validated_data):
        selected = validated_data.get('selected')
        for option in Option.objects.all():
            if option.choice == instance:
                if selected == option.val:
                    option.count += 1
                    option.save()
        instance.save()
        return instance
