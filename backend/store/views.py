import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
import random
import string

def enrich_product(product):
    """Adiciona campos extras ao produto"""
    if isinstance(product.get("image"), str):
        product["images"] = [product["image"]]
        del product["image"]

    # Preço com taxa é o "sale", regular é sem taxa
    price_sale = product["price"]
    price_regular = round(price_sale / 1.10, 2)
    tax_amount = round(10, 2)

    # Novos campos simulados
    product["code"] = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
    product["sku"] = f"SKU-{product['id']:04d}"
    product["quantity"] = random.randint(1, 100)
    product["price"] = {
        "regular": price_regular,
        "sale": price_sale,
        "tax": tax_amount
    }

    return product

class ProductListView(APIView):
    """Returns the list of products from the FakeStore API"""
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            response = requests.get("https://fakestoreapi.com/products")
            response.raise_for_status()
            products = response.json()

            enriched_products = [enrich_product(product) for product in products]
            
            print("Product", enriched_products)
     
            return Response(enriched_products)

        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to fetch product list", "details": str(e)},
                status=status.HTTP_502_BAD_GATEWAY
            )
        except ValueError:
            return Response(
                {"error": "Invalid response from external API"},
                status=status.HTTP_502_BAD_GATEWAY
            )


# class ProductDetailView(APIView):
#     """Returns details of a specific product"""
#     permission_classes = [AllowAny]

#     def get(self, request, product_id):
#         try:
#             response = requests.get(f"https://fakestoreapi.com/products/{product_id}")
#             response.raise_for_status()
#             product = response.json()

#             # Transforma 'image' em array
#             if isinstance(product.get("image"), str):
#                 product["images"] = [product["image"]]
#                 del product["image"]

#             return Response(product)

#         except requests.exceptions.HTTPError:
#             return Response(
#                 {"error": "Product not found"},
#                 status=status.HTTP_404_NOT_FOUND
#             )
#         except requests.exceptions.RequestException as e:
#             return Response(
#                 {"error": "Request to external API failed", "details": str(e)},
#                 status=status.HTTP_502_BAD_GATEWAY
#             )
#         except ValueError:
#             return Response(
#                 {"error": "Invalid response from external API"},
#                 status=status.HTTP_502_BAD_GATEWAY
#             )


# class ProductCreateView(APIView):
#     """Creates a new product via FakeStore API"""
#     permission_classes = [AllowAny]

#     def post(self, request):
#         product_data = request.data

#         try:
#             response = requests.post(
#                 "https://fakestoreapi.com/products",
#                 json=product_data
#             )
#             response.raise_for_status()
#             created_product = response.json()

#             if isinstance(created_product.get("image"), str):
#                 created_product["images"] = [created_product["image"]]
#                 del created_product["image"]

#             return Response(created_product, status=status.HTTP_201_CREATED)

#         except requests.exceptions.RequestException as e:
#             return Response(
#                 {"error": "Failed to create product", "details": str(e)},
#                 status=status.HTTP_502_BAD_GATEWAY
#             )
#         except ValueError:
#             return Response(
#                 {"error": "Invalid response from external API"},
#                 status=status.HTTP_502_BAD_GATEWAY
#             )


# class ProductUpdateView(APIView):
#     """Updates a product via FakeStore API"""
#     permission_classes = [AllowAny]

#     def put(self, request, product_id):
#         product_data = request.data

#         try:
#             response = requests.put(
#                 f"https://fakestoreapi.com/products/{product_id}",
#                 json=product_data
#             )
#             response.raise_for_status()
#             updated_product = response.json()

#             if isinstance(updated_product.get("image"), str):
#                 updated_product["images"] = [updated_product["image"]]
#                 del updated_product["image"]

#             return Response(updated_product)

#         except requests.exceptions.HTTPError:
#             return Response(
#                 {"error": "Product not found"},
#                 status=status.HTTP_404_NOT_FOUND
#             )
#         except requests.exceptions.RequestException as e:
#             return Response(
#                 {"error": "Failed to update product", "details": str(e)},
#                 status=status.HTTP_502_BAD_GATEWAY
#             )
#         except ValueError:
#             return Response(
#                 {"error": "Invalid response from external API"},
#                 status=status.HTTP_502_BAD_GATEWAY
#             )


# class ProductDeleteView(APIView):
#     """Deletes a product via FakeStore API"""
#     permission_classes = [AllowAny]

#     def delete(self, request, product_id):
#         try:
#             response = requests.delete(f"https://fakestoreapi.com/products/{product_id}")
#             response.raise_for_status()
#             deleted_data = response.json()

#             return Response(deleted_data, status=status.HTTP_200_OK)

#         except requests.exceptions.HTTPError:
#             return Response(
#                 {"error": "Product not found"},
#                 status=status.HTTP_404_NOT_FOUND
#             )
#         except requests.exceptions.RequestException as e:
#             return Response(
#                 {"error": "Failed to delete product", "details": str(e)},
#                 status=status.HTTP_502_BAD_GATEWAY
#             )
#         except ValueError:
#             return Response(
#                 {"error": "Invalid response from external API"},
#                 status=status.HTTP_502_BAD_GATEWAY
#             )
