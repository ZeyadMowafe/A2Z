from fastapi import FastAPI, HTTPException, Depends, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from supabase import create_client, Client
import os
from dotenv import load_dotenv
import uuid
from unidecode import unidecode
import re

load_dotenv()

app = FastAPI(title="Auto Parts API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

security = HTTPBearer()

# Models
class CarBrand(BaseModel):
    id: Optional[int] = None
    name: str
    description: str
    logo_url: str
    color: str

class CarModel(BaseModel):
    id: Optional[int] = None
    brand_id: int
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None

class Category(BaseModel):
    id: Optional[int] = None
    name: str
    description: Optional[str] = None

class Product(BaseModel):
    id: Optional[int] = None
    name: str
    price: float
    category_id: int
    brand_id: Optional[int] = None
    model_id: Optional[int] = None
    image_url: str
    images: Optional[List[str]] = []  
    rating: Optional[float] = 4.5
    reviews_count: Optional[int] = 0
    stock_quantity: int
    description: Optional[str] = None

class CartItem(BaseModel):
    product_id: int
    quantity: int

class OrderCreate(BaseModel):
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    customer_address: Optional[str] = None
    items: List[CartItem]

class User(BaseModel):
    email: EmailStr
    password: str

# Search Helper Functions
def normalize_text(text: str) -> str:
    """Normalize text for better search matching"""
    if not text:
        return ""
    # Convert to lowercase
    text = text.lower()
    # Remove accents and special characters
    text = unidecode(text)
    # Remove extra spaces
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def calculate_relevance_score(product: dict, search_terms: list) -> int:
    """Calculate relevance score for a product based on search terms"""
    score = 0
    
    # Product name (highest priority)
    product_name = normalize_text(product.get('name', ''))
    for term in search_terms:
        if term in product_name:
            score += 10
            if product_name.startswith(term):
                score += 5  # Bonus for starting with search term
    
    # Description (medium priority)
    description = normalize_text(product.get('description', ''))
    for term in search_terms:
        if term in description:
            score += 3
    
    # Brand name (high priority)
    if product.get('car_brands'):
        brand_name = normalize_text(product['car_brands'].get('name', ''))
        for term in search_terms:
            if term in brand_name:
                score += 8
                if brand_name == term:
                    score += 5  # Exact match bonus
    
    # Model name (high priority)
    if product.get('car_models'):
        model_name = normalize_text(product['car_models'].get('name', ''))
        for term in search_terms:
            if term in model_name:
                score += 8
                if model_name == term:
                    score += 5  # Exact match bonus
    
    # Category name (medium priority)
    if product.get('categories'):
        category_name = normalize_text(product['categories'].get('name', ''))
        for term in search_terms:
            if term in category_name:
                score += 5
    
    return score

# Auth Helper
async def verify_admin_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        response = supabase.auth.get_user(credentials.credentials)
        
        if not response or not response.user:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user_id = response.user.id
        user_data = supabase.table("users").select("role").eq("id", user_id).execute()
        
        if not user_data.data:
            raise HTTPException(status_code=403, detail="User not found in database")
        
        if user_data.data[0].get("role") != "admin":
            raise HTTPException(status_code=403, detail="Admin access required")
        
        return response.user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")

# Image Upload Helpers
async def upload_logo_to_supabase(file: UploadFile) -> str:
    """Upload logo to Supabase Storage and return public URL"""
    try:
        print(f"[DEBUG] Starting logo upload for: {file.filename}")
        
        file_ext = file.filename.split('.')[-1]
        unique_filename = f"{uuid.uuid4()}.{file_ext}"
        print(f"[DEBUG] Generated filename: {unique_filename}")
        
        file_content = await file.read()
        print(f"[DEBUG] File size: {len(file_content)} bytes")
        
        result = supabase.storage.from_("brands-logos").upload(
            unique_filename,
            file_content,
            {"content-type": file.content_type}
        )
        print(f"[DEBUG] Upload result: {result}")
        
        public_url = supabase.storage.from_("brands-logos").get_public_url(unique_filename)
        
        if public_url.endswith('?'):
            public_url = public_url[:-1]
        
        print(f"[DEBUG] Final logo URL: {public_url}")
        
        return public_url
    except Exception as e:
        print(f"[ERROR] Logo upload failed: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to upload logo: {str(e)}")

async def upload_image_to_supabase(file: UploadFile) -> str:
    try:
        file_ext = file.filename.split('.')[-1]
        unique_filename = f"{uuid.uuid4()}.{file_ext}"
        
        file_content = await file.read()
        
        result = supabase.storage.from_("product-images").upload(
            unique_filename,
            file_content,
            {"content-type": file.content_type}
        )
        
        public_url = supabase.storage.from_("product-images").get_public_url(unique_filename)
        
        print(f"[DEBUG] Public URL: {public_url}")
        
        return public_url
    except Exception as e:
        print(f"[ERROR] Upload failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")

async def upload_model_image_to_supabase(file: UploadFile) -> str:
    """Upload model image to Supabase Storage and return public URL"""
    try:
        print(f"[DEBUG] Starting model image upload for: {file.filename}")
        
        file_ext = file.filename.split('.')[-1]
        unique_filename = f"{uuid.uuid4()}.{file_ext}"
        print(f"[DEBUG] Generated filename: {unique_filename}")
        
        file_content = await file.read()
        print(f"[DEBUG] File size: {len(file_content)} bytes")
        
        result = supabase.storage.from_("car-models").upload(
            unique_filename,
            file_content,
            {"content-type": file.content_type}
        )
        print(f"[DEBUG] Upload result: {result}")
        
        public_url = supabase.storage.from_("car-models").get_public_url(unique_filename)
        
        if public_url.endswith('?'):
            public_url = public_url[:-1]
        
        print(f"[DEBUG] Final model image URL: {public_url}")
        
        return public_url
    except Exception as e:
        print(f"[ERROR] Model image upload failed: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to upload model image: {str(e)}")

# Brands Endpoints
@app.get("/api/brands")
async def get_brands():
    result = supabase.table("car_brands").select("*").execute()
    return result.data

@app.post("/api/brands")
async def create_brand(
    name: str = Form(...),
    description: str = Form(...),
    color: str = Form(...),
    logo: UploadFile = File(...),
    admin=Depends(verify_admin_token)
):
    try:
        print(f"[DEBUG] Creating brand: {name}")
        
        logo_url = await upload_logo_to_supabase(logo)
        
        brand_data = {
            "name": name,
            "description": description,
            "color": color,
            "logo_url": logo_url
        }
        
        result = supabase.table("car_brands").insert(brand_data).execute()
        print(f"[DEBUG] Brand created successfully")
        return result.data[0]
    except Exception as e:
        print(f"[ERROR] Failed to create brand: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create brand: {str(e)}")

@app.put("/api/brands/{brand_id}")
async def update_brand(
    brand_id: int,
    name: str = Form(...),
    description: str = Form(...),
    color: str = Form(...),
    logo: UploadFile = File(None),
    existing_logo: Optional[str] = Form(None),
    admin=Depends(verify_admin_token)
):
    try:
        print(f"[DEBUG] Updating brand: {brand_id}")
        
        logo_url = existing_logo
        
        if logo and logo.filename:
            logo_url = await upload_logo_to_supabase(logo)
        
        brand_data = {
            "name": name,
            "description": description,
            "color": color,
            "logo_url": logo_url
        }
        
        result = supabase.table("car_brands").update(brand_data).eq("id", brand_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Brand not found")
        
        print(f"[DEBUG] Brand updated successfully")
        return result.data[0]
    except Exception as e:
        print(f"[ERROR] Failed to update brand: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to update brand: {str(e)}")

@app.delete("/api/brands/{brand_id}")
async def delete_brand(brand_id: int, admin=Depends(verify_admin_token)):
    supabase.table("car_brands").delete().eq("id", brand_id).execute()
    return {"message": "Brand deleted"}

# Models Endpoints
@app.get("/api/brands/{brand_id}/models")
async def get_models(brand_id: int):
    result = supabase.table("car_models").select("*").eq("brand_id", brand_id).execute()
    return result.data

@app.get("/api/models")
async def get_all_models():
    result = supabase.table("car_models").select("*").execute()
    return result.data

@app.post("/api/models")
async def create_model(
    name: str = Form(...),
    brand_id: int = Form(...),
    description: Optional[str] = Form(None),
    image: UploadFile = File(None),
    admin=Depends(verify_admin_token)
):
    try:
        print(f"\n[DEBUG] ========== Creating Model ==========")
        print(f"[DEBUG] Name: {name}")
        print(f"[DEBUG] Brand ID: {brand_id}")
        print(f"[DEBUG] Description: {description}")
        print(f"[DEBUG] Image: {image.filename if image else 'None'}")
        
        image_url = None
        if image and image.filename:
            print(f"[DEBUG] Uploading image: {image.filename}")
            image_url = await upload_model_image_to_supabase(image)
            print(f"[DEBUG] Image uploaded to: {image_url}")
        
        model_data = {
            "name": name,
            "brand_id": int(brand_id),
        }
        
        if description:
            model_data["description"] = description
            
        if image_url:
            model_data["image_url"] = image_url
        
        print(f"[DEBUG] Final model data: {model_data}")
        
        result = supabase.table("car_models").insert(model_data).execute()
        print(f"[DEBUG] Model created successfully: {result.data[0]}")
        print(f"[DEBUG] ========================================\n")
        
        return result.data[0]
    except Exception as e:
        print(f"[ERROR] Failed to create model: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to create model: {str(e)}")

@app.put("/api/models/{model_id}")
async def update_model(
    model_id: int,
    name: str = Form(...),
    brand_id: int = Form(...),
    description: Optional[str] = Form(None),
    image: UploadFile = File(None),
    existing_image: Optional[str] = Form(None),
    admin=Depends(verify_admin_token)
):
    try:
        print(f"\n[DEBUG] ========== Updating Model {model_id} ==========")
        print(f"[DEBUG] Name: {name}")
        print(f"[DEBUG] Brand ID: {brand_id}")
        
        image_url = existing_image
        
        if image and image.filename:
            print(f"[DEBUG] Uploading new image: {image.filename}")
            image_url = await upload_model_image_to_supabase(image)
            print(f"[DEBUG] New image uploaded to: {image_url}")
        
        model_data = {
            "name": name,
            "brand_id": int(brand_id),
        }
        
        if description:
            model_data["description"] = description
        
        if image_url:
            model_data["image_url"] = image_url
        
        print(f"[DEBUG] Update data: {model_data}")
        
        result = supabase.table("car_models").update(model_data).eq("id", model_id).execute()
        
        if not result.data:
            print(f"[ERROR] Model {model_id} not found")
            raise HTTPException(status_code=404, detail="Model not found")
        
        print(f"[DEBUG] Model updated successfully: {result.data[0]}")
        print(f"[DEBUG] ==========================================\n")
        
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] Failed to update model: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to update model: {str(e)}")

@app.delete("/api/models/{model_id}")
async def delete_model(model_id: int, admin=Depends(verify_admin_token)):
    supabase.table("car_models").delete().eq("id", model_id).execute()
    return {"message": "Model deleted"}

# Categories Endpoints
@app.get("/api/categories")
async def get_categories():
    result = supabase.table("categories").select("*").execute()
    return result.data

@app.post("/api/categories")
async def create_category(category: Category, admin=Depends(verify_admin_token)):
    data = category.dict(exclude={'id', 'created_at', 'updated_at'}, exclude_none=True)
    result = supabase.table("categories").insert(data).execute()
    return result.data[0]

@app.put("/api/categories/{category_id}")
async def update_category(category_id: int, category: Category, admin=Depends(verify_admin_token)):
    data = category.dict(exclude={'id', 'created_at', 'updated_at'}, exclude_none=True)
    result = supabase.table("categories").update(data).eq("id", category_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Category not found")
    return result.data[0]

@app.delete("/api/categories/{category_id}")
async def delete_category(category_id: int, admin=Depends(verify_admin_token)):
    supabase.table("categories").delete().eq("id", category_id).execute()
    return {"message": "Category deleted"}

# Products Endpoints
@app.post("/api/products")
async def create_product(
    name: str = Form(...),
    price: float = Form(...),
    category_id: int = Form(...),
    stock_quantity: int = Form(...),
    brand_id: Optional[int] = Form(None),
    model_id: Optional[int] = Form(None),
    description: Optional[str] = Form(None),
    images: List[UploadFile] = File(default=[]),
    admin=Depends(verify_admin_token)
):
    try:
        print(f"[DEBUG] Creating product: {name}")
        print(f"[DEBUG] Images received: {len(images) if images else 0}")
        
        image_urls = []
        if images and len(images) > 0:
            for image in images:
                if not image.filename:
                    continue
                print(f"[DEBUG] Uploading image: {image.filename}")
                url = await upload_image_to_supabase(image)
                print(f"[DEBUG] Image uploaded: {url}")
                image_urls.append(url)
        
        main_image = image_urls[0] if image_urls else ""
        additional_images = image_urls[1:] if len(image_urls) > 1 else []
        
        product_data = {
            "name": name,
            "price": float(price),
            "category_id": int(category_id),
            "stock_quantity": int(stock_quantity),
            "image_url": main_image,
            "images": additional_images
        }
        
        if description:
            product_data["description"] = description
        if brand_id and int(brand_id) > 0:
            product_data["brand_id"] = int(brand_id)
        if model_id and int(model_id) > 0:
            product_data["model_id"] = int(model_id)
        
        result = supabase.table("products").insert(product_data).execute()
        print(f"[DEBUG] Product created successfully")
        return result.data[0]
    except Exception as e:
        print(f"[ERROR] Failed to create product: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to create product: {str(e)}")

@app.put("/api/products/{product_id}")
async def update_product(
    product_id: int,
    name: str = Form(...),
    price: float = Form(...),
    category_id: int = Form(...),
    stock_quantity: int = Form(...),
    brand_id: Optional[int] = Form(None),
    model_id: Optional[int] = Form(None),
    description: Optional[str] = Form(None),
    images: List[UploadFile] = File(default=[]),
    existing_images: Optional[str] = Form(None),
    admin=Depends(verify_admin_token)
):
    try:
        import json
        
        print(f"[DEBUG] Updating product: {product_id}")
        
        existing_image_urls = []
        if existing_images and existing_images != 'null' and existing_images != '':
            try:
                existing_image_urls = json.loads(existing_images)
            except:
                existing_image_urls = []
        
        if images and len(images) > 0:
            for image in images:
                if not image.filename:
                    continue
                print(f"[DEBUG] Uploading image: {image.filename}")
                url = await upload_image_to_supabase(image)
                existing_image_urls.append(url)
        
        main_image = existing_image_urls[0] if existing_image_urls else ""
        additional_images = existing_image_urls[1:] if len(existing_image_urls) > 1 else []
        
        product_data = {
            "name": name,
            "price": float(price),
            "category_id": int(category_id),
            "stock_quantity": int(stock_quantity),
            "image_url": main_image,
            "images": additional_images
        }
        
        if description:
            product_data["description"] = description
        if brand_id and int(brand_id) > 0:
            product_data["brand_id"] = int(brand_id)
        else:
            product_data["brand_id"] = None
            
        if model_id and int(model_id) > 0:
            product_data["model_id"] = int(model_id)
        else:
            product_data["model_id"] = None
        
        result = supabase.table("products").update(product_data).eq("id", product_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Product not found")
        
        print(f"[DEBUG] Product updated successfully")
        return result.data[0]
    except Exception as e:
        print(f"[ERROR] Failed to update product: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to update product: {str(e)}")

@app.get("/api/products")
async def get_products(
    category_id: Optional[int] = None,
    brand_id: Optional[int] = None,
    model_id: Optional[int] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = None
):
    """
    Enhanced product search with relevance scoring and sorting.
    
    Parameters:
    - category_id: Filter by category
    - brand_id: Filter by brand
    - model_id: Filter by model
    - search: Search query with multi-word support
    - sort_by: Sort results (relevance, price_asc, price_desc, name)
    """
    
    query = supabase.table("products").select("""
        *,
        categories(id, name),
        car_brands(id, name, logo_url),
        car_models(id, name)
    """)
    
    if category_id:
        query = query.eq("category_id", category_id)
    if brand_id:
        query = query.eq("brand_id", brand_id)
    if model_id:
        query = query.eq("model_id", model_id)
    
    result = query.execute()
    products = result.data
    
    formatted_products = []
    for product in products:
        product_data = {
            **product,
            'category_name': product.get('categories', {}).get('name') if product.get('categories') else None,
            'brand_name': product.get('car_brands', {}).get('name') if product.get('car_brands') else None,
            'brand_logo': product.get('car_brands', {}).get('logo_url') if product.get('car_brands') else None,
            'model_name': product.get('car_models', {}).get('name') if product.get('car_models') else None,
        }
        formatted_products.append(product_data)
    
    if search:
        print(f"[DEBUG] Search query: '{search}'")
        
        normalized_search = normalize_text(search)
        search_terms = normalized_search.split()
        
        print(f"[DEBUG] Search terms: {search_terms}")
        
        scored_products = []
        for product in formatted_products:
            score = calculate_relevance_score(product, search_terms)
            
            if score > 0:
                product['relevance_score'] = score
                scored_products.append(product)
        
        print(f"[DEBUG] Found {len(scored_products)} matching products")
        
        if not sort_by or sort_by == "relevance":
            scored_products.sort(key=lambda x: x['relevance_score'], reverse=True)
        
        formatted_products = scored_products
    
    if sort_by and formatted_products:
        if sort_by == "price_asc":
            formatted_products.sort(key=lambda x: float(x.get('price', 0)))
        elif sort_by == "price_desc":
            formatted_products.sort(key=lambda x: float(x.get('price', 0)), reverse=True)
        elif sort_by == "name":
            formatted_products.sort(key=lambda x: normalize_text(x.get('name', '')))
    
    return formatted_products

@app.get("/api/products/{product_id}")
async def get_product(product_id: int):
    result = supabase.table("products").select("*").eq("id", product_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Product not found")
    return result.data[0]

@app.delete("/api/products/{product_id}")
async def delete_product(product_id: int, admin=Depends(verify_admin_token)):
    supabase.table("products").delete().eq("id", product_id).execute()
    return {"message": "Product deleted"}

# Search Suggestions Endpoint
@app.get("/api/search/suggestions")
async def get_search_suggestions(q: str):
    """
    Get search suggestions based on partial query.
    Returns brand names, model names, category names, and product names.
    """
    if not q or len(q) < 2:
        return []
    
    normalized_query = normalize_text(q)
    suggestions = []
    
    brands = supabase.table("car_brands").select("name").execute()
    for brand in brands.data:
        brand_name = brand.get('name', '')
        if normalized_query in normalize_text(brand_name):
            suggestions.append({
                "text": brand_name,
                "type": "brand"
            })
    
    models = supabase.table("car_models").select("name").execute()
    for model in models.data:
        model_name = model.get('name', '')
        if normalized_query in normalize_text(model_name):
            suggestions.append({
                "text": model_name,
                "type": "model"
            })
    
    categories = supabase.table("categories").select("name").execute()
    for category in categories.data:
        category_name = category.get('name', '')
        if normalized_query in normalize_text(category_name):
            suggestions.append({
                "text": category_name,
                "type": "category"
            })
    
    products = supabase.table("products").select("name").limit(5).execute()
    for product in products.data:
        product_name = product.get('name', '')
        if normalized_query in normalize_text(product_name):
            suggestions.append({
                "text": product_name,
                "type": "product"
            })
    
    seen = set()
    unique_suggestions = []
    for suggestion in suggestions:
        if suggestion['text'] not in seen:
            seen.add(suggestion['text'])
            unique_suggestions.append(suggestion)
    
    return unique_suggestions[:10]

# Popular Searches Endpoint
@app.get("/api/search/popular")
async def get_popular_searches():
    """
    Get popular search terms based on actual data.
    Returns top brands, models, and categories.
    """
    
    brands_query = supabase.table("products").select("brand_id, car_brands(name)").execute()
    brand_counts = {}
    for item in brands_query.data:
        if item.get('car_brands'):
            brand_name = item['car_brands']['name']
            brand_counts[brand_name] = brand_counts.get(brand_name, 0) + 1
    
    top_brands = sorted(brand_counts.items(), key=lambda x: x[1], reverse=True)[:5]
    
    categories_query = supabase.table("products").select("category_id, categories(name)").execute()
    category_counts = {}
    for item in categories_query.data:
        if item.get('categories'):
            category_name = item['categories']['name']
            category_counts[category_name] = category_counts.get(category_name, 0) + 1
    
    top_categories = sorted(category_counts.items(), key=lambda x: x[1], reverse=True)[:5]
    
    popular = []
    for brand, count in top_brands:
        popular.append(brand)
    for category, count in top_categories:
        if category not in popular:
            popular.append(category)
    
    return popular[:10]

# Orders Endpoints
@app.post("/api/orders")
async def create_order(order: OrderCreate):
    total = 0
    items_with_prices = []
    
    for item in order.items:
        product = supabase.table("products").select("price, name").eq("id", item.product_id).execute()
        if not product.data:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        
        price = float(product.data[0]["price"])
        total += price * item.quantity
        items_with_prices.append({
            "product_id": item.product_id,
            "quantity": item.quantity,
            "price": price,
            "product_name": product.data[0]["name"]
        })
    
    deposit = total * 0.5
    
    order_data = {
        "customer_name": order.customer_name,
        "customer_email": order.customer_email,
        "customer_phone": order.customer_phone,
        "customer_address": order.customer_address,
        "payment_method": "Vodafone Cash",
        "total_amount": total,
        "deposit_amount": deposit,
        "status": "pending"}
    
    print(f"[DEBUG] Order data before insert: {order_data}")
    
    order_result = supabase.table("orders").insert(order_data).execute()
    order_id = order_result.data[0]["id"]
    
    for item in items_with_prices:
        supabase.table("order_items").insert({
            "order_id": order_id,
            "product_id": item["product_id"],
            "quantity": item["quantity"],
            "price": item["price"]
        }).execute()
    
    return order_result.data[0]

@app.get("/api/orders")
async def get_orders(admin=Depends(verify_admin_token)):
    result = supabase.table("orders").select("*").order("created_at", desc=True).execute()
    return result.data

@app.get("/api/orders/{order_id}")
async def get_order(order_id: int, admin=Depends(verify_admin_token)):
    order = supabase.table("orders").select("*").eq("id", order_id).execute()
    if not order.data:
        raise HTTPException(status_code=404, detail="Order not found")
    
    items = supabase.table("order_items").select("*, products(*)").eq("order_id", order_id).execute()
    
    return {
        **order.data[0],
        "items": items.data
    }

@app.get("/api/orders/{order_id}/details")
async def get_order_details(order_id: int, admin=Depends(verify_admin_token)):
    """
    Get full order details including customer info and product details with brand, model, category.
    """
    order_result = supabase.table("orders").select("*").eq("id", order_id).execute()
    if not order_result.data:
        raise HTTPException(status_code=404, detail="Order not found")
    order = order_result.data[0]

    items_result = supabase.table("order_items").select("""
        *,
        products(
            *,
            car_brands(id, name, logo_url),
            car_models(id, name),
            categories(id, name)
        )
    """).eq("order_id", order_id).execute()
    items = items_result.data

    total_amount = sum(item["price"] * item["quantity"] for item in items)

    return {
        "id": order["id"],
        "customer_name": order.get("customer_name"),
        "customer_email": order.get("customer_email"),
        "customer_phone": order.get("customer_phone"),
        "customer_address": order.get("customer_address"),
        "payment_method": order.get("payment_method"),
        "status": order.get("status"),
        "total_amount": total_amount,
        "deposit_amount": order.get("deposit_amount"),
        "notes": order.get("notes"),
        "created_at": order.get("created_at"),
        "items": [
            {
                "product_id": item["product_id"],
                "quantity": item["quantity"],
                "price": item["price"],
                "product_name": item["products"]["name"] if item.get("products") else "Unknown",
                "product_image": item["products"]["image_url"] if item.get("products") else None,
                "brand_name": item["products"]["car_brands"]["name"] if item.get("products") and item["products"].get("car_brands") else None,
                "brand_logo": item["products"]["car_brands"]["logo_url"] if item.get("products") and item["products"].get("car_brands") else None,
                "model_name": item["products"]["car_models"]["name"] if item.get("products") and item["products"].get("car_models") else None,
                "category_name": item["products"]["categories"]["name"] if item.get("products") and item["products"].get("categories") else None,
            }
            for item in items
        ]
    }

@app.put("/api/orders/{order_id}/status")
async def update_order_status(order_id: int, status: str, admin=Depends(verify_admin_token)):
    result = supabase.table("orders").update({"status": status}).eq("id", order_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Order not found")
    return result.data[0]

# Auth Endpoints
@app.post("/api/auth/register")
async def register(user: User):
    try:
        result = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password
        })
        
        if result.user:
            supabase.table("users").insert({
                "id": result.user.id,
                "email": user.email,
                "role": "customer"
            }).execute()
        
        return {"message": "User registered successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/auth/login")
async def login(user: User):
    try:
        result = supabase.auth.sign_in_with_password({
            "email": user.email,
            "password": user.password
        })
        return {
            "access_token": result.session.access_token,
            "user": result.user
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/")
async def root():
    return {"message": "Auto Parts API", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)