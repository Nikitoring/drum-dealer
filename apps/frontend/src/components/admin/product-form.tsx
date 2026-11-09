'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { DrmButton, DrmInput, DrmSelect, DrmTextarea } from '@/components/ui';
import {
  useAdminProduct,
  useCreateProduct,
  useDeleteProductImage,
  useUpdateProduct,
  useUploadProductImage,
} from '@/hooks/use-admin-products';
import { useCategories, useCreateCategory } from '@/hooks/use-categories';
import { useBrands, useCreateBrand } from '@/hooks/use-brands';
import type { CreateProductInput, Product, ProductCondition, ProductStatus } from '@/types/api';

const emptyProduct: CreateProductInput = {
  name: '',
  slug: '',
  brandId: '',
  categoryId: '',
  price: '',
  condition: 'USED',
  status: 'AVAILABLE',
  description: '',
  specifications: {},
};

export function AdminProductForm({ id }: { id?: string }) {
  const router = useRouter();
  const productQuery = useAdminProduct(id ?? '');
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct(id ?? '');
  const uploadImage = useUploadProductImage(id ?? '');
  const deleteImage = useDeleteProductImage(id ?? '');
  const categoriesQuery = useCategories();
  const createCategory = useCreateCategory();
  const brandsQuery = useBrands();
  const createBrand = useCreateBrand();

  const product = productQuery.data;
  const [form, setForm] = useState<CreateProductInput>(emptyProduct);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingBrand, setIsAddingBrand] = useState(false);

  useEffect(() => {
    if (id && product && !initialized) {
      setForm({
        ...emptyProduct,
        ...product,
        brandId: product.brandId ?? '',
        categoryId: product.categoryId ?? '',
        description: product.description ?? '',
        specifications: product.specifications ?? {},
      });
      setInitialized(true);
    }
  }, [id, initialized, product]);

  if (id && productQuery.isPending) return <p role="status">Загружаем товар…</p>;
  if (id && productQuery.isError) return <p role="alert">{productQuery.error.message}</p>;

  const setField = <K extends keyof CreateProductInput>(key: K, value: CreateProductInput[K]) =>
    setForm((current) => ({ ...current, [key]: value }));
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const payload = { ...form };
    if (form.specifications && typeof form.specifications === 'string') {
      try {
        const jsonSpec = JSON.parse(form.specifications);
        if (typeof jsonSpec !== 'object' || Array.isArray(jsonSpec)) {
          setError('Характеристики должны быть корректным JSON-объектом.');
          return;
        }
        payload.specifications = jsonSpec;
      } catch {
        setError('Характеристики должны быть корректным JSON.');
        return;
      }
    }

    const mutation = id ? updateProduct : createProduct;
    mutation.mutate(payload, {
      onSuccess: (saved) =>
        router.push(id ? '/admin/products' : `/admin/products/${saved.id}/edit`),
      onError: (reason) => setError(reason.message),
    });
  };

  return (
    <>
      <Link href="/admin/products">← Товары</Link>
      <h1 className="mt-8">{id ? 'Редактирование товара' : 'Новый товар'}</h1>
      <form className="admin-product-form mt-8 grid max-w-3xl gap-5" onSubmit={submit}>
        <label>
          Название
          <DrmInput
            required
            onChange={(event) => setField('name', event.target.value)}
            value={form.name}
          />
        </label>
        <label>
          Slug
          <DrmInput
            required
            onChange={(event) => setField('slug', event.target.value)}
            value={form.slug}
          />
        </label>
        <label>
          Бренд
          <DrmSelect
            required
            disabled={brandsQuery.isPending || isAddingBrand}
            onChange={(event) => {
              if (event.target.value === '__new__') {
                setIsAddingBrand(true);
                return;
              }
              setField('brandId', event.target.value);
            }}
            value={isAddingBrand ? '__new__' : form.brandId}
          >
            <option value="">Выберите бренд</option>
            {(brandsQuery.data ?? []).map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
            <option value="__new__">+ Добавить свой бренд</option>
          </DrmSelect>
          {isAddingBrand && (
            <div className="new-brand-control">
              <DrmInput
                autoFocus
                maxLength={80}
                onChange={(event) => setNewBrand(event.target.value)}
                placeholder="Название нового бренда"
                value={newBrand}
              />
              <div className="new-brand-actions">
                <DrmButton
                  className="button-outline-red"
                  disabled={!newBrand.trim() || createBrand.isPending}
                  onClick={() =>
                    createBrand.mutate(newBrand.trim(), {
                      onSuccess: (brand) => {
                        setField('brandId', brand.id);
                        setNewBrand('');
                        setIsAddingBrand(false);
                      },
                    })
                  }
                  type="button"
                >
                  {createBrand.isPending ? 'Добавляем…' : 'Добавить бренд'}
                </DrmButton>
                <DrmButton
                  className="button-link"
                  onClick={() => setIsAddingBrand(false)}
                  type="button"
                >
                  Отмена
                </DrmButton>
              </div>
              {createBrand.isError && <small role="alert">{createBrand.error.message}</small>}
            </div>
          )}
          {categoriesQuery.isError && <small role="alert">Не удалось загрузить категории.</small>}
        </label>
        <label>
          Категория
          <DrmSelect
            required
            disabled={categoriesQuery.isPending || isAddingCategory}
            onChange={(event) => {
              if (event.target.value === '__new__') {
                setIsAddingCategory(true);
                return;
              }
              setField('categoryId', event.target.value);
            }}
            value={isAddingCategory ? '__new__' : form.categoryId}
          >
            <option value="">Выберите категорию</option>
            {(categoriesQuery.data ?? []).map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
            <option value="__new__">+ Добавить свою категорию</option>
          </DrmSelect>
          {isAddingCategory && (
            <div className="new-category-control">
              <DrmInput
                autoFocus
                maxLength={80}
                onChange={(event) => setNewCategory(event.target.value)}
                placeholder="Название новой категории"
                value={newCategory}
              />
              <div className="new-category-actions">
                <DrmButton
                  className="button-outline-red"
                  disabled={!newCategory.trim() || createCategory.isPending}
                  onClick={() =>
                    createCategory.mutate(newCategory.trim(), {
                      onSuccess: (category) => {
                        setField('categoryId', category.id);
                        setNewCategory('');
                        setIsAddingCategory(false);
                      },
                    })
                  }
                  type="button"
                >
                  {createCategory.isPending ? 'Добавляем…' : 'Добавить категорию'}
                </DrmButton>
                <DrmButton
                  className="button-link"
                  onClick={() => setIsAddingCategory(false)}
                  type="button"
                >
                  Отмена
                </DrmButton>
              </div>
              {createCategory.isError && <small role="alert">{createCategory.error.message}</small>}
            </div>
          )}
          {categoriesQuery.isError && <small role="alert">Не удалось загрузить категории.</small>}
        </label>
        <label>
          Цена
          <DrmInput
            min="0"
            required
            onChange={(event) => setField('price', event.target.value)}
            type="number"
            value={form.price}
          />
        </label>
        <label>
          Состояние
          <DrmSelect
            onChange={(event) => setField('condition', event.target.value as ProductCondition)}
            value={form.condition}
          >
            <option value="NEW">Новый</option>
            <option value="USED">Б/у</option>
          </DrmSelect>
        </label>
        <label>
          Статус
          <DrmSelect
            onChange={(event) => setField('status', event.target.value as ProductStatus)}
            value={form.status}
          >
            <option value="AVAILABLE">В наличии</option>
            <option value="SOLD">Продан</option>
            <option value="HIDDEN">Скрыт</option>
          </DrmSelect>
        </label>
        <label>
          Описание
          <DrmTextarea
            onChange={(event) => setField('description', event.target.value)}
            rows={5}
            value={form.description ?? ''}
          />
        </label>
        <label>
          Характеристики (JSON)
          <DrmTextarea
            onChange={(event) => setField('specifications', event.target?.value)}
            rows={5}
            value={
              typeof form.specifications === 'string'
                ? form.specifications
                : JSON.stringify(form.specifications, null, 2)
            }
          />
        </label>
        {id && product && (
          <ProductImages product={product} uploadImage={uploadImage} deleteImage={deleteImage} />
        )}
        {error && <p role="alert">{error}</p>}
        <DrmButton
          className="button-red"
          disabled={createProduct.isPending || updateProduct.isPending}
          type="submit"
        >
          {createProduct.isPending || updateProduct.isPending ? 'Сохраняем…' : 'Сохранить'}
        </DrmButton>
      </form>
    </>
  );
}

function ProductImages({
  product,
  uploadImage,
  deleteImage,
}: {
  product: Product;
  uploadImage: ReturnType<typeof useUploadProductImage>;
  deleteImage: ReturnType<typeof useDeleteProductImage>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const images = Array.isArray(product.images) ? product.images : [];

  return (
    <section className="product-images-field mt-4 max-w-3xl">
      <h2>Изображения</h2>
      <input
        ref={inputRef}
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        disabled={uploadImage.isPending || images.length >= 10}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) uploadImage.mutate(file);
          event.currentTarget.value = '';
        }}
        type="file"
      />
      <DrmButton
        className="button-outline-red upload-image-button"
        disabled={uploadImage.isPending || images.length >= 10}
        onClick={() => inputRef.current?.click()}
        type="button"
      >
        {uploadImage.isPending ? 'Загружаем…' : 'Загрузить фото'}
      </DrmButton>
      <div className="mt-4 flex flex-wrap gap-4">
        {images.map((image) => (
          <div key={image.id ?? image.url} className="product-image-preview">
            <img alt="" className="h-24 w-24 object-cover" src={image.url} />
            <DrmButton
              aria-label="Удалить изображение"
              className="product-image-delete"
              disabled={deleteImage.isPending || !image.id}
              onClick={() => image.id && deleteImage.mutate(image.id)}
              title="Удалить изображение"
              type="button"
            >
              ×
            </DrmButton>
          </div>
        ))}
      </div>
    </section>
  );
}
