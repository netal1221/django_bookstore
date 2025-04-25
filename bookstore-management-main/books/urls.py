from django.urls import path
from . import views
from .views import CheckoutView
from .views import (
    BookListView, BookDetailView, BookCreateView,
    BookUpdateView, BookDeleteView, AddToCartView,
    CartView, RemoveFromCartView, UpdateCartItemView
)

urlpatterns = [
    path('', BookListView.as_view(), name='book-list'),
    path('book/<int:pk>/', BookDetailView.as_view(), name='book-detail'),
    path('book/new/', BookCreateView.as_view(), name='book-create'),
    path('book/<int:pk>/update/', BookUpdateView.as_view(), name='book-update'),
    path('book/<int:pk>/delete/', BookDeleteView.as_view(), name='book-delete'),
    path('cart/', CartView.as_view(), name='cart'),
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('add-to-cart/<int:pk>/', AddToCartView.as_view(), name='add-to-cart'),
    path('update-cart-item/<int:pk>/', UpdateCartItemView.as_view(), name='update-cart-item'),
    path('remove-from-cart/<int:pk>/', RemoveFromCartView.as_view(), name='remove-from-cart'),
]