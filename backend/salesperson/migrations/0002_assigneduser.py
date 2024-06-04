# Generated by Django 2.2.28 on 2024-02-02 08:19

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('salesperson', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AssignedUser',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('salesperson', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assigned_to_salesperson', to='salesperson.SalesPerson')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='sales_assigned_user', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]