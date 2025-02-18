from django.contrib import admin
from .models import Category, Product, Wishlist, Cart, CartItem, PaymentDetail, Order, \
    Carousel, Profile, Promocode


class ProductAdmin(admin.ModelAdmin):
    list_display= ('name',
                   'description',
                   'pack',
                   'price',
                   'image',
                   'is_hot',
                   'is_new',
                   'is_recommended',
                   'created_at',
                   'updated_at',
                   'quantity',
                   'tags')
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description','image')

class CarouselAdmin(admin.ModelAdmin):
    list_display = ('image', 'created_at')

admin.site.register(Product, ProductAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Carousel, CarouselAdmin)
admin.site.register(Profile)
admin.site.register(Wishlist)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Order)
admin.site.register(PaymentDetail)
admin.site.register(Promocode)