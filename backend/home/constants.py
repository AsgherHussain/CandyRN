PRODUCT_TYPE = (
    ('Catalog', 'Catalog'),
    ('Inventory', 'Inventory')
)

STATUS_TYPE = (
    ('Unmatched', 'Unmatched'),
    ('Unmatched_Reservation', 'Unmatched Reservation'),
    ('Pending', 'Pending'),
    ('Pending_Reservation', 'Pending Reservation'),
    ('Processing', 'Processing'),
    ('Confirmed', 'Confirmed'),
    ('Completed', 'Completed'),
    ('Cancelled', 'Cancelled'),
)

ORDER_STATUS_TYPE = (
    ('Pending', 'Pending'),
    ('Completed', 'Completed')
)

SIZE_TYPE = (
    ('S', 'S'),
    ('M', 'M'),
    ('L', 'L')
)

SIZE_VARIANCE = (
    ('S M L', 'S M L'),
    ('S M L XL', 'S M L XL'),
    ('XS S M L XL', 'XS S M L XL'),
    ('XXS XS S M L XL', 'XXS XS S M L XL'),
    ('XL XXL XXL', 'XL XXL XXXL'),
    ('1 3 5 7 9 11 13', '1 3 5 7 9 11 13'),
    ('0 1 3 5 7 9 11 13', '0 1 3 5 7 9 11 13'),
    ('14 16 18 20 22', '14 16 18 20 22')
)

UserTypes = (
        ('SALES_PERSON', 'SALES PERSON'),
    )
