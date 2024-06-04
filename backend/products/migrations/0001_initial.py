# Generated by Django 2.2.28 on 2022-06-25 09:42

import django.contrib.postgres.fields
import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Brand',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=150)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=150)),
            ],
            options={
                'verbose_name_plural': 'Categories',
            },
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('per_pack_price', models.DecimalField(decimal_places=2, max_digits=7)),
                ('per_item_price', models.DecimalField(decimal_places=2, max_digits=7)),
                ('styles', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(blank=True, max_length=32), blank=True, null=True, size=None)),
                ('upload_date', models.DateField(auto_now_add=True)),
                ('half_pack_available', models.BooleanField(default=False)),
                ('half_pack_orders', django.contrib.postgres.fields.jsonb.JSONField(blank=True, default=dict)),
                ('half_pack_styles', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(blank=True, max_length=32), blank=True, null=True, size=None)),
                ('size_variance', models.CharField(choices=[('2S 2M 2L', '2S 2M 2L'), ('2S 2M 2L 2XL', '2S 2M 2L 2XL'), ('2XS 2S 2M 2L 2XL', '2XS 2S 2M 2L 2XL'), ('2XXS 2XS 2S 2M 2L 2XL', '2XXS 2XS 2S 2M 2L 2XL'), ('2XL 2XXL 2XXL', '2XL 2XXL 2XXXL'), ('1 3 5 7 9 11 13', '1 3 5 7 9 11 13'), ('0 1 3 5 7 9 11 13', '0 1 3 5 7 9 11 13'), ('14 16 18 20 22', '14 16 18 20 22')], default='2S 2M 2L', max_length=32)),
                ('type', models.CharField(choices=[('Catalog', 'Catalog'), ('Inventory', 'Inventory')], max_length=32)),
                ('brand', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='products', to='products.Brand')),
                ('category', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='products', to='products.Category')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Photo',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('image', models.ImageField(upload_to='products/images')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='photos', to='products.Product')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]