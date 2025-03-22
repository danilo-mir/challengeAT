from django.urls import path
from . import views

urlpatterns = [
    path('', views.login, name="login"),
    path('home', views.home, name="home"),
    path('save-assets/', views.save_assets, name='save_assets'),
    path('get-asset-info/', views.get_asset_info, name='get_asset_info')
]
