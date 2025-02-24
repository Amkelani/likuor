# Generated by Django 5.1.6 on 2025-02-16 17:32

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('likour', '0011_alter_paymentdetail_order_remove_orderitem_order_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='products',
        ),
        migrations.CreateModel(
            name='OrderProducts',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.CharField(max_length=2)),
                ('order_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='likour.order')),
                ('product_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='likour.product')),
            ],
        ),
    ]
