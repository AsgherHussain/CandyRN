from django.db import models
from home.models import UUIDModel


class Color(UUIDModel):
    """
    A data representation of the various available color selections and their hex codes
    """
    name = models.CharField(max_length=255)
    hex_code = models.CharField(max_length=7)

    def __str__(self):
        return self.name + ' : ' + self.hex_code

class Size(UUIDModel):
    """
    A data representation of the various available size selections
    """
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
