# Generated by Django 2.2.28 on 2024-04-05 07:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('salesperson', '0004_auto_20240320_0743'),
        ('orders', '0020_order_updated_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='salesperson',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='orders_assigned', to='salesperson.SalesPerson'),
        ),
    ]
