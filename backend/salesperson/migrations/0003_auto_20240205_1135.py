# Generated by Django 2.2.28 on 2024-02-05 11:35

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('salesperson', '0002_assigneduser'),
    ]

    operations = [
        migrations.AlterField(
            model_name='salesperson',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
