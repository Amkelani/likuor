from rest_framework import serializers

from . import models



class CategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Category
        fields = ['id', 'name', 'image']

class CarouselSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Carousel
        fields = ['image']


class ProductSerializer(serializers.HyperlinkedModelSerializer):
    category = CategorySerializer(read_only=True, many=True,)
    class Meta:
        model = models.Product
        fields = ['id', 'name', 'description',
                  'pack', 'price', 'image',
                  'is_hot', 'is_new',
                  'is_recommended',
                  'created_at',
                  'updated_at',
                  'quantity',
                  'tags', 'category']