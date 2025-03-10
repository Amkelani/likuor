# Generated by Django 5.1.4 on 2025-01-11 19:01

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('likour', '0010_profile_address_delete_address'),
    ]

    operations = [
        migrations.AlterField(
            model_name='paymentdetail',
            name='order',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='likour.order'),
        ),
        migrations.RemoveField(
            model_name='orderitem',
            name='order',
        ),
        migrations.RemoveField(
            model_name='orderitem',
            name='product',
        ),
        migrations.RemoveField(
            model_name='order',
            name='delivery',
        ),
        migrations.AddField(
            model_name='order',
            name='delivery_address',
            field=models.CharField(default=None, max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='order',
            name='order_id',
            field=models.CharField(default=1, max_length=255),
            preserve_default=False,
        ),
        migrations.DeleteModel(
            name='OrderDetail',
        ),
        migrations.DeleteModel(
            name='OrderItem',
        ),
    ]
